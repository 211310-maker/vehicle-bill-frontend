import React, { useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import ActionButtons from '../components/ActionButtons';
import Header from '../components/Header';
import Loader from '../components/Loader';
import { fields, LOCAL_STORAGE_KEY } from '../constants';
import { getDetailsApi } from '../utils/api';

const Punjab = () => {
  const isLoggedIn = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || 'null');

  // all inputs fields
  const history = useHistory();

  const state = 'punjab';
  const form = useRef(null);
  const [payLoad, setPayLoad] = useState({
    vehicleNo: '',
    chassisNo: '',
    mobileNo: '',
    vehiclePermitType: '',
    seatingCapacityExcludingDriver: '',
    borderBarrier: '',
    ownerName: '',
    fromState: '',
    vehicleClass: '',
    serviceType: '',
    taxMode: '',
    taxFromDate: '',
    taxUptoDate: '',
    checkpostName: '',
    taxAmount: '',
    userCharge: '',
    infraCess: '',
    grossVehicleWeight: '',
    unladenWeight: '',
  });

  const [isLoading, setIsLoading] = useState(false);

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
      [
        'chassisNo',
        'mobileNo',
        'ownerName',
        'borderBarrier',
        'checkpostName',
      ].forEach((key) => {
        if (data.detail && data.detail[key]) {
          preLoadedData[key] = data.detail[key];
        }
      });
      console.log(data);
      setPayLoad((e) => ({
        ...e,
        ...preLoadedData,
      }));
    }
  };
  const onChangeHandler = (e) => {
    setPayLoad((old) => ({ ...old, [e.target.name]: e.target.value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!payLoad.unladenWeight) {
      payLoad.unladenWeight = 0;
    }
    history.push('/select-payment', {
      formData: {
        ...payLoad,
        state,
        totalAmount:
          +payLoad.taxAmount + +payLoad.userCharge + +payLoad.infraCess,
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

  if (!isLoggedIn || !isLoggedIn.accessState || !isLoggedIn.accessState.includes(fields.stateName.punjab)) {
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
          <b>BORDER TAX PAYMENT FOR ENTRY INTO</b> <span>PUNJAB</span>
        </p>
      </div>
      <div className='box box--main mt-4'>
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
                  inputMode='text'
                  disabled={isLoading}
                  autoFocus
                  maxLength='10'
                  tabIndex='1'
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
                  tabIndex='2'
                  required
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
                  required
                  disabled={isLoading}
                  placeholder='SMS about payment will be sent to this number '
                  className='form__input w-100'
                  type='text'
                  id='mobileNo'
                  inputMode='tel'
                  value={payLoad.mobileNo}
                  onChange={onChangeHandler}
                  maxLength='10'
                  minLength='10'
                  name='mobileNo'
                />
              </div>
              {/* <!-- vehicle permit type --> */}
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
                  inputMode='text'
                  value={payLoad.vehiclePermitType}
                  onChange={onChangeHandler}
                  name='vehiclePermitType'
                  id='vehiclePermitType'
                >
                  <option value=''>--Select Vehicle Type--</option>
                  {fields.punjab.vehiclePermitType.map((type) => {
                    return (
                      <option key={type.name} value={type.name}>
                        {type.name}
                      </option>
                    );
                  })}
                </select>
              </div>
              {payLoad.vehiclePermitType !== 'GOODS VEHICLE' ? (
                <>
                  {/* <!-- seating capacity --> */}
                  <div className='form__control'>
                    <label
                      className='form__label d-block w-100 text-left'
                      htmlFor='seatingCapacityExcludingDriver'
                    >
                      Seating Cap(Exc. Driver)<sup>*</sup>
                    </label>
                    <input
                      tabIndex='5'
                      required
                      inputMode='numeric'
                      disabled={isLoading}
                      onChange={onChangeHandler}
                      className='form__input w-100'
                      type='number'
                      min='0'
                      value={payLoad.seatingCapacityExcludingDriver}
                      id='seatingCapacityExcludingDriver'
                      name='seatingCapacityExcludingDriver'
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* <!-- gross vehicle wieght --> */}
                  <div className='form__control'>
                    <label
                      className='form__label d-block w-100 text-left'
                      htmlFor='grossVehicleWeight'
                    >
                      Gross Vehicle Wt.(in kg)<sup>*</sup>
                    </label>
                    <input
                      tabIndex='5'
                      required
                      inputMode='numeric'
                      disabled={isLoading}
                      onChange={onChangeHandler}
                      className='form__input w-100'
                      type='number'
                      min='0'
                      value={payLoad.grossVehicleWeight}
                      id='grossVehicleWeight'
                      name='grossVehicleWeight'
                    />
                  </div>
                  {/* <!-- unladen Weight --> */}
                  <div className='form__control'>
                    <label
                      className='form__label d-block w-100 text-left'
                      htmlFor='unladenWeight'
                    >
                      Unladen Wt.(in kg)<sup>*</sup>
                    </label>
                    <input
                      tabIndex='5'
                      required
                      inputMode='numeric'
                      disabled={isLoading}
                      onChange={onChangeHandler}
                      className='form__input w-100'
                      type='number'
                      min='0'
                      value={payLoad.unladenWeight}
                      id='unladenWeight'
                      name='unladenWeight'
                    />
                  </div>
                </>
              )}

              <div className='row'>
                <div className='col-sm-6'>
                  <div className='form__control'>
                    <label
                      className='form__label d-block w-100 text-left'
                      htmlFor='borderBarrier'
                    >
                      Border/Barrier Name<sup>*</sup>
                    </label>
                    <select
                      required
                      tabIndex='6'
                      disabled={isLoading}
                      value={payLoad.borderBarrier}
                      onChange={onChangeHandler}
                      name='borderBarrier'
                      id='borderBarrier'
                    >
                      <option value=''>--Select District Name--</option>
                      {fields.punjab.borderBarrier.map((district) => {
                        return (
                          <option key={district.name} value={district.name}>
                            {district.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
                {/* checkpost name */}
                <div className='col-sm-6'>
                  <div className='form__control'>
                    <label
                      className='form__label d-block w-100 text-left'
                      htmlFor='checkpostName'
                    >
                      Checkpost Name<sup>*</sup>
                    </label>
                    <select
                      required
                      tabIndex='7'
                      disabled={isLoading}
                      value={payLoad.checkpostName}
                      onChange={onChangeHandler}
                      name='checkpostName'
                      id='checkpostName'
                    >
                      <option value=''>--Select Checkpost Name--</option>
                      {fields.punjab.checkPostName.map((checkpost) => {
                        return (
                          <option key={checkpost.name} value={checkpost.name}>
                            {checkpost.name}
                          </option>
                        );
                      })}
                    </select>
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
                  tabIndex='8'
                  className='form__input w-100'
                  type='text'
                  id='ownerName'
                  disabled={isLoading}
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
                  required
                  tabIndex='9'
                  disabled={isLoading}
                  value={payLoad.fromState}
                  onChange={onChangeHandler}
                  name='fromState'
                  id='fromState'
                >
                  <option value=''>-----Select State-----</option>
                  {fields.fromState.map((type) => {
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
                  htmlFor='vehicleClass'
                >
                  Vehicle Class<sup>*</sup>
                </label>
                <select
                  required
                  tabIndex='10'
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
                      <option value='OTHERS(VANITY VAN)'>
                        OTHERS(VANITY VAN)
                      </option>
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
                  {payLoad.vehiclePermitType ===
                    'TEMPORARY REGISTERED VEHICLE' && (
                    <option value='CHASSIS OF VEHICLES'>
                      CHASSIS OF VEHICLES
                    </option>
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
                      required
                      tabIndex='11'
                      disabled={isLoading}
                      name='serviceType'
                      id='serviceType'
                      value={payLoad.serviceType}
                      onChange={onChangeHandler}
                    >
                      <option value=''>--Select Service Type--</option>
                      {fields.punjab.serviceType.map((type) => {
                        return (
                          <option value={type.name} key={type.name}>
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
                      required
                      tabIndex='12'
                      disabled={isLoading}
                      value={payLoad.taxMode}
                      onChange={onChangeHandler}
                      name='taxMode'
                      id='taxMode'
                    >
                      <option value=''>--Select Tax Mode--</option>
                      {fields.taxMode.map((type) => {
                        return <option key={type.name}>{type.name}</option>;
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
                      disabled={isLoading}
                      required
                      tabIndex='13'
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
                      disabled={isLoading}
                      required
                      tabIndex='14'
                      value={payLoad.taxUptoDate}
                      onChange={onChangeHandler}
                      className='form__input w-100'
                      type='datetime-local'
                      id='taxUptoDate'
                      name='taxUptoDate'
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =================== tax table ====================== */}

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
                      Tax Amount<sup>*</sup>
                    </td>
                    <td className=''></td>
                    <td className=''></td>
                    <td className='input-box'>
                      <center>
                        <input
                          tabIndex='15'
                          required
                          disabled={isLoading}
                          value={payLoad.taxAmount}
                          onChange={onChangeHandler}
                          name='taxAmount'
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
                      User charge<sup>*</sup>
                    </td>
                    <td className=''></td>
                    <td className=''></td>
                    <td className='input-box'>
                      <center>
                        <input
                          tabIndex='16'
                          required
                          disabled={isLoading}
                          value={payLoad.userCharge}
                          onChange={onChangeHandler}
                          name='userCharge'
                          min='0'
                          type='number'
                          inputMode='numeric'
                        />
                      </center>
                    </td>
                  </tr>
                  <tr>
                    <td className=''>3</td>
                    <td className='pb-table-text'>
                      Infra cess<sup>*</sup>
                    </td>
                    <td className=''></td>
                    <td className=''></td>
                    <td className='input-box'>
                      <center>
                        <input
                          tabIndex='17'
                          required
                          disabled={isLoading}
                          value={payLoad.infraCess}
                          onChange={onChangeHandler}
                          name='infraCess'
                          type='number'
                          min='0'
                          inputMode='numeric'
                        />
                      </center>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <br />
          {/* =================== tax table ends ====================== */}

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
                  disabled
                  onChange={onChangeHandler}
                  value={
                    +payLoad.taxAmount +
                    +payLoad.userCharge +
                    +payLoad.infraCess
                  }
                  className='form__input w-100'
                  type='text'
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
                tabIndex='18'
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

export default Punjab;
