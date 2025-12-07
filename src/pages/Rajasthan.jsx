import React, { useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import ActionButtons from '../components/ActionButtons';
import Header from '../components/Header';
import Loader from '../components/Loader';
import { fields, LOCAL_STORAGE_KEY } from '../constants';
import { getDetailsApi } from '../utils/api';
import { randomNumber } from '../utils/helper';

const Rajasthan = () => {
  const isLoggedIn = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || 'null');
  const state = 'rajasthan';
  const history = useHistory();

  // all input fields
  const [payLoad, setPayLoad] = useState({
    vehicleNo: '',
    chassisNo: '',
    mobileNo: '',
    vehiclePermitType: '',
    seatingCapacityExcludingDriver: '',
    sleeperCapacityExcludingDriver: '',
    borderBarrier: '',
    ownerName: '',
    fromState: '',
    vehicleClass: '',
    taxMode: '',
    taxFromDate: '',
    taxUptoDate: '',
    permitType: '',
    serviceType: '',
    checkpostName: '',
    mvTax: '',
    surChargeFee: '',
    grossVehicleWeight: '',
    unladenWeight: '',
    counterSignatureFree: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const form = useRef(null);

  const getDetailsHandler = async () => {
    if (!payLoad.vehicleNo) {
      alert('Please enter vehicle no.');
      return;
    }
    setIsLoading(true);
    const { data } = await getDetailsApi({
      vehicleNo: payLoad.vehicleNo,
    });
    setIsLoading(false);
    if (data && data.success) {
      const preLoadedData = {};
      ['chassisNo', 'mobileNo', 'ownerName', 'borderBarrier'].forEach((key) => {
        if (data.detail && data.detail[key]) {
          preLoadedData[key] = data.detail[key];
        }
      });
      setPayLoad((e) => ({
        ...e,
        ...preLoadedData,
      }));
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!payLoad.sleeperCapacityExcludingDriver) {
      payLoad.sleeperCapacityExcludingDriver = 0;
    }

    payLoad.bankRefNo = randomNumber(9);
    if (payLoad.counterSignatureFree) {
      payLoad['totalAmount'] =
        +payLoad.mvTax + +payLoad.surChargeFee + +payLoad.counterSignatureFree;
    } else {
      payLoad['totalAmount'] = +payLoad.mvTax + +payLoad.surChargeFee;
    }
    if (!payLoad.unladenWeight) {
      payLoad.unladenWeight = 0;
    }
    history.push('/select-payment', {
      formData: {
        ...payLoad,
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

  if (!isLoggedIn || !isLoggedIn.accessState || !isLoggedIn.accessState.includes(fields.stateName.rajasthan)) {
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
          <b>BORDER TAX PAYMENT FOR ENTRY INTO</b> <span>RAJASTHAN</span>
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
              {/* <!-- vehicle number --> */}
              <div className='form__control'>
                <label
                  className='form__label d-block w-100 text-left'
                  htmlFor='vehicleNo'
                >
                  Vehicle / Serial No.<sup>*</sup>
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
              {/* <!-- chassis number --> */}
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
              {/* <!-- mobile number --> */}
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

              {/* <!-- vehicle type --> */}
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
                  onChange={(e) => {
                    if (e.target.value != 'GOODS VEHICLE') {
                      setPayLoad((old) => ({
                        ...old,
                        grossVehicleWeight: '',
                        unladenWeight: '',
                        counterSignatureFree: '',
                      }));
                    }
                    setPayLoad((old) => ({
                      ...old,
                      [e.target.name]: e.target.value,
                      counterSignatureFree: '',
                    }));
                  }}
                  required
                  name='vehiclePermitType'
                  id='vehiclePermitType'
                >
                  <option value=''>--Select Vehicle Type--</option>
                  {fields.rajasthan.vehiclePermitType.map((type) => {
                    return (
                      <option value={type.name} key={type.name}>
                        {type.name}
                      </option>
                    );
                  })}
                </select>
              </div>

              {payLoad.vehiclePermitType === 'GOODS VEHICLE' && (
                <div className='row'>
                  <div className='col-sm-6'>
                    {/* <!-- Gorss Vehicle --> */}
                    <div className='form__control'>
                      <label
                        className='form__label d-block w-100 text-left'
                        htmlFor='grossVehicleWeight'
                      >
                        Gross Vehicle Wt.(in kg)<sup>*</sup>
                      </label>
                      <input
                        required
                        inputMode='numeric'
                        disabled={isLoading}
                        onChange={(e) => {
                          if (+e.target.value != 3000) {
                            setPayLoad((old) => ({
                              ...old,
                              counterSignatureFree: '',
                            }));
                          }
                          setPayLoad((old) => ({
                            ...old,
                            [e.target.name]: e.target.value,
                          }));
                        }}
                        value={payLoad.grossVehicleWeight}
                        className='form__input w-100'
                        type='number'
                        id='grossVehicleWeight'
                        name='grossVehicleWeight'
                      />
                    </div>
                  </div>
                  <div className='col-sm-6'>
                    {/* <!-- Unladen Wt --> */}
                    <div className='form__control'>
                      <label
                        className='form__label d-block w-100 text-left'
                        htmlFor='unladenWeight'
                      >
                        Unladen Wt.(in kg)<sup>*</sup>
                      </label>
                      <input
                        required
                        inputMode='numeric'
                        disabled={isLoading}
                        onChange={onChangeHandler}
                        value={payLoad.unladenWeight}
                        className='form__input w-100'
                        type='number'
                        id='unladenWeight'
                        name='unladenWeight'
                      />
                    </div>
                  </div>
                </div>
              )}
              {payLoad.vehiclePermitType !== 'GOODS VEHICLE' && (
                <div className='row'>
                  <div className='col-sm-6'>
                    {/* <!-- seating capacity --> */}
                    <div className='form__control'>
                      <label
                        className='form__label d-block w-100 text-left'
                        htmlFor='seatingCapacityExcludingDriver'
                      >
                        Seating Cap(Ex. Driver)<sup>*</sup>
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
                    {/* <!-- sleeper capacity --> */}
                    <div className='form__control'>
                      <label
                        className='form__label d-block w-100 text-left'
                        htmlFor='sleeperCapacityExcludingDriver'
                      >
                        Sleeper Cap
                      </label>
                      <input
                        tabIndex='6'
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
              )}
              {/* <!-- barrier --> */}
              <div className='form__control'>
                <label
                  className='form__label d-block w-100 text-left'
                  htmlFor='borderBarrier'
                >
                  Barrier Name<sup>*</sup>
                </label>
                <select
                  tabIndex='7'
                  required
                  disabled={isLoading}
                  value={payLoad.borderBarrier}
                  onChange={onChangeHandler}
                  name='borderBarrier'
                  id='borderBarrier'
                >
                  <option value=''>--Select Barrier--</option>
                  {fields.rajasthan.borderBarrier.map((dist) => {
                    return (
                      <option key={dist.name} value={dist.name}>
                        {dist.name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className='row'>
                <div className='col-sm-6'>
                  {/* <!-- Tax From Date --> */}
                  <div className='form__control'>
                    <label
                      className='form__label d-block w-100 text-left'
                      htmlFor='taxFromDate'
                    >
                      Tax From<sup>*</sup>
                    </label>
                    <input
                      required
                      tabIndex='8'
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
                  {/* <!-- Tax upto Date --> */}
                  <div className='form__control'>
                    <label
                      className='form__label d-block w-100 text-left'
                      htmlFor='taxUptoDate'
                    >
                      Tax Upto<sup>*</sup>
                    </label>
                    <input
                      required
                      tabIndex='9'
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
            {/* =========================== right side fields ============================ */}
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
              {/* <!-- owner name --> */}
              <div className='form__control'>
                <label
                  className='form__label d-block w-100 text-left'
                  htmlFor='ownerName'
                >
                  Owner Name<sup>*</sup>
                </label>
                <input
                  required
                  tabIndex='10'
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
              {/* <!-- from state --> */}
              <div className='form__control'>
                <label
                  className='form__label d-block w-100 text-left'
                  htmlFor='fromState'
                >
                  From State<sup>*</sup>
                </label>
                <select
                  tabIndex='11'
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
              {/* <!-- vehicle class --> */}
              <div className='form__control'>
                <label
                  className='form__label d-block w-100 text-left'
                  htmlFor='vehicleClass'
                >
                  Vehicle Class<sup>*</sup>
                </label>
                <select
                  tabIndex='12'
                  disabled={isLoading}
                  required
                  value={payLoad.vehicleClass}
                  onChange={onChangeHandler}
                  name='vehicleClass'
                  id='vehicleClass'
                >
                  <option value=''>--Select Vehicle Class--</option>
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
                  {payLoad.vehiclePermitType ===
                    'CONTRACT CARRIAGE/PASSANGER VEHICLES' && (
                    <>
                      <option value='THREE WHEELER(PASSANGER)'>
                        THREE WHEELER(PASSANGER)
                      </option>
                      <option value='MOTOR CAB'>MOTOR CAB</option>
                      <option value='MAXI CAB'>MAXI CAB</option>
                      <option value='BUS'>BUS</option>
                    </>
                  )}
                  {payLoad.vehiclePermitType ===
                    'CONSTRUCTION EQUIPMENT VEHICLE' && (
                    <>
                      <option value='CONSTRUCTION EQUIPMENT VEHICLE'>
                        CONSTRUCTION EQUIPMENT VEHICLE
                      </option>
                    </>
                  )}
                  {payLoad.vehiclePermitType ===
                    'TEMPORARY REGISTERED VEHICLES' && (
                    <>
                      <option value='THREE WHEELER(PASSANGER)'>
                        THREE WHEELER(PASSANGER)
                      </option>
                      <option value='MOTOR CAB'>MOTOR CAB</option>
                      <option value='MAXI CAB'>MAXI CAB</option>

                      <option value='OMNI BUS'>OMNI BUS</option>
                      <option value='TRACTOR'>TRACTOR</option>
                      <option value='CHASSIS OF VEHICLES'>
                        CHASSIS OF VEHICLES
                      </option>
                      <option value='OTHERS'>OTHERS</option>
                    </>
                  )}
                </select>
              </div>
              <div className='row'>
                <div className='col-sm-6'>
                  {/* <!-- Service type --> */}
                  <div className='form__control'>
                    <label
                      className='form__label d-block w-100 text-left'
                      htmlFor='fromState'
                    >
                      Service Type<sup>*</sup>
                    </label>
                    <select
                      tabIndex='13'
                      disabled={isLoading}
                      required
                      value={payLoad.serviceType}
                      onChange={onChangeHandler}
                      name='serviceType'
                      id='serviceType'
                    >
                      <option value=''>--Select Service Type--</option>

                      {fields.rajasthan.serviceType.map((type) => {
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
                  {/* <!-- permit type --> */}
                  <div className='form__control'>
                    <label
                      className='form__label d-block w-100 text-left'
                      htmlFor='permitType'
                    >
                      Permit Type<sup>*</sup>
                    </label>
                    <select
                      required
                      tabIndex='14'
                      disabled={isLoading}
                      value={payLoad.permitType}
                      onChange={onChangeHandler}
                      name='permitType'
                      id='permitType'
                    >
                      <option value=''>--Select Permit Type--</option>
                      {fields.rajasthan.permitType.map((type) => {
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
              {/* <!-- check post name --> */}
              <div className='form__control'>
                <label
                  className='form__label d-block w-100 text-left'
                  htmlFor='checkpostName'
                >
                  Checkpost Name<sup>*</sup>
                </label>
                <select
                  tabIndex='15'
                  disabled={isLoading}
                  required
                  value={payLoad.checkpostName}
                  onChange={onChangeHandler}
                  name='checkpostName'
                  id='checkpostName'
                >
                  <option value='-1'>--Select CheckPost Name</option>
                  {fields.rajasthan.checkPostName.map((checkPost) => {
                    return (
                      <option key={checkPost.name} value={checkPost.name}>
                        {checkPost.name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className='form__control'>
                <label
                  className='form__label d-block w-100 text-left'
                  htmlFor='taxMode'
                >
                  Tax Mode<sup>*</sup>
                </label>
                <select
                  tabIndex='16'
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
            </div>
          </div>
          {/* =============== table ======================== */}
          <div className='row mt-3'>
            <div className='col-12'>
              <table className='hr-table pb-table'>
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
                    <td className=''>1</td>
                    <td className='pb-table-text'>
                      MV Tax<sup>*</sup>
                    </td>
                    <td className=''></td>
                    <td className=''></td>
                    <td className='input-box'>
                      <center>
                        <input
                          tabIndex='17'
                          required
                          disabled={isLoading}
                          value={payLoad.mvTax}
                          onChange={onChangeHandler}
                          name='mvTax'
                          type='number'
                          min='0'
                          inputMode='numeric'
                        />
                      </center>
                    </td>
                  </tr>
                  <tr>
                    <td className=''>2</td>
                    <td className='pb-table-text'>
                      Surcharge Fee<sup>*</sup>
                    </td>
                    <td className=''></td>
                    <td className=''></td>
                    <td className='input-box'>
                      <center>
                        <input
                          tabIndex='18'
                          required
                          disabled={isLoading}
                          value={payLoad.surChargeFee}
                          onChange={onChangeHandler}
                          name='surChargeFee'
                          min='0'
                          type='number'
                          inputMode='numeric'
                        />
                      </center>
                    </td>
                  </tr>
                  {parseInt(payLoad.grossVehicleWeight) > 3000 && (
                    <tr>
                      <td className=''>3</td>
                      <td className='pb-table-text'>
                        Counter Signature Fee<sup>*</sup>
                      </td>
                      <td className=''></td>
                      <td className=''></td>
                      <td className='input-box'>
                        <center>
                          <input
                            tabIndex='18'
                            required
                            disabled={isLoading}
                            value={payLoad.counterSignatureFree}
                            onChange={onChangeHandler}
                            name='counterSignatureFree'
                            min='0'
                            type='number'
                            inputMode='numeric'
                          />
                        </center>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <br />
          <div className='row'>
            <div className='col-sm-6'>
              {/* <!-- Total amount --> */}
              <div className='form__control'>
                <label
                  className='form__label d-block w-100 text-left'
                  htmlFor='totalAmount'
                >
                  Total Amount<sup>*</sup>
                </label>
                <input
                  min='0'
                  disabled
                  value={
                    payLoad.counterSignatureFree
                      ? +payLoad.mvTax +
                        +payLoad.surChargeFee +
                        +payLoad.counterSignatureFree
                      : +payLoad.mvTax + +payLoad.surChargeFee
                  }
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
              <ActionButtons isDisabled={isLoading} onReset={onResetHandler} />
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

export default Rajasthan;
