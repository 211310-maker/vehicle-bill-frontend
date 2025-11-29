import React, { useRef, useState } from 'react';
import { useHistory } from 'react-router';
import ActionButtons from '../components/ActionButtons';
import Header from '../components/Header';
import Loader from '../components/Loader';
import { fields, LOCAL_STORAGE_KEY } from '../constants';
import { getDetailsApi } from '../utils/api';
const Up = () => {
  const isLoggedIn = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
  const state = 'up';
  const history = useHistory();
  const [payLoad, setPayLoad] = useState({
    vehicleNo: '',
    chassisNo: '',
    mobileNo: '',
    vehiclePermitType: '',
    seatingCapacityExcludingDriver: '',
    sleeperCap: '',
    borderBarrier: '',
    permitType: '',
    permitUpto: '',
    totalAmount: '',
    ownerName: '',
    fromState: '',
    vehicleClass: '',
    serviceType: '',
    taxMode: '',
    taxFromDate: '',
    taxUptoDate: '',
    grossVehicleWeight: '',
    unladenWeight: '',
    permitNumber: '',
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
        if (data.detail[key]) {
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
    setIsLoading(true);
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

  const onResetHandler = () => {
    let x = { ...payLoad };
    let p = {};
    Object.keys(x).forEach((e) => {
      p[e] = '';
    });
    setPayLoad({ ...p });
  };

  const onChangeHandler = (e) => {
    setPayLoad((old) => ({ ...old, [e.target.name]: e.target.value }));
  };

  if (!isLoggedIn.accessState.includes(fields.stateName.up)) {
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
          <b>BORDER TAX PAYMENT FOR ENTRY INTO</b> <span>UTTAR PRADESH</span>
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
                  Vehicle No.<sup>*</sup>
                </label>
                <input
                  required
                  maxLength='10'
                  tabIndex='1'
                  inputMode='text'
                  disabled={isLoading}
                  autoFocus
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
                  tabIndex='3'
                  inputMode='tel'
                  disabled={isLoading}
                  onChange={onChangeHandler}
                  placeholder='SMS about payment will be sent to this number '
                  className='form__input w-100'
                  type='text'
                  id='mobileNo'
                  value={payLoad.mobileNo}
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
                  <option value=''>--Select Vehicle Type--</option>
                  {fields.up.vehiclePermitType.map((type) => {
                    return (
                      <option value={type.name} key={type.name}>
                        {type.name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className='row'>
                {/* <!-- seating capacity excluding driver--> */}
                {payLoad.vehiclePermitType !== 'GOODS VEHICLE' ? (
                  <>
                    <div className='col-sm-6'>
                      <div className='form__control'>
                        <label
                          className='form__label d-block w-100 text-left'
                          htmlFor='seatingCapacityExcludingDriver'
                        >
                          Seating Capacity(Ex. Driver)<sup>*</sup>
                        </label>
                        <input
                          min='0'
                          tabIndex='5'
                          required
                          inputMode='numeric'
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
                    {/* -- sleeper cap -- */}
                    <div className='col-sm-6'>
                      <div className='form__control'>
                        <label
                          className='form__label d-block w-100 text-left'
                          htmlFor='sleeperCap'
                        >
                          Sleeper Cap<sup>*</sup>
                        </label>
                        <input
                          required
                          tabIndex='6'
                          min='0'
                          inputMode='numeric'
                          disabled={isLoading}
                          onChange={onChangeHandler}
                          className='form__input w-100'
                          type='number'
                          value={payLoad.sleeperCap}
                          id='sleeperCap'
                          name='sleeperCap'
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className='col-sm-6'>
                      <div className='form__control'>
                        <label
                          className='form__label d-block w-100 text-left'
                          htmlFor='grossVehicleWeight'
                        >
                          Gross Vehicle Wt.(in kg)<sup>*</sup>
                        </label>
                        <input
                          min='0'
                          tabIndex='5'
                          required
                          inputMode='numeric'
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
                    {/* <!-- unladen Weight --> */}
                    <div className='col-sm-6'>
                      <div className='form__control'>
                        <label
                          className='form__label d-block w-100 text-left'
                          htmlFor='unladenWeight'
                        >
                          Unladen Wt.(in kg)<sup>*</sup>
                        </label>
                        <input
                          min='0'
                          tabIndex='5'
                          required
                          inputMode='numeric'
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
                  </>
                )}
              </div>
              {/* -- border barrier -- */}
              <div className='form__control'>
                <label
                  className='form__label d-block w-100 text-left'
                  htmlFor='borderBarrier'
                >
                  Border/Barrier District through Entering<sup>*</sup>
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
                  {fields.up.borderBarrier.map((type) => {
                    return (
                      <option key={type.name} value={type.name}>
                        {type.name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className='row'>
                {/* Permit type */}
                <div className='col-sm-6'>
                  <div className='form__control'>
                    <label
                      className='form__label d-block w-100 text-left'
                      htmlFor='permit-type'
                    >
                      Permit Type<sup>*</sup>
                    </label>
                    <select
                      tabIndex='8'
                      disabled={isLoading}
                      required
                      onChange={onChangeHandler}
                      value={payLoad.permitType}
                      name='permitType'
                      id='permitType'
                    >
                      <option value=''>--Select Permit Type--</option>
                      {fields.up.permitType.map((type) => {
                        return (
                          <option key={type.name} value={type.name}>
                            {type.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
                {/* permit upto */}
                <div className='col-sm-6'>
                  <div className='form__control'>
                    <label
                      className='form__label d-block w-100 text-left'
                      htmlFor='permitUpto'
                    >
                      Permit Upto<sup>*</sup>
                    </label>
                    <input
                      tabIndex='9'
                      disabled={isLoading}
                      required
                      className='form__input w-100'
                      type='date'
                      value={payLoad.permitUpto}
                      onChange={onChangeHandler}
                      id='permitUpto'
                      name='permitUpto'
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
                  tabIndex='10'
                  disabled={isLoading}
                  required
                  inputMode='text'
                  className='form__input w-100'
                  type='text'
                  id='ownerName'
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
                  disabled={isLoading}
                  required
                  tabIndex='11'
                  value={payLoad.fromState}
                  onChange={onChangeHandler}
                  name='fromState'
                  id='fromState'
                >
                  <option value=''>--------Select State--------</option>
                  {fields.fromState.map((type) => {
                    return (
                      <option value={type.name} key={type.name}>
                        {type.name}
                      </option>
                    );
                  })}
                </select>
              </div>
              {/* -- vehicle class -- */}
              <div className='form__control'>
                <label
                  className='form__label d-block w-100 text-left'
                  htmlFor='vehicleClass'
                >
                  Vehicle Class<sup>*</sup>
                </label>
                <select
                  required
                  tabIndex='12'
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
                      <option value='MOTOR CAB'>MOTOR CAB</option>
                      <option value='MAXI CAB'>MAXI CAB</option>
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

              <div className='row'>
                {/* <!-- Service Type --> */}
                <div className='col-sm-6'>
                  <div className='form__control'>
                    <label
                      className='form__label d-block w-100 text-left'
                      htmlFor='serviceType'
                    >
                      Service type<sup>*</sup>
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
                      {fields.up.serviceType.map((type) => {
                        return (
                          <option key={type.name} value={type.name}>
                            {type.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
                {/* <!-- Tax mode --> */}
                <div className='col-sm-6'>
                  <div className='form__control'>
                    <label
                      className='form__label d-block w-100 text-left'
                      htmlFor='taxMode'
                    >
                      Tax Mode<sup>*</sup>
                    </label>
                    <select
                      tabIndex='14'
                      disabled={isLoading}
                      required
                      onChange={onChangeHandler}
                      value={payLoad.taxMode}
                      name='taxMode'
                      id='taxMode'
                    >
                      <option value=''>--Select Tax Mode--</option>
                      {fields.up.taxMode.map((type) => {
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
                {/* <!-- Tax from --> */}
                <div className='col-sm-6'>
                  <div className='form__control'>
                    <label
                      className='form__label d-block w-100 text-left'
                      htmlFor='taxFromDate'
                    >
                      Tax from<sup>*</sup>
                    </label>
                    <input
                      tabIndex='15'
                      disabled={isLoading}
                      required
                      className='form__input w-100'
                      type='datetime-local'
                      id='taxFromDate'
                      name='taxFromDate'
                      onChange={onChangeHandler}
                      value={payLoad.taxFromDate}
                    />
                  </div>
                </div>
                {/* <!-- Tax upto --> */}
                <div className='col-sm-6'>
                  <div className='form__control'>
                    <label
                      className='form__label d-block w-100 text-left'
                      htmlFor='taxUptoDate'
                    >
                      Tax Upto<sup>*</sup>
                    </label>
                    <input
                      tabIndex='16'
                      required
                      disabled={isLoading}
                      className='form__input w-100'
                      type='datetime-local'
                      id='taxUptoDate'
                      name='taxUptoDate'
                      value={payLoad.taxUptoDate}
                      onChange={onChangeHandler}
                    />
                  </div>
                </div>
              </div>
              <div className='form__control'>
                <label
                  className='form__label d-block w-100 text-left'
                  htmlFor='permitNumber'
                >
                  Permit Number<sup>*</sup>
                </label>
                <input
                  disabled={isLoading}
                  required
                  className='form__input w-100'
                  type='text'
                  tabIndex='17'
                  value={payLoad.permitNumber}
                  onChange={onChangeHandler}
                  id='permitNumber'
                  name='permitNumber'
                  inputMode='text'
                />
              </div>
            </div>
          </div>
          {/* =============== table ======================== */}
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
                    <td className='hr-table-body' colSpan='5'>
                      No records found
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <br />
          {/* =================== total ====================== */}
          <div className='row'>
            <div className='col-sm-6'>
              {/* <!-- Total amount --> */}
              <div className='form__control'>
                <label
                  className='form__label d-block w-100 text-left'
                  htmlFor='totalAmount'
                >
                  Total amount<sup>*</sup>
                </label>
                <input
                  required
                  tabIndex='18'
                  min='0'
                  disabled={isLoading}
                  inputMode='numeric'
                  onChange={onChangeHandler}
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
                tabIndex='19'
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

export default Up;
