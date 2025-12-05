import React, { useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import ActionButtons from '../components/ActionButtons';
import Header from '../components/Header';
import Loader from '../components/Loader';
import { fields, LOCAL_STORAGE_KEY } from '../constants';
import { getDetailsApi } from '../utils/api';

const Maharashtra = () => {
  const isLoggedIn = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || 'null');
  const state = 'maharashtra';
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
    totalAmount: '',
    ownerName: '',
    fromState: '',
    vehicleClass: '',
    taxMode: '',
    taxFromDate: '',
    taxUptoDate: '',
    serviceType: '',
    checkpostName: '',
    permitFee: '',
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
    let isValid = true;
    Object.keys(payLoad).forEach((key) => {
      if (!payLoad[key] || payLoad[key] === '-1') {
        isValid = false;
      }
    });

    if (!isValid) {
      alert('Please fill all fields!');
      return;
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

  if (!isLoggedIn || !isLoggedIn.accessState || !isLoggedIn.accessState.includes(fields.stateName.maharashtra)) {
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
          <b>BORDER TAX PAYMENT FOR ENTRY INTO</b> <span>MAHARASHTRA</span>
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
                  Vehicle <sup>*</sup>
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

              <div className='row'>
                <div className='col-sm-6'>
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
                      onChange={onChangeHandler}
                      required
                      name='vehiclePermitType'
                      id='vehiclePermitType'
                    >
                      <option value=''>--Select Vehicle Type--</option>
                      {fields.maharashtra.vehiclePermitType.map((type) => {
                        return (
                          <option value={type.name} key={type.name}>
                            {type.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
                <div className='col-sm-6'>
                  {/* <!-- vehicle class --> */}
                  <div className='form__control'>
                    <label
                      className='form__label d-block w-100 text-left'
                      htmlFor='vehicleClass'
                    >
                      Vehicle Class<sup>*</sup>
                    </label>
                    <select
                      tabIndex='5'
                      disabled={isLoading}
                      required
                      value={payLoad.vehicleClass}
                      onChange={onChangeHandler}
                      name='vehicleClass'
                      id='vehicleClass'
                    >
                      <option value=''>--Select Vehicle Class--</option>
                      {fields.maharashtra.vehicleClass.map((type) => {
                        return <option key={type.name}>{type.name}</option>;
                      })}
                    </select>
                  </div>
                </div>
              </div>

              {/* ... rest of form unchanged from your original file ... */}

            </div>

            <div className='col-6'>
              {/* right side */}
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

              {/* rest of right-side markup unchanged */}
            </div>
          </div>

          {/* totals and ActionButtons as in your original file */}
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

export default Maharashtra;
