// src/pages/Puducherry.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router';
import {
  borderBarriers,
  checkposts,
  fields,
  LOCAL_STORAGE_KEY,
} from '../constants';
import { getDetailsApi } from '../utils/api';
import ActionButtons from '../components/ActionButtons';
import Header from '../components/Header';
import Loader from '../components/Loader';

// Puducherry vehicle class list (as per screenshot)
const PUDUCHERRY_VEHICLE_CLASS_OPTIONS = [
  'MOTOR CAB',
  'MOTOR CYCLE/SCOOTER-USED FOR HIRE',
  'OMNI BUS',
  'CAMPER VAN / TRAILER',
  'MAXI CAB',
  'THREE WHEELER (PASSENGER)',
  'BUS',
  'GOODS CARRIER',
];

// Permit Type depends on Vehicle Class
// GOODS CARRIER => GOODS VEHICLE only
// Others => NOT APPLICABLE only
const getPermitTypeOptionsByClass = (vehicleClass) => {
  if (!vehicleClass) return [];
  if (vehicleClass === 'GOODS CARRIER') return ['GOODS VEHICLE'];
  return ['NOT APPLICABLE'];
};

const Puducherry = () => {
  const isLoggedIn = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));

  const stateKey = 'puducherry';
  const state = stateKey;
  const history = useHistory();
  const form = useRef(null);

  const resolvedStateFieldKey =
    (fields.stateFieldsKeyMapping || {})[stateKey] || stateKey;
  const stateFields = fields[resolvedStateFieldKey] || {};
  const stateDisplayName = fields.stateName[stateKey] || stateKey;
  const accessStateName = fields.stateName[stateKey] || stateDisplayName;

  const borderOptions =
    borderBarriers[stateKey] ||
    borderBarriers[resolvedStateFieldKey] ||
    stateFields.borderBarrier ||
    [];

  const rawCheckpostOptions =
    checkposts[stateKey] ||
    checkposts[resolvedStateFieldKey] ||
    stateFields.checkpostName ||
    stateFields.checkPostName ||
    [];

  const [payLoad, setPayLoad] = useState({
    vehicleNo: '',
    chassisNo: '',
    mobileNo: '',

    // fixed dropdown (single option)
    vehiclePermitType: 'TRANSPORT',

    // passenger/goods dependent
    seatingCapacityExcludingDriver: '',
    sleeperCapacityExcludingDriver: '',
    grossVehicleWeight: '',
    unladenWeight: '',

    borderBarrier: '',
    totalAmount: '',
    mvTaxAmount: '',
    serviceUserChargeAmount: '',
    ownerName: '',
    fromState: '',
    vehicleClass: '',
    taxMode: '',
    taxFromDate: '',
    taxUptoDate: '',
    paymentMode: '',
    checkpostName: '',
    permitType: '',

    fitnessValidity: '',
    insuranceValidity: '',
    permitValidity: '',

    // added missing fields
    permitAuthorizationValidity: '',
    roadTaxValidity: '',

    // keep for compatibility, but Puducherry doesn't need it
    serviceType: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  // Passenger vs Goods by vehicleClass (Puducherry rule)
  const isGoodsVehicle = payLoad.vehicleClass === 'GOODS CARRIER';

  // Auto-calc Total Amount = MV Tax + Service/User Charge
  useEffect(() => {
    const mv = Number(payLoad.mvTaxAmount || 0);
    const svc = Number(payLoad.serviceUserChargeAmount || 0);
    const total = mv + svc;

    setPayLoad((p) => ({
      ...p,
      totalAmount: total ? String(total) : '',
    }));
  }, [payLoad.mvTaxAmount, payLoad.serviceUserChargeAmount]);

  // When Vehicle Class changes:
  // - set Permit Type according to mapping
  // - clear opposite fields to avoid mixed validation problems
  useEffect(() => {
    const opts = getPermitTypeOptionsByClass(payLoad.vehicleClass);

    setPayLoad((p) => ({
      ...p,
      permitType: opts[0] || '',
      // Clear opposite set
      ...(payLoad.vehicleClass === 'GOODS CARRIER'
        ? {
            seatingCapacityExcludingDriver: '',
            sleeperCapacityExcludingDriver: '',
          }
        : { grossVehicleWeight: '', unladenWeight: '' }),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payLoad.vehicleClass]);

  const getDetailsHandler = async () => {
    if (!payLoad.vehicleNo) {
      alert('Please enter vehicle no.');
      return;
    }
    setIsLoading(true);
    const { data, error } = await getDetailsApi({
      vehicleNo: payLoad.vehicleNo,
    });
    setIsLoading(false);

    if (error) {
      alert(error.message || 'Failed to fetch vehicle details');
      return;
    }

    if (data && data.success) {
      const preLoadedData = {};

      Object.keys(payLoad).forEach((key) => {
        if (key === 'borderBarrier') {
          if (data.detail && data.detail.borderBarrier) {
            preLoadedData.borderBarrier = data.detail.borderBarrier;
          } else if (data.detail && data.detail.districtName) {
            preLoadedData.borderBarrier = data.detail.districtName;
          } else if (data.detail && data.detail.district) {
            preLoadedData.borderBarrier = data.detail.district;
          }
          return;
        }

        if (
          data.detail &&
          data.detail[key] !== undefined &&
          data.detail[key] !== null &&
          data.detail[key] !== ''
        ) {
          preLoadedData[key] = data.detail[key];
        }
      });

      // enforce fixed vehicle type
      preLoadedData.vehiclePermitType = 'TRANSPORT';

      setPayLoad((e) => ({
        ...e,
        ...preLoadedData,
      }));
    } else if (data && data.message) {
      alert(data.message);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const payLoadWithDefaults = {
      ...payLoad,
      unladenWeight: payLoad.unladenWeight || 0,
    };
    history.push('/select-payment', {
      formData: {
        ...payLoadWithDefaults,
        state,
      },
    });
  };

  const onChangeHandler = (e) => {
    setPayLoad((old) => ({ ...old, [e.target.name]: e.target.value }));
  };

  const onResetHandler = () => {
    const x = { ...payLoad };
    const p = {};
    Object.keys(x).forEach((k) => (p[k] = ''));
    p.vehiclePermitType = 'TRANSPORT';
    setPayLoad({ ...p });
  };

  if (!isLoggedIn?.accessState?.includes(accessStateName)) {
    return (
      <>
        <Header />
        <div className='container text-center mt-4 '>
          <h3>No Access of this state</h3>
        </div>
      </>
    );
  }

  const filteredCheckposts = (rawCheckpostOptions || []).filter((cp) => {
    if (!payLoad.borderBarrier) return true;
    if (cp.district) return cp.district === payLoad.borderBarrier;
    if (cp.borderBarrier) return cp.borderBarrier === payLoad.borderBarrier;
    return true;
  });

  const permitTypeOptions = getPermitTypeOptionsByClass(payLoad.vehicleClass);

  return (
    <>
      <Header />
      <div className='text-center'>
        <p className='login-heading mt-4'>
          <b>Border Tax Payment for Entry Into</b> <span>{stateDisplayName}</span>
        </p>
      </div>

      <div className='box box--main'>
        <div className='box__heading--blue'>Tax Payment Details</div>

        <form
          ref={form}
          onSubmit={onSubmitHandler}
          className='service-type tax-details mt-4'
        >
          <div className='row'>
            <div className='col-6'>
              <div className='form__control'>
                <label
                  className='form__label d-block w-100 text-left'
                  htmlFor='vehicleNo'
                >
                  Vehicle No.<sup>*</sup>
                </label>
                <input
                  tabIndex='1'
                  required
                  maxLength='10'
                  autoFocus
                  inputMode='text'
                  disabled={isLoading}
                  value={payLoad.vehicleNo}
                  onChange={onChangeHandler}
                  className='form__input w-100'
                  type='text'
                  id='vehicleNo'
                  name='vehicleNo'
                />
              </div>

              <div className='form__control'>
                <label
                  className='form__label d-block w-100 text-left'
                  htmlFor='chassisNo'
                >
                  Chassis No.<sup>*</sup>
                </label>
                <input
                  required
                  tabIndex='2'
                  maxLength='19'
                  inputMode='text'
                  disabled={isLoading}
                  onChange={onChangeHandler}
                  value={payLoad.chassisNo}
                  className='form__input w-100'
                  type='text'
                  id='chassisNo'
                  name='chassisNo'
                />
              </div>

              <div className='form__control'>
                <label
                  className='form__label d-block w-100 text-left'
                  htmlFor='mobileNo'
                >
                  Mobile No.<sup>*</sup>
                </label>
                <input
                  required
                  tabIndex='3'
                  disabled={isLoading}
                  value={payLoad.mobileNo}
                  onChange={onChangeHandler}
                  placeholder='SMS about payment will be sent to this number '
                  className='form__input w-100'
                  type='text'
                  id='mobileNo'
                  inputMode='tel'
                  maxLength='10'
                  minLength='10'
                  name='mobileNo'
                />
              </div>

              {/* Vehicle Type (single option, same markup like StateTaxForm) */}
              <div className='form__control'>
                <label
                  className='form__label d-block w-100 text-left'
                  htmlFor='vehiclePermitType'
                >
                  Vehicle Type<sup>*</sup>
                </label>
                <select
                  tabIndex='4'
                  value={payLoad.vehiclePermitType}
                  onChange={onChangeHandler}
                  required
                  name='vehiclePermitType'
                  id='vehiclePermitType'
                  disabled
                >
                  <option value='TRANSPORT'>TRANSPORT</option>
                </select>
              </div>

              {/* Passenger vs Goods fields */}
              {!isGoodsVehicle ? (
                <div className='row'>
                  <div className='col-sm-6'>
                    <div className='form__control'>
                      <label
                        className='form__label d-block w-100 text-left'
                        htmlFor='seatingCapacityExcludingDriver'
                      >
                        Seating Capacity(Ex. Driver)<sup>*</sup>
                      </label>
                      <input
                        required
                        tabIndex='5'
                        min='0'
                        disabled={isLoading}
                        onChange={onChangeHandler}
                        className='form__input w-100'
                        type='number'
                        value={payLoad.seatingCapacityExcludingDriver}
                        id='seatingCapacityExcludingDriver'
                        name='seatingCapacityExcludingDriver'
                      />
                    </div>
                  </div>

                  <div className='col-sm-6'>
                    <div className='form__control'>
                      <label
                        className='form__label d-block w-100 text-left'
                        htmlFor='sleeperCapacityExcludingDriver'
                      >
                        Sleeper Capacity<sup>*</sup>
                      </label>
                      <input
                        tabIndex='6'
                        required
                        min='0'
                        disabled={isLoading}
                        onChange={onChangeHandler}
                        value={payLoad.sleeperCapacityExcludingDriver}
                        className='form__input w-100'
                        type='number'
                        id='sleeperCapacityExcludingDriver'
                        name='sleeperCapacityExcludingDriver'
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className='row'>
                  <div className='col-sm-6'>
                    <div className='form__control'>
                      <label
                        className='form__label d-block w-100 text-left'
                        htmlFor='grossVehicleWeight'
                      >
                        Gross Vehicle Wt.(in kg)<sup>*</sup>
                      </label>
                      <input
                        required
                        tabIndex='5'
                        min='0'
                        disabled={isLoading}
                        onChange={onChangeHandler}
                        className='form__input w-100'
                        type='number'
                        value={payLoad.grossVehicleWeight}
                        id='grossVehicleWeight'
                        name='grossVehicleWeight'
                      />
                    </div>
                  </div>
                  <div className='col-sm-6'>
                    <div className='form__control'>
                      <label
                        className='form__label d-block w-100 text-left'
                        htmlFor='unladenWeight'
                      >
                        Unladen Wt.(in kg)<sup>*</sup>
                      </label>
                      <input
                        required
                        tabIndex='6'
                        min='0'
                        disabled={isLoading}
                        onChange={onChangeHandler}
                        className='form__input w-100'
                        type='number'
                        value={payLoad.unladenWeight}
                        id='unladenWeight'
                        name='unladenWeight'
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className='form__control'>
                <label
                  className='form__label d-block w-100 text-left'
                  htmlFor='taxMode'
                >
                  Tax Mode<sup>*</sup>
                </label>
                <select
                  tabIndex='7'
                  required
                  disabled={isLoading}
                  onChange={onChangeHandler}
                  value={payLoad.taxMode}
                  name='taxMode'
                  id='taxMode'
                >
                  <option value=''>--Select Tax Mode--</option>
                  {fields.taxMode.map((type) => (
                    <option value={type.name} key={type.name}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className='form__control'>
                <label
                  className='form__label d-block w-100 text-left'
                  htmlFor='paymentMode'
                >
                  Payment Mode<sup>*</sup>
                </label>
                <select
                  tabIndex='8'
                  required
                  disabled={isLoading}
                  value={payLoad.paymentMode}
                  onChange={onChangeHandler}
                  name='paymentMode'
                  id='paymentMode'
                >
                  <option value=''>--Select Payment Mode--</option>
                  {(stateFields.paymentMode || []).map((pay) => (
                    <option key={pay.name} value={pay.name}>
                      {pay.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className='col-6'>
              <div className='form__control text-left'>
                <label className='form__label d-block w-100 text-left'>
                  &nbsp;
                </label>
                {isLoading && <Loader className='loader__get-details' />}
                {!isLoading && (
                  <button
                    disabled={isLoading}
                    type='button'
                    onClick={getDetailsHandler}
                    className='box__button get-details'
                  >
                    <span className='glyphicon glyphicon-arrow-down mr-3'></span>
                    Get Details
                  </button>
                )}
              </div>

              <div className='form__control'>
                <label
                  className='form__label d-block w-100 text-left'
                  htmlFor='ownerName'
                >
                  Owner Name<sup>*</sup>
                </label>
                <input
                  required
                  tabIndex='9'
                  disabled={isLoading}
                  className='form__input w-100'
                  type='text'
                  id='ownerName'
                  inputMode='text'
                  name='ownerName'
                  onChange={onChangeHandler}
                  value={payLoad.ownerName}
                />
              </div>

              <div className='form__control'>
                <label
                  className='form__label d-block w-100 text-left'
                  htmlFor='fromState'
                >
                  From State<sup>*</sup>
                </label>
                <select
                  tabIndex='10'
                  disabled={isLoading}
                  required
                  value={payLoad.fromState}
                  onChange={onChangeHandler}
                  name='fromState'
                  id='fromState'
                >
                  <option value=''>--Select State--</option>
                  {fields.fromState.map((type) => (
                    <option key={type.name} value={type.name}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Vehicle Class + Permit Type (dependent) */}
              <div className='row'>
                <div className='col-sm-6'>
                  <div className='form__control'>
                    <label
                      className='form__label d-block w-100 text-left'
                      htmlFor='vehicleClass'
                    >
                      Vehicle Class<sup>*</sup>
                    </label>
                    <select
                      tabIndex='11'
                      required
                      disabled={isLoading}
                      value={payLoad.vehicleClass}
                      onChange={onChangeHandler}
                      name='vehicleClass'
                      id='vehicleClass'
                    >
                      <option value=''>--Select Vehicle Class--</option>
                      {PUDUCHERRY_VEHICLE_CLASS_OPTIONS.map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className='col-sm-6'>
                  <div className='form__control'>
                    <label
                      className='form__label d-block w-100 text-left'
                      htmlFor='permitType'
                    >
                      Permit Type<sup>*</sup>
                    </label>
                    <select
                      required
                      tabIndex='12'
                      disabled={isLoading || !payLoad.vehicleClass}
                      value={payLoad.permitType}
                      onChange={onChangeHandler}
                      name='permitType'
                      id='permitType'
                    >
                      <option value=''>--Select Permit Type--</option>
                      {permitTypeOptions.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className='row'>
                <div className='col-sm-6'>
                  <div className='form__control'>
                    <label
                      className='form__label d-block w-100 text-left'
                      htmlFor='borderBarrier'
                    >
                      District<sup>*</sup>
                    </label>
                    <select
                      tabIndex='13'
                      required
                      disabled={isLoading}
                      value={payLoad.borderBarrier}
                      onChange={onChangeHandler}
                      name='borderBarrier'
                      id='borderBarrier'
                    >
                      <option value=''>--Select District--</option>
                      {borderOptions.map((type) => (
                        <option key={type.name} value={type.name}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className='col-sm-6'>
                  <div className='form__control'>
                    <label
                      className='form__label d-block w-100 text-left'
                      htmlFor='checkpostName'
                    >
                      Checkpost Name<sup>*</sup>
                    </label>
                    <select
                      tabIndex='14'
                      required
                      disabled={isLoading}
                      value={payLoad.checkpostName}
                      onChange={onChangeHandler}
                      name='checkpostName'
                      id='checkpostName'
                    >
                      <option value=''>--Select Checkpost Name--</option>
                      {filteredCheckposts.map((type) => (
                        <option key={type.name} value={type.name}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Validity fields (include missing ones) */}
              <div className='row'>
                <div className='col-sm-6'>
                  <div className='form__control'>
                    <label
                      className='form__label d-block w-100 text-left'
                      htmlFor='fitnessValidity'
                    >
                      Fitness Validity<sup>*</sup>
                    </label>
                    <input
                      required
                      tabIndex='16'
                      disabled={isLoading}
                      className='form__input w-100'
                      type='date'
                      id='fitnessValidity'
                      name='fitnessValidity'
                      onChange={onChangeHandler}
                      value={payLoad.fitnessValidity}
                    />
                  </div>
                </div>

                <div className='col-sm-6'>
                  <div className='form__control'>
                    <label
                      className='form__label d-block w-100 text-left'
                      htmlFor='insuranceValidity'
                    >
                      Insurance Validity<sup>*</sup>
                    </label>
                    <input
                      required
                      tabIndex='17'
                      disabled={isLoading}
                      className='form__input w-100'
                      type='date'
                      id='insuranceValidity'
                      name='insuranceValidity'
                      onChange={onChangeHandler}
                      value={payLoad.insuranceValidity}
                    />
                  </div>
                </div>
              </div>

              <div className='form__control'>
                <label
                  className='form__label d-block w-100 text-left'
                  htmlFor='permitValidity'
                >
                  Permit Validity<sup>*</sup>
                </label>
                <input
                  required
                  tabIndex='18'
                  disabled={isLoading}
                  className='form__input w-100'
                  type='date'
                  id='permitValidity'
                  name='permitValidity'
                  onChange={onChangeHandler}
                  value={payLoad.permitValidity}
                />
              </div>

              <div className='row'>
                <div className='col-sm-6'>
                  <div className='form__control'>
                    <label
                      className='form__label d-block w-100 text-left'
                      htmlFor='permitAuthorizationValidity'
                    >
                      Permit Authorization Validity<sup>*</sup>
                    </label>
                    <input
                      required
                      tabIndex='18.1'
                      disabled={isLoading}
                      className='form__input w-100'
                      type='date'
                      id='permitAuthorizationValidity'
                      name='permitAuthorizationValidity'
                      onChange={onChangeHandler}
                      value={payLoad.permitAuthorizationValidity}
                    />
                  </div>
                </div>

                <div className='col-sm-6'>
                  <div className='form__control'>
                    <label
                      className='form__label d-block w-100 text-left'
                      htmlFor='roadTaxValidity'
                    >
                      Road Tax Validity<sup>*</sup>
                    </label>
                    <input
                      required
                      tabIndex='18.2'
                      disabled={isLoading}
                      className='form__input w-100'
                      type='date'
                      id='roadTaxValidity'
                      name='roadTaxValidity'
                      onChange={onChangeHandler}
                      value={payLoad.roadTaxValidity}
                    />
                  </div>
                </div>
              </div>

              {/* Tax date fields (same placement like StateTaxForm = correct formatting) */}
              <div className='row'>
                <div className='col-sm-6'>
                  <div className='form__control'>
                    <label
                      className='form__label d-block w-100 text-left'
                      htmlFor='taxFromDate'
                    >
                      Tax From Date<sup>*</sup>
                    </label>
                    <input
                      required
                      tabIndex='19'
                      disabled={isLoading}
                      className='form__input w-100'
                      type='datetime-local'
                      id='taxFromDate'
                      name='taxFromDate'
                      onChange={onChangeHandler}
                      value={payLoad.taxFromDate}
                    />
                  </div>
                </div>
                <div className='col-sm-6'>
                  <div className='form__control'>
                    <label
                      className='form__label d-block w-100 text-left'
                      htmlFor='taxUptoDate'
                    >
                      Tax Upto Date<sup>*</sup>
                    </label>
                    <input
                      required
                      tabIndex='20'
                      disabled={isLoading}
                      className='form__input w-100'
                      id='taxUptoDate'
                      name='taxUptoDate'
                      type='datetime-local'
                      value={payLoad.taxUptoDate}
                      onChange={onChangeHandler}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* TABLE (same as StateTaxForm) */}
          <div className='row mt-3'>
            <div className='col-12'>
              <table className='hr-table'>
                <thead>
                  <tr>
                    <th className='hr-table-1'>SI. No.</th>
                    <th className='hr-table-2'>Particulars</th>
                    <th>Tax From</th>
                    <th>Tax Upto</th>
                    <th>Amount</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td className='hr-table-body'>
                      <span className='hr-table-text'>1</span>
                    </td>
                    <td className='hr-table-body'>
                      <span className='hr-table-text'>MV Tax</span>
                    </td>
                    <td className='hr-table-body'>
                      <span className='hr-table-text'>
                        {payLoad.taxFromDate || '-'}
                      </span>
                    </td>
                    <td className='hr-table-body'>
                      <span className='hr-table-text'>
                        {payLoad.taxUptoDate || '-'}
                      </span>
                    </td>
                    <td className='hr-table-body'>
                      <input
                        min='0'
                        disabled={isLoading}
                        value={payLoad.mvTaxAmount}
                        onChange={onChangeHandler}
                        className='form__input w-100'
                        type='number'
                        id='mvTaxAmount'
                        name='mvTaxAmount'
                        placeholder='0'
                      />
                    </td>
                  </tr>

                  <tr>
                    <td className='hr-table-body'>
                      <span className='hr-table-text'>2</span>
                    </td>
                    <td className='hr-table-body'>
                      <span className='hr-table-text'>Service/User Charge</span>
                    </td>
                    <td className='hr-table-body'>
                      <span className='hr-table-text'>
                        {payLoad.taxFromDate || '-'}
                      </span>
                    </td>
                    <td className='hr-table-body'>
                      <span className='hr-table-text'>
                        {payLoad.taxUptoDate || '-'}
                      </span>
                    </td>
                    <td className='hr-table-body'>
                      <input
                        min='0'
                        disabled={isLoading}
                        value={payLoad.serviceUserChargeAmount}
                        onChange={onChangeHandler}
                        className='form__input w-100'
                        type='number'
                        id='serviceUserChargeAmount'
                        name='serviceUserChargeAmount'
                        placeholder='0'
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <br />
          <div className='row'>
            <div className='col-sm-6'>
              <div className='form__control'>
                <label
                  className='form__label d-block w-100 text-left'
                  htmlFor='totalAmount'
                >
                  Total amount<sup>*</sup>
                </label>
                <input
                  required
                  tabIndex='21'
                  min='0'
                  disabled={isLoading}
                  readOnly
                  value={payLoad.totalAmount}
                  className='form__input w-100'
                  type='number'
                  id='totalAmount'
                  name='totalAmount'
                />
              </div>
            </div>
            <div className='col-sm-6'>
              <label className='form__label d-block w-100 text-left'>
                &nbsp;
              </label>
              <ActionButtons
                tabIndex='22'
                isDisabled={isLoading}
                onReset={onResetHandler}
              />
            </div>
          </div>
        </form>

        <br />
      </div>

      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </>
  );
};

export default Puducherry;
