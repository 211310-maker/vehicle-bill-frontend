import React, { useRef, useState } from 'react';
import { useHistory } from 'react-router';
import ActionButtons from '../components/ActionButtons';
import Header from '../components/Header';
import Loader from '../components/Loader';
import { fields, LOCAL_STORAGE_KEY } from '../constants';
import { getDetailsApi } from '../utils/api';
import { randomNumber } from '../utils/helper';
const Haryana = () => {
  const isLoggedIn = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
  const history = useHistory();
  const state = 'haryana';

  // all input fields
  const [payLoad, setPayLoad] = useState({
    vehicleNo: '',
    chassisNo: '',
    mobileNo: '',
    vehiclePermitType: '',
    seatingCapacityExcludingDriver: '',
    borderBarrier: '',
    totalAmount: '',
    ownerName: '',
    fromState: '',
    vehicleClass: '',
    serviceType: '',
    taxMode: '',
    taxFromDate: '',
    taxUptoDate: '',
    distance: '',
    grossVehicleWeight: '',
    unladenWeight: '',
  });
  // all inputs fields
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
      [
        'chassisNo',
        'mobileNo',
        'ownerName',
        'borderBarrier',
        'checkpostName',
        'seatingCapacityExcludingDriver',
        'distance',
        'serviceType',
        'taxMode',
      ].forEach((key) => {
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

  const onChangeHandler = (e) => {
    setPayLoad((old) => ({ ...old, [e.target.name]: e.target.value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!payLoad.unladenWeight) {
      payLoad.unladenWeight = 0;
    }
    payLoad.bankRefNo = randomNumber(8);
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

  if (!isLoggedIn.accessState.includes(fields.stateName.haryana)) {
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
          <b>BORDER TAX PAYMENT FOR ENTRY INTO</b> <span>HARYANA</span>
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
                  tabIndex='1'
                  required
                  inputMode='text'
                  disabled={isLoading}
                  maxLength='10'
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
                  vehicle Permit Type<sup>*</sup>
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
                  <option value=''>--Select vehicle type--</option>
                  {fields.haryana.vehiclePermitType.map((type) => {
                    return (
                      <option value={type.name} key={type.name}>
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
                      Seating Capacity(Excluding Driver)<sup>*</sup>
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

              {/* <!-- distance --> */}
              <div className='form__control'>
                <label
                  className='form__label d-block w-100 text-left'
                  htmlFor='distance'
                >
                  Distance(In KM)<sup>*</sup>
                </label>
                <input
                  tabIndex='6'
                  required
                  disabled={isLoading}
                  className='form__input w-100'
                  type='number'
                  min='0'
                  inputMode='numeric'
                  id='distance'
                  onChange={onChangeHandler}
                  name='distance'
                  value={payLoad.disabled}
                />
              </div>
              {/* <!-- Border/barrier --> */}
              <div className='form__control'>
                <label
                  className='form__label d-block w-100 text-left'
                  htmlFor='borderBarrier'
                >
                  Border/barrier District through Entering<sup>*</sup>
                </label>
                <select
                  tabIndex='7'
                  value={payLoad.borderBarrier}
                  onChange={onChangeHandler}
                  name='borderBarrier'
                  id='borderBarrier'
                  disabled={isLoading}
                  required
                >
                  <option value=''>--Select District/Barrier--</option>
                  {fields.haryana.borderBarrier.map((type) => {
                    return (
                      <option value={type.name} key={type.name}>
                        {type.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            {/* ============  right side form fields ================== */}
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
                  tabIndex='8'
                  required
                  disabled={isLoading}
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
                  tabIndex='9'
                  required
                  disabled={isLoading}
                  value={payLoad.fromState}
                  onChange={onChangeHandler}
                  name='fromState'
                  id='fromState'
                >
                  <option value=''>--Select State--</option>
                  {fields.fromState.map((type) => {
                    return (
                      <option value={type.name} key={type.name}>
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
                  tabIndex='10'
                  disabled={isLoading}
                  required
                  value={payLoad.vehicleClass}
                  onChange={onChangeHandler}
                  name='vehicleClass'
                  id='vehicleClass'
                >
                  <option value=''>--Select Vehicle Class--</option>
                  {payLoad.vehiclePermitType ===
                    'CONTRACT CARRIAGE/PASSANGER VEHICLES' && (
                    <>
                      <option value='MOTOR CYCLE'>MOTOR CYCLE</option>
                      <option value='THREE WHEELER(PASSENGER)'>
                        THREE WHEELER(PASSENGER)
                      </option>
                      <option value='MOTOR CAB'>MOTOR CAB</option>
                      <option value='MAXI CAB'>MAXI CAB</option>
                      <option value='OMNI BUS'>OMNI BUS</option>
                      <option value='BUS'>BUS</option>
                      <option value='SLEEPER BUS'>SLEEPER BUS</option>
                      <option value='VOLVO OR MERECEDEZ ETC'>
                        VOLVO OR MERECEDEZ ETC
                      </option>
                      <option value='EDUCATIONAL BUS'>EDUCATIONAL BUS</option>
                      <option value='EDUCATIONAL BUS USED BY SCHOOL'>
                        EDUCATIONAL BUS USED BY SCHOOL
                      </option>
                      <option value='PRIVATE ORGANIZATIONS'>
                        PRIVATE ORGANIZATIONS
                      </option>
                      <option value='CRANE MOUNTED VEHICLE'>
                        CRANE MOUNTED VEHICLE
                      </option>
                    </>
                  )}
                  {payLoad.vehiclePermitType === 'PRIVATE SERVICE VEHICLE' && (
                    <>
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
                  {payLoad.vehiclePermitType === 'STAGE CARRIAGE' && (
                    <option value='BUS'>BUS</option>
                  )}
                  {payLoad.vehiclePermitType ===
                    'CONSTRUCTION EQUIPMENT VEHICLE' && (
                    <option value='CONSTRUCTION EQUIPMENT VEHICLE'>
                      CONSTRUCTION EQUIPMENT VEHICLE
                    </option>
                  )}
                </select>
              </div>
              {/* <!-- service type --> */}
              <div className='form__control'>
                <label
                  className='form__label d-block w-100 text-left'
                  htmlFor='serviceType'
                >
                  Service Type<sup>*</sup>
                </label>
                <select
                  tabIndex='11'
                  disabled={isLoading}
                  required
                  value={payLoad.serviceType}
                  onChange={onChangeHandler}
                  name='serviceType'
                  id='serviceType'
                >
                  <option value=''>--Select Service Type--</option>
                  {fields.haryana.serviceType.map((type) => {
                    return <option key={type.name}>{type.name}</option>;
                  })}
                </select>
              </div>
              {/* <!-- Tax mode --> */}
              <div className='form__control'>
                <label
                  className='form__label d-block w-100 text-left'
                  htmlFor='taxMode'
                >
                  Tax Mode<sup>*</sup>
                </label>
                <select
                  tabIndex='12'
                  disabled={isLoading}
                  required
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
              <div className='row'>
                <div className='col-sm-6'>
                  {/* <!-- Tax From Date --> */}
                  <div className='form__control'>
                    <label
                      className='form__label d-block w-100 text-left'
                      htmlFor='taxFromDate'
                    >
                      Tax From Date<sup>*</sup>
                    </label>
                    <input
                      tabIndex='13'
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
                  {/* <!-- Tax upto Date --> */}
                  <div className='form__control'>
                    <label
                      className='form__label d-block w-100 text-left'
                      htmlFor='taxUptoDate'
                    >
                      Tax upto Date<sup>*</sup>
                    </label>
                    <input
                      tabIndex='14'
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
                  tabIndex='15'
                  required
                  disabled={isLoading}
                  onChange={onChangeHandler}
                  value={payLoad.totalAmount}
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
                tabIndex='16'
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

export default Haryana;
