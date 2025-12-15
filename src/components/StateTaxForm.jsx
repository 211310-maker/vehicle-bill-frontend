// src/components/StateTaxForm.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router';
import {
  borderBarriers,
  checkposts,
  fields,
  LOCAL_STORAGE_KEY,
} from '../constants';
import { getDetailsApi } from '../utils/api';
import ActionButtons from './ActionButtons';
import Header from './Header';
import Loader from './Loader';

const StateTaxForm = ({ stateKey }) => {
  const isLoggedIn = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));

  const state = stateKey;
  const history = useHistory();
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
  // raw checkpost options (may include `district` or `borderBarrier` as the district key)
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
    vehiclePermitType: '',
    seatingCapacityExcludingDriver: '',
    sleeperCapacityExcludingDriver: '',
    borderBarrier: '', // still named borderBarrier for backend compatibility but label shown as District
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
    grossVehicleWeight: '',
    unladenWeight: '',
    fitnessValidity: '',
    insuranceValidity: '',
    permitValidity: '',
    serviceType: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const form = useRef(null);

  // ✅ Passenger vs Goods
  const isPassengerVehicle =
    payLoad.vehiclePermitType && payLoad.vehiclePermitType !== 'GOODS VEHICLE';

  // ✅ Auto-clear serviceType when GOODS VEHICLE selected
  useEffect(() => {
    if (!isPassengerVehicle && payLoad.serviceType) {
      setPayLoad((p) => ({ ...p, serviceType: '' }));
    }
  }, [isPassengerVehicle]);

  // ✅ Auto-calc Total Amount = MV Tax + Service/User Charge
  useEffect(() => {
    const mv = Number(payLoad.mvTaxAmount || 0);
    const svc = Number(payLoad.serviceUserChargeAmount || 0);
    const total = mv + svc;

    setPayLoad((p) => ({
      ...p,
      totalAmount: total ? String(total) : '',
    }));
  }, [payLoad.mvTaxAmount, payLoad.serviceUserChargeAmount]);

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
      // Populate known keys. For borderBarrier we accept alternative names returned by backend.
      Object.keys(payLoad).forEach((key) => {
        // handle borderBarrier specially so we accept different shapes returned by backend
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
    let x = { ...payLoad };
    let p = {};
    Object.keys(x).forEach((e) => {
      p[e] = '';
    });
    setPayLoad({ ...p });
  };

  if (!isLoggedIn.accessState.includes(accessStateName)) {
    return (
      <>
        <Header />
        <div className='container text-center mt-4 '>
          <h3>No Access of this state</h3>
        </div>
      </>
    );
  }

  // filter checkposts by selected district (which is stored in `borderBarrier` for compatibility).
  // Accept either `cp.district` or `cp.borderBarrier` as metadata on the checkpost.
  const filteredCheckposts = (rawCheckpostOptions || []).filter((cp) => {
    if (!payLoad.borderBarrier) return true; // show all when no district selected
    if (cp.district) return cp.district === payLoad.borderBarrier;
    if (cp.borderBarrier) return cp.borderBarrier === payLoad.borderBarrier;
    // if checkpost has no district metadata, keep it (backwards compatibility)
    return true;
  });

  return (
    <>
      <Header />
      <div className='text-center'>
        <p className='login-heading mt-4'>
          <b>TAX PAYMENT FOR VEHICLES HAVING TOURIST PERMIT</b>{' '}
          <span>{stateDisplayName}</span>
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
                >
                  <option value=''>--Select Vehicle Type--</option>
                  {(stateFields.vehiclePermitType || []).map((type) => {
                    return (
                      <option value={type.name} key={type.name}>
                        {type.name}
                      </option>
                    );
                  })}
                </select>
              </div>
              {payLoad.vehiclePermitType !== 'GOODS VEHICLE' ? (
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
                        tabIndex='5'
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
                  {fields.taxMode.map((type) => {
                    return (
                      <option value={type.name} key={type.name}>
                        {type.name}
                      </option>
                    );
                  })}
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
                  {(stateFields.paymentMode || []).map((pay) => {
                    return (
                      <option key={pay.name} value={pay.name}>
                        {pay.name}
                      </option>
                    );
                  })}
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
                  {fields.fromState.map((type) => {
                    return (
                      <option key={type.name} value={type.name}>
                        {type.name}
                      </option>
                    );
                  })}
                </select>
              </div>

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
                      {payLoad.vehiclePermitType ===
                        'CONTRACT CARRIAGE/PASSANGER VEHICLES' && (
                        <>
                          <option value='THREE WHEELER(PASSENGER)'>
                            THREE WHEELER(PASSENGER)
                          </option>
                          <option value='MOTOR CAB'>MOTOR CAB</option>
                          <option value='MAXI CAB'>MAXI CAB</option>
                          <option value='OMNI BUS'>OMNI BUS</option>
                          <option value='BUS'>BUS</option>
                        </>
                      )}
                      {payLoad.vehiclePermitType === 'GOODS VEHICLE' && (
                        <>
                          <option value='LIGHT GOODS VEHICLE'>
                            LIGHT GOODS VEHICLE
                          </option>
                          <option value='MEDIUM GOODS VEHICLE'>
                            MEDIUM GOODS VEHICLE
                          </option>
                          <option value='HEAVY GOODS VEHICLE'>
                            HEAVY GOODS VEHICLE
                          </option>
                        </>
                      )}
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
                      disabled={isLoading}
                      value={payLoad.permitType}
                      onChange={onChangeHandler}
                      name='permitType'
                      id='permitType'
                    >
                      <option value=''>--Select Permit Type--</option>
                      {(stateFields.permitType || []).map((type) => {
                        return (
                          <option key={type.name} value={type.name}>
                            {type.name}
                          </option>
                        );
                      })}
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
                      {borderOptions.map((type) => {
                        return (
                          <option key={type.name} value={type.name}>
                            {type.name}
                          </option>
                        );
                      })}
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
                      {filteredCheckposts.map((type) => {
                        return (
                          <option key={type.name} value={type.name}>
                            {type.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              </div>

              {isPassengerVehicle && (
                <div className='form__control'>
                  <label
                    className='form__label d-block w-100 text-left'
                    htmlFor='serviceType'
                  >
                    Service Type<sup>*</sup>
                  </label>
                  <select
                    tabIndex='15'
                    required
                    disabled={isLoading}
                    value={payLoad.serviceType}
                    onChange={onChangeHandler}
                    name='serviceType'
                    id='serviceType'
                  >
                    <option value=''>--Select Service Type--</option>
                    <option value='NOT APPLICABLE'>NOT APPLICABLE</option>
                    <option value='ORDINARY'>ORDINARY</option>
                    <option value='DELUX AIR CONDITIONED'>
                      DELUX AIR CONDITIONED
                    </option>
                  </select>
                </div>
              )}

              <div className='row'>
                <div className='col-sm-6'>
                  <div className='form__control'>
                    <label
                      className='form__label d-block w-100 text-left'
                      htmlFor='fitnessValidity'
                    >
                      Fitness Validity
                    </label>
                    <input
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
                      Insurance Validity
                    </label>
                    <input
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
                  Permit Validity
                </label>
                <input
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

          {/* ✅ FIXED TABLE: valid HTML + two rows + normal text */}
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
                  onChange={onChangeHandler}
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

export default StateTaxForm;
