import React, { useRef, useState } from 'react';
import { useHistory } from 'react-router';
import ActionButtons from '../components/ActionButtons';
import Header from '../components/Header';
import Loader from '../components/Loader';
import { fields, LOCAL_STORAGE_KEY } from '../constants';
import { getDetailsApi } from '../utils/api';

const ArunachalPradesh = () => {
  const isLoggedIn = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));

  const state = 'arunachalPradesh';
  const history = useHistory();

  const [payLoad, setPayLoad] = useState({
    vehicleNo: '',
    chassisNo: '',
    mobileNo: '',
    vehiclePermitType: '',
    seatingCapacityExcludingDriver: '',
    sleeperCapacityExcludingDriver: '',
    borderBarrier: '',
    totalAmount: '',
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
    const cleared = {};
    Object.keys(payLoad).forEach((e) => {
      cleared[e] = '';
    });
    setPayLoad({ ...cleared });
  };

  if (!isLoggedIn.accessState.includes(fields.stateName.arunachalPradesh)) {
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
          <b>TAX PAYMENT FOR VEHICLES HAVING TOURIST PERMIT</b>{' '}
          <span>ARUNACHAL PRADESH</span>
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
                  required
                  onChange={onChangeHandler}
                  name='vehiclePermitType'
                >
                  <option value=''>--Select Vehicle Type--</option>
                  {fields[state].vehiclePermitType.map((e) => (
                    <option key={e.name} value={e.name}>
                      {e.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className='form__control'>
                <label
                  className='form__label d-block w-100 text-left'
                  htmlFor='seatingCapacityExcludingDriver'
                >
                  Seating Capacity (Excluding Driver)
                </label>
                <input
                  tabIndex='5'
                  value={payLoad.seatingCapacityExcludingDriver}
                  onChange={onChangeHandler}
                  className='form__input w-100'
                  type='number'
                  min='0'
                  id='seatingCapacityExcludingDriver'
                  name='seatingCapacityExcludingDriver'
                />
              </div>
              <div className='form__control'>
                <label
                  className='form__label d-block w-100 text-left'
                  htmlFor='sleeperCapacityExcludingDriver'
                >
                  Sleeper Capacity (Excluding Driver)
                </label>
                <input
                  tabIndex='6'
                  value={payLoad.sleeperCapacityExcludingDriver}
                  onChange={onChangeHandler}
                  className='form__input w-100'
                  type='number'
                  min='0'
                  id='sleeperCapacityExcludingDriver'
                  name='sleeperCapacityExcludingDriver'
                />
              </div>
              <div className='form__control'>
                <label
                  className='form__label d-block w-100 text-left'
                  htmlFor='borderBarrier'
                >
                  Border/Barrier Name<sup>*</sup>
                </label>
                <select
                  tabIndex='7'
                  value={payLoad.borderBarrier}
                  required
                  onChange={onChangeHandler}
                  name='borderBarrier'
                >
                  <option value=''>--Select Border/Barrier Name--</option>
                  {fields[state].borderBarrier.map((e) => (
                    <option key={e.name} value={e.name}>
                      {e.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className='col-6'>
              <div className='form__control'>
                <label
                  className='form__label d-block w-100 text-left'
                  htmlFor='ownerName'
                >
                  Owner Name
                </label>
                <input
                  tabIndex='8'
                  value={payLoad.ownerName}
                  onChange={onChangeHandler}
                  className='form__input w-100'
                  type='text'
                  id='ownerName'
                  name='ownerName'
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
                  tabIndex='9'
                  required
                  value={payLoad.fromState}
                  onChange={onChangeHandler}
                  name='fromState'
                >
                  <option value={''}>--Select State--</option>
                  {fields.fromState.map((e) => (
                    <option key={e.name} value={e.name}>
                      {e.name}
                    </option>
                  ))}
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
                  tabIndex='10'
                  required
                  value={payLoad.taxMode}
                  onChange={onChangeHandler}
                  name='taxMode'
                >
                  <option value={''}>--Select Tax Mode--</option>
                  {fields.taxMode.map((e) => (
                    <option key={e.name} value={e.name}>
                      {e.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className='form__control'>
                <label
                  className='form__label d-block w-100 text-left'
                  htmlFor='taxFromDate'
                >
                  Tax From Date<sup>*</sup>
                </label>
                <input
                  tabIndex='11'
                  required
                  value={payLoad.taxFromDate}
                  onChange={onChangeHandler}
                  className='form__input w-100'
                  type='date'
                  id='taxFromDate'
                  name='taxFromDate'
                />
              </div>
              <div className='form__control'>
                <label
                  className='form__label d-block w-100 text-left'
                  htmlFor='taxUptoDate'
                >
                  Tax Upto Date<sup>*</sup>
                </label>
                <input
                  tabIndex='12'
                  required
                  value={payLoad.taxUptoDate}
                  onChange={onChangeHandler}
                  className='form__input w-100'
                  type='date'
                  id='taxUptoDate'
                  name='taxUptoDate'
                />
              </div>
              <div className='form__control'>
                <label
                  className='form__label d-block w-100 text-left'
                  htmlFor='paymentMode'
                >
                  Payment Mode<sup>*</sup>
                </label>
                <select
                  tabIndex='13'
                  required
                  value={payLoad.paymentMode}
                  onChange={onChangeHandler}
                  name='paymentMode'
                >
                  <option value=''>--Select Payment Mode--</option>
                  {fields[state].paymentMode.map((e) => (
                    <option key={e.name} value={e.name}>
                      {e.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className='form__control'>
                <label
                  className='form__label d-block w-100 text-left'
                  htmlFor='permitType'
                >
                  Permit Type<sup>*</sup>
                </label>
                <select
                  tabIndex='14'
                  required
                  value={payLoad.permitType}
                  onChange={onChangeHandler}
                  name='permitType'
                >
                  <option value=''>--Select Permit Type--</option>
                  {fields[state].permitType.map((e) => (
                    <option key={e.name} value={e.name}>
                      {e.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className='form__control'>
                <label
                  className='form__label d-block w-100 text-left'
                  htmlFor='grossVehicleWeight'
                >
                  Gross Vehicle Weight (in Kgs)
                </label>
                <input
                  tabIndex='15'
                  value={payLoad.grossVehicleWeight}
                  onChange={onChangeHandler}
                  className='form__input w-100'
                  type='text'
                  id='grossVehicleWeight'
                  name='grossVehicleWeight'
                />
              </div>
              <div className='form__control'>
                <label
                  className='form__label d-block w-100 text-left'
                  htmlFor='unladenWeight'
                >
                  Unladen Weight (in Kgs)
                </label>
                <input
                  tabIndex='16'
                  value={payLoad.unladenWeight}
                  onChange={onChangeHandler}
                  className='form__input w-100'
                  type='text'
                  id='unladenWeight'
                  name='unladenWeight'
                />
              </div>
            </div>
          </div>
          <div className='text-center'>
            <ActionButtons
              isLoading={isLoading}
              onResetHandler={onResetHandler}
              getDetailsHandler={getDetailsHandler}
            />
            <Loader isLoading={isLoading} />
          </div>
        </form>
      </div>
      <br />
      <br />
      <br />
      <br />
    </>
  );
};

export default ArunachalPradesh;
