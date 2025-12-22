// src/pages/Tripura.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router';
import { borderBarriers, checkposts, fields, LOCAL_STORAGE_KEY } from '../constants';
import { getDetailsApi } from '../utils/api';
import Header from '../components/Header';
import Loader from '../components/Loader';
import ActionButtons from '../components/ActionButtons';

const Tripura = () => {
  const isLoggedIn = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
  const history = useHistory();

  const stateKey = 'tripura';
  const state = stateKey;

  const resolvedStateFieldKey =
    (fields.stateFieldsKeyMapping || {})[stateKey] || stateKey;

  const stateFields = fields[resolvedStateFieldKey] || {};
  const stateDisplayName = fields.stateName[stateKey] || stateKey;
  const accessStateName = fields.stateName[stateKey] || stateDisplayName;

  const districtOptions =
    borderBarriers[stateKey] ||
    borderBarriers[resolvedStateFieldKey] ||
    stateFields.borderBarrier ||
    [];

  const rawBarrierOptions =
    checkposts[stateKey] ||
    checkposts[resolvedStateFieldKey] ||
    stateFields.checkpostName ||
    stateFields.checkPostName ||
    [];

  const [isLoading, setIsLoading] = useState(false);
  const form = useRef(null);

  const [payLoad, setPayLoad] = useState({
    vehicleNo: '',
    chassisNo: '',
    mobileNo: '',

    vehiclePermitType: '',
    vehicleClass: '',
    fromState: '',
    ownerName: '',

    grossVehicleWeight: '',

    // screenshot shows these 2
    aitpPermitValidity: '',
    aitpPermitAuthValidity: '',

    taxMode: '',
    taxFromDate: '',
    taxUptoDate: '',

    // screenshot labels
    borderBarrier: '',    // District
    checkpostName: '',    // Barrier Name

    // table + total
    mvTaxAmount: '',
    totalAmount: '',
  });

  useEffect(() => {
    const mv = Number(payLoad.mvTaxAmount || 0);
    setPayLoad((p) => ({
      ...p,
      totalAmount: mv ? String(mv) : '',
    }));
  }, [payLoad.mvTaxAmount]);

  const onChangeHandler = (e) => {
    setPayLoad((old) => ({ ...old, [e.target.name]: e.target.value }));
  };

  const onResetHandler = () => {
    const p = {};
    Object.keys(payLoad).forEach((k) => (p[k] = ''));
    setPayLoad({ ...p });
  };

  const getDetailsHandler = async () => {
    if (!payLoad.vehicleNo) {
      alert('Please enter vehicle no.');
      return;
    }
    setIsLoading(true);

    const { data, error } = await getDetailsApi({ vehicleNo: payLoad.vehicleNo });

    setIsLoading(false);

    if (error) {
      alert(error.message || 'Failed to fetch vehicle details');
      return;
    }

    if (data && data.success) {
      const preLoadedData = {};

      Object.keys(payLoad).forEach((key) => {
        if (key === 'borderBarrier') {
          if (data.detail && data.detail.borderBarrier) preLoadedData.borderBarrier = data.detail.borderBarrier;
          else if (data.detail && data.detail.districtName) preLoadedData.borderBarrier = data.detail.districtName;
          else if (data.detail && data.detail.district) preLoadedData.borderBarrier = data.detail.district;
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

      setPayLoad((p) => ({ ...p, ...preLoadedData }));
    } else if (data && data.message) {
      alert(data.message);
    }
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();

    history.push('/select-payment', {
      formData: {
        ...payLoad,
        state,
      },
    });
  };

  // filter barrier list by selected district if mapping exists
  const filteredBarriers = (rawBarrierOptions || []).filter((cp) => {
    if (!payLoad.borderBarrier) return true;
    if (cp.district) return cp.district === payLoad.borderBarrier;
    if (cp.borderBarrier) return cp.borderBarrier === payLoad.borderBarrier;
    return true;
  });

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

  return (
    <>
      <Header />

      <div className='text-center'>
        <p className='login-heading mt-4'>
          <b>BORDER TAX PAYMENT FOR ENTRY INTO</b> <span>{stateDisplayName}</span>
        </p>
      </div>

      <div className='box box--main'>
        <div className='box__heading--blue'>Tax Payment Details</div>

        <form ref={form} onSubmit={onSubmitHandler} className='service-type tax-details mt-4'>
          <div className='row'>
            {/* LEFT */}
            <div className='col-6'>
              <div className='form__control'>
                <label className='form__label d-block w-100 text-left' htmlFor='vehicleNo'>
                  Vehicle No.<sup>*</sup>
                </label>
                <input
                  tabIndex='1'
                  required
                  maxLength='10'
                  autoFocus
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
                <label className='form__label d-block w-100 text-left' htmlFor='chassisNo'>
                  Chassis No.<sup>*</sup>
                </label>
                <input
                  tabIndex='2'
                  required
                  maxLength='19'
                  disabled={isLoading}
                  value={payLoad.chassisNo}
                  onChange={onChangeHandler}
                  className='form__input w-100'
                  type='text'
                  id='chassisNo'
                  name='chassisNo'
                />
              </div>

              <div className='form__control'>
                <label className='form__label d-block w-100 text-left' htmlFor='mobileNo'>
                  Mobile No.<sup>*</sup>
                </label>
                <input
                  tabIndex='3'
                  required
                  disabled={isLoading}
                  value={payLoad.mobileNo}
                  onChange={onChangeHandler}
                  className='form__input w-100'
                  type='text'
                  inputMode='tel'
                  maxLength='10'
                  minLength='10'
                  id='mobileNo'
                  name='mobileNo'
                />
              </div>

              <div className='form__control'>
                <label className='form__label d-block w-100 text-left' htmlFor='vehiclePermitType'>
                  Vehicle Permit Type<sup>*</sup>
                </label>
                <select
                  tabIndex='4'
                  required
                  disabled={isLoading}
                  value={payLoad.vehiclePermitType}
                  onChange={onChangeHandler}
                  name='vehiclePermitType'
                  id='vehiclePermitType'
                >
                  <option value=''>--Select Vehicle Permit Type--</option>
                  {(stateFields.vehiclePermitType || []).map((t) => (
                    <option key={t.name} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className='form__control'>
                <label className='form__label d-block w-100 text-left' htmlFor='grossVehicleWeight'>
                  Gross Vehicle Weight(In Kg.)<sup>*</sup>
                </label>
                <input
                  tabIndex='5'
                  required
                  min='0'
                  disabled={isLoading}
                  value={payLoad.grossVehicleWeight}
                  onChange={onChangeHandler}
                  className='form__input w-100'
                  type='number'
                  id='grossVehicleWeight'
                  name='grossVehicleWeight'
                />
              </div>

              <div className='form__control'>
                <label className='form__label d-block w-100 text-left' htmlFor='aitpPermitValidity'>
                  AITP Permit Validity<sup>*</sup>
                </label>
                <input
                  tabIndex='6'
                  required
                  disabled={isLoading}
                  value={payLoad.aitpPermitValidity}
                  onChange={onChangeHandler}
                  className='form__input w-100'
                  type='date'
                  id='aitpPermitValidity'
                  name='aitpPermitValidity'
                />
              </div>

              <div className='form__control'>
                <label className='form__label d-block w-100 text-left' htmlFor='taxMode'>
                  Tax Mode<sup>*</sup>
                </label>
                <select
                  tabIndex='7'
                  required
                  disabled={isLoading}
                  value={payLoad.taxMode}
                  onChange={onChangeHandler}
                  name='taxMode'
                  id='taxMode'
                >
                  <option value=''>--Select Tax Mode--</option>
                  {fields.taxMode.map((t) => (
                    <option key={t.name} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* RIGHT */}
            <div className='col-6'>
              <div className='form__control text-left'>
                <label className='form__label d-block w-100 text-left'>&nbsp;</label>
                {isLoading && <Loader className='loader__get-details' />}
                {!isLoading && (
                  <button
                    type='button'
                    disabled={isLoading}
                    onClick={getDetailsHandler}
                    className='box__button get-details'
                  >
                    <span className='glyphicon glyphicon-arrow-down mr-3'></span>
                    Get Details
                  </button>
                )}
              </div>

              <div className='form__control'>
                <label className='form__label d-block w-100 text-left' htmlFor='ownerName'>
                  Owner Name<sup>*</sup>
                </label>
                <input
                  tabIndex='8'
                  required
                  disabled={isLoading}
                  value={payLoad.ownerName}
                  onChange={onChangeHandler}
                  className='form__input w-100'
                  type='text'
                  id='ownerName'
                  name='ownerName'
                />
              </div>

              <div className='form__control'>
                <label className='form__label d-block w-100 text-left' htmlFor='fromState'>
                  From State<sup>*</sup>
                </label>
                <select
                  tabIndex='9'
                  required
                  disabled={isLoading}
                  value={payLoad.fromState}
                  onChange={onChangeHandler}
                  name='fromState'
                  id='fromState'
                >
                  <option value=''>--Select State--</option>
                  {fields.fromState.map((t) => (
                    <option key={t.name} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className='form__control'>
                <label className='form__label d-block w-100 text-left' htmlFor='vehicleClass'>
                  Vehicle Class<sup>*</sup>
                </label>
                <select
                  tabIndex='10'
                  required
                  disabled={isLoading}
                  value={payLoad.vehicleClass}
                  onChange={onChangeHandler}
                  name='vehicleClass'
                  id='vehicleClass'
                >
                  <option value=''>--Select Vehicle Class--</option>
                  {(stateFields.vehicleClass || []).map((t) => (
                    <option key={t.name} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className='row'>
                <div className='col-sm-6'>
                  <div className='form__control'>
                    <label className='form__label d-block w-100 text-left' htmlFor='borderBarrier'>
                      District<sup>*</sup>
                    </label>
                    <select
                      tabIndex='11'
                      required
                      disabled={isLoading}
                      value={payLoad.borderBarrier}
                      onChange={onChangeHandler}
                      name='borderBarrier'
                      id='borderBarrier'
                    >
                      <option value=''>--Select District--</option>
                      {districtOptions.map((d) => (
                        <option key={d.name} value={d.name}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className='col-sm-6'>
                  <div className='form__control'>
                    <label className='form__label d-block w-100 text-left' htmlFor='checkpostName'>
                      Barrier Name<sup>*</sup>
                    </label>
                    <select
                      tabIndex='12'
                      required
                      disabled={isLoading}
                      value={payLoad.checkpostName}
                      onChange={onChangeHandler}
                      name='checkpostName'
                      id='checkpostName'
                    >
                      <option value=''>--Select Barrier Name--</option>
                      {filteredBarriers.map((b) => (
                        <option key={b.name} value={b.name}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className='form__control'>
                <label className='form__label d-block w-100 text-left' htmlFor='aitpPermitAuthValidity'>
                  AITP Permit Auth Validity<sup>*</sup>
                </label>
                <input
                  tabIndex='13'
                  required
                  disabled={isLoading}
                  value={payLoad.aitpPermitAuthValidity}
                  onChange={onChangeHandler}
                  className='form__input w-100'
                  type='date'
                  id='aitpPermitAuthValidity'
                  name='aitpPermitAuthValidity'
                />
              </div>

              <div className='row'>
                <div className='col-sm-6'>
                  <div className='form__control'>
                    <label className='form__label d-block w-100 text-left' htmlFor='taxFromDate'>
                      Tax From Date<sup>*</sup>
                    </label>
                    <input
                      tabIndex='14'
                      required
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
                    <label className='form__label d-block w-100 text-left' htmlFor='taxUptoDate'>
                      Tax Upto Date<sup>*</sup>
                    </label>
                    <input
                      tabIndex='15'
                      required
                      disabled={isLoading}
                      className='form__input w-100'
                      type='datetime-local'
                      id='taxUptoDate'
                      name='taxUptoDate'
                      onChange={onChangeHandler}
                      value={payLoad.taxUptoDate}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ✅ MV Tax table like screenshot */}
          <div className='row mt-3'>
            <div className='col-12'>
              <table className='hr-table'>
                <thead>
                  <tr>
                    <th className='hr-table-1'>Sl. No.</th>
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
                      <span className='hr-table-text'>{payLoad.taxFromDate || '-'}</span>
                    </td>
                    <td className='hr-table-body'>
                      <span className='hr-table-text'>{payLoad.taxUptoDate || '-'}</span>
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
                </tbody>
              </table>
            </div>
          </div>

          <br />

          <div className='row'>
            <div className='col-sm-6'>
              <div className='form__control'>
                <label className='form__label d-block w-100 text-left' htmlFor='totalAmount'>
                  Total Amount<sup>*</sup>
                </label>
                <input
                  tabIndex='16'
                  required
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
              <label className='form__label d-block w-100 text-left'>&nbsp;</label>
              <ActionButtons isDisabled={isLoading} onReset={onResetHandler} />
            </div>
          </div>
        </form>

        <br />
      </div>

      <br /><br /><br /><br /><br />
    </>
  );
};

export default Tripura;
