import React, { useRef, useState } from 'react';
import { useHistory } from 'react-router';
import ActionButtons from '../components/ActionButtons';
import Header from '../components/Header';
import Loader from '../components/Loader';
import { fields, LOCAL_STORAGE_KEY } from '../constants';
import { getDetailsApi } from '../utils/api';

const WestBengal = () => {
  const isLoggedIn = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || 'null');
  const history = useHistory();
  const state = 'wb';

  const [payLoad, setPayLoad] = useState({
    vehicleNo: '',
    chassisNo: '',
    mobileNo: '',
    ownerName: '',
    fromState: '',
    vehiclePermitType: '',
    vehicleClass: '',
    permitType: '',
    seatingCapacityExcludingDriver: '',
    sleeperCap: '',
    serviceType: '',
    districtName: '',
    fitnessValidity: '',
    permitNo: '',
    checkpostName: '',
    permitFrom: '',
    permitUpto: '',
    taxFromDate: '',
    taxUptoDate: '',
    taxMode: '',
    numberOfPeriod: '',
    taxAmount: '',
    userCharge: '',
    infraCess: '',
    grossVehicleWeight: '',
    unladenWeight: '',
    surChargeFee: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const form = useRef(null);

  const onChangeHandler = (e) => {
    setPayLoad((old) => ({ ...old, [e.target.name]: e.target.value }));
  };

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
        'seatingCapacityExcludingDriver',
        'serviceType',
        'vehicleClass',
        'taxMode',
        'checkpostName',
      ].forEach((key) => {
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

    setIsLoading(true);
    if (!payLoad.unladenWeight) {
      payLoad.unladenWeight = 0;
    }

    const totalAmount = (+payLoad.taxAmount || 0) + (+payLoad.surChargeFee || 0);

    history.push('/select-payment', {
      formData: {
        ...payLoad,
        state,
        totalAmount,
      },
    });
  };

  const onResetHandler = () => {
    const p = {};
    Object.keys(payLoad).forEach((k) => (p[k] = ''));
    setPayLoad(p);
  };

  if (!isLoggedIn || !isLoggedIn.accessState || !isLoggedIn.accessState.includes(fields.stateName.wb)) {
    return (
      <>
        <Header />
        <div className='container text-center mt-4 '>
          <h3>No Access of this state</h3>
        </div>
      </>
    );
  }

  // tolerant checkpost list (support possible naming variants in constants)
  const checkPosts = (fields.wb && (fields.wb.checkPostName || fields.wb.checkpostName || [])) || [];

  return (
    <>
      <Header />
      <div className='text-center'>
        <p className='login-heading mt-4'>
          TAX PAYMENT FOR VEHICLES HAVING TOURIST PERMIT <span>WEST BENGAL</span>
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
              {/* vehicle number */}
              <div className='form__control'>
                <label className='form__label d-block w-100 text-left' htmlFor='vehicleNo'>
                  Vehicle No.<sup>*</sup>
                </label>
                <input
                  tabIndex='1'
                  required
                  disabled={isLoading}
                  autoFocus
                  maxLength='10'
                  value={payLoad.vehicleNo}
                  onChange={onChangeHandler}
                  className='form__input w-100'
                  type='text'
                  id='vehicleNo'
                  name='vehicleNo'
                />
              </div>

              {/* chassis number */}
              <div className='form__control'>
                <label className='form__label d-block w-100 text-left' htmlFor='chassisNo'>
                  Chassis No.<sup>*</sup>
                </label>
                <input
                  tabIndex='2'
                  required
                  disabled={isLoading}
                  onChange={onChangeHandler}
                  value={payLoad.chassisNo}
                  className='form__input w-100'
                  type='text'
                  maxLength='19'
                  id='chassisNo'
                  name='chassisNo'
                />
              </div>

              {/* mobile number */}
              <div className='form__control'>
                <label className='form__label d-block w-100 text-left' htmlFor='mobileNo'>
                  Mobile No.<sup>*</sup>
                </label>
                <input
                  required
                  tabIndex='3'
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

              {/* vehicle type */}
              <div className='form__control'>
                <label className='form__label d-block w-100 text-left' htmlFor='vehiclePermitType'>
                  Vehicle Type<sup>*</sup>
                </label>
                <select
                  required
                  tabIndex='4'
                  name='vehiclePermitType'
                  id='vehiclePermitType'
                  value={payLoad.vehiclePermitType}
                  onChange={onChangeHandler}
                >
                  <option value=''>--Select Vehicle Type--</option>
                  {(fields.wb && fields.wb.vehiclePermitType || []).map((type) => {
                    return (
                      <option value={type.name} key={type.name}>
                        {type.name}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* goods vs passenger fields */}
              {payLoad?.vehiclePermitType === 'GOODS VEHICLE' ? (
                <div className='row'>
                  <div className='col-sm-6'>
                    {/* gross vehicle weight */}
                    <div className='form__control'>
                      <label className='form__label d-block w-100 text-left' htmlFor='grossVehicleWeight'>
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
                    {/* unladen weight */}
                    <div className='form__control'>
                      <label className='form__label d-block w-100 text-left' htmlFor='unladenWeight'>
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
                        id='unladenWeight'
                        name='unladenWeight'
                        value={payLoad.unladenWeight}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className='row'>
                  <div className='col-sm-6'>
                    {/* seating */}
                    <div className='form__control'>
                      <label className='form__label d-block w-100 text-left' htmlFor='seatingCapacityExcludingDriver'>
                        Seating Capacity(Ex Driver)<sup>*</sup>
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
                    {/* sleeper */}
                    <div className='form__control'>
                      <label className='form__label d-block w-100 text-left' htmlFor='sleeperCap'>
                        Sleeper Cap<sup>*</sup>
                      </label>
                      <input
                        required
                        tabIndex='6'
                        min='0'
                        disabled={isLoading}
                        onChange={onChangeHandler}
                        className='form__input w-100'
                        type='number'
                        id='sleeperCap'
                        name='sleeperCap'
                        value={payLoad.sleeperCap}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className='row'>
                {/* district */}
                <div className='col-sm-6'>
                  <div className='form__control'>
                    <label className='form__label d-block w-100 text-left' htmlFor='districtName'>
                      District<sup>*</sup>
                    </label>
                    <select
                      required
                      disabled={isLoading}
                      tabIndex='7'
                      onChange={onChangeHandler}
                      value={payLoad.districtName}
                      name='districtName'
                      id='districtName'
                    >
                      <option value=''>--Select District Name--</option>
                      {(fields.wb && fields.wb.districtName || []).map((type) => {
                        return (
                          <option value={type.name} key={type.name}>
                            {type.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                {/* checkpost */}
                <div className='col-sm-6'>
                  <div className='form__control'>
                    <label className='form__label d-block w-100 text-left' htmlFor='checkpostName'>
                      Checkpost Name<sup>*</sup>
                    </label>
                    <select
                      required
                      disabled={isLoading}
                      tabIndex='9'
                      value={payLoad.checkpostName}
                      onChange={onChangeHandler}
                      name='checkpostName'
                      id='checkpostName'
                    >
                      <option value=''>--Select Barrier--</option>
                      {checkPosts.map((checkpost) => {
                        return (
                          <option value={checkpost.name} key={checkpost.name}>
                            {checkpost.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              </div>

              {/* Tax from */}
              <div className='form__control'>
                <label className='form__label d-block w-100 text-left' htmlFor='taxFromDate'>
                  Tax from<sup>*</sup>
                </label>
                <input
                  required
                  tabIndex='20'
                  value={payLoad.taxFromDate}
                  onChange={onChangeHandler}
                  disabled={isLoading}
                  className='form__input w-100'
                  type='datetime-local'
                  id='taxFromDate'
                  name='taxFromDate'
                />
              </div>
            </div>

            {/* right side */}
            <div className='col-6'>
              <div className='form__control text-left'>
                <label className='form__label d-block w-100 text-left'>&nbsp;</label>
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

              {/* owner name */}
              <div className='form__control'>
                <label className='form__label d-block w-100 text-left' htmlFor='ownerName'>
                  Owner Name<sup>*</sup>
                </label>
                <input
                  disabled={isLoading}
                  required
                  tabIndex='12'
                  className='form__input w-100'
                  type='text'
                  id='ownerName'
                  name='ownerName'
                  value={payLoad.ownerName}
                  onChange={onChangeHandler}
                />
              </div>

              {/* from state */}
              <div className='form__control'>
                <label className='form__label d-block w-100 text-left' htmlFor='fromState'>
                  From State<sup>*</sup>
                </label>
                <select
                  disabled={isLoading}
                  required
                  tabIndex='13'
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

              {/* vehicle class */}
              <div className='form__control'>
                <label className='form__label d-block w-100 text-left' htmlFor='vehicleClass'>
                  Vehicle Class<sup>*</sup>
                </label>
                <select
                  required
                  disabled={isLoading}
                  tabIndex='14'
                  value={payLoad.vehicleClass}
                  onChange={onChangeHandler}
                  name='vehicleClass'
                  id='vehicleClass'
                >
                  <option value=''>--Select Vehicle Class--</option>
                  {payLoad.vehiclePermitType === 'CONTRACT CARRIAGE/PASSANGER VEHICLES' && (
                    <>
                      <option value='MOTOR CAB'>MOTOR CAB</option>
                      <option value='MAXI CAB'>MAXI CAB</option>
                      <option value='OMNI BUS'>OMNI BUS</option>
                      <option value='BUS'>BUS</option>
                      <option value='AMBULANCE'>AMBULANCE</option>
                    </>
                  )}
                  {payLoad.vehiclePermitType === 'GOODS VEHICLE' && (
                    <>
                      <option value='LIGHT GOODS VEHICLE'>LIGHT GOODS VEHICLE</option>
                      <option value='MEDIUM GOODS VEHICLE'>MEDIUM GOODS VEHICLE</option>
                      <option value='HEAVY GOODS VEHICLE'>HEAVY GOODS VEHICLE</option>
                    </>
                  )}
                  {payLoad.vehiclePermitType === 'CONSTRUCTION EQUIPMENT VEHICLE' && (
                    <option value='CONSTRUCTION EQUIPMENT VEHICLE'>CONSTRUCTION EQUIPMENT VEHICLE</option>
                  )}
                  {payLoad.vehiclePermitType === 'STAGE CARRIAGE' && (
                    <option value='STAGE CARRIAGE'>STAGE CARRIAGE</option>
                  )}
                </select>
              </div>

              <div className='row'>
                <div className='col-sm-6'>
                  {/* Permit Type */}
                  <div className='form__control'>
                    <label className='form__label d-block w-100 text-left' htmlFor='permitType'>
                      Permit Type<sup>*</sup>
                    </label>
                    <select
                      required
                      tabIndex='15'
                      disabled={isLoading}
                      value={payLoad.permitType}
                      onChange={onChangeHandler}
                      name='permitType'
                      id='permitType'
                    >
                      <option value=''>--Select Permit Type--</option>
                      {(fields.wb && fields.wb.permitType || []).map((type) => {
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
                  {/* Service Type */}
                  <div className='form__control'>
                    <label className='form__label d-block w-100 text-left' htmlFor='serviceType'>
                      Service Type<sup>*</sup>
                    </label>
                    <select
                      required
                      tabIndex='16'
                      disabled={isLoading}
                      value={payLoad.serviceType}
                      onChange={onChangeHandler}
                      name='serviceType'
                      id='serviceType'
                    >
                      <option value=''>--Select Service Type--</option>
                      {(fields.wb && fields.wb.serviceType || []).map((type) => {
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
                  {/* Tax mode */}
                  <div className='form__control'>
                    <label className='form__label d-block w-100 text-left' htmlFor='taxMode'>
                      Tax Mode<sup>*</sup>
                    </label>
                    <select
                      required
                      disabled={isLoading}
                      tabIndex='10'
                      value={payLoad.taxMode}
                      onChange={onChangeHandler}
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

                <div className='col-sm-6'>
                  {/* No. of Period */}
                  <div className='form__control'>
                    <label className='form__label d-block w-100 text-left' htmlFor='numberOfPeriod'>
                      No of Period<sup>*</sup>
                    </label>
                    <input
                      disabled={isLoading}
                      required
                      tabIndex='11'
                      className='form__input w-100'
                      type='text'
                      value={payLoad.numberOfPeriod}
                      onChange={onChangeHandler}
                      id='numberOfPeriod'
                      name='numberOfPeriod'
                    />
                  </div>
                </div>
              </div>

              {/* Tax Upto */}
              <div className='form__control'>
                <label className='form__label d-block w-100 text-left' htmlFor='taxUptoDate'>
                  Tax Upto<sup>*</sup>
                </label>
                <input
                  tabIndex='21'
                  required
                  value={payLoad.taxUptoDate}
                  onChange={onChangeHandler}
                  disabled={isLoading}
                  className='form__input w-100'
                  type='datetime-local'
                  id='taxUptoDate'
                  name='taxUptoDate'
                />
              </div>
            </div>
          </div>

          {/* tax table */}
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
                    <td className='pb-table-text'>MV Tax<sup>*</sup></td>
                    <td className=''></td>
                    <td className=''></td>
                    <td className='input-box'>
                      <center>
                        <input
                          tabIndex='22'
                          required
                          min='0'
                          disabled={isLoading}
                          value={payLoad.taxAmount}
                          onChange={onChangeHandler}
                          name='taxAmount'
                          type='number'
                          inputMode='numeric'
                        />
                      </center>
                    </td>
                  </tr>
                  <tr>
                    <td className=''>2</td>
                    <td className='pb-table-text'>Additional MV Tax<sup>*</sup></td>
                    <td className=''></td>
                    <td className=''></td>
                    <td className='input-box'>
                      <center>
                        <input
                          tabIndex='23'
                          required
                          min='0'
                          disabled={isLoading}
                          value={payLoad.surChargeFee}
                          onChange={onChangeHandler}
                          name='surChargeFee'
                          type='number'
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
          {/* totals */}
          <div className='row'>
            <div className='col-sm-6'>
              <div className='form__control'>
                <label className='form__label d-block w-100 text-left' htmlFor='totalAmount'>
                  Total tax amount<sup>*</sup>
                </label>
                <input
                  disabled
                  min='0'
                  value={(+payLoad.taxAmount || 0) + (+payLoad.surChargeFee || 0)}
                  className='w-100 form__input'
                  type='number'
                />
              </div>
            </div>
            <div className='col-sm-6'>
              <label className='form__label d-block w-100 text-left'>&nbsp;</label>
              <ActionButtons tabIndex='25' isDisabled={isLoading} onReset={onResetHandler} />
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

export default WestBengal;
