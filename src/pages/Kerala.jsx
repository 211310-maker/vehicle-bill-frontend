import React, { useRef, useState } from "react";
import { useHistory } from "react-router";
import ActionButtons from "../components/ActionButtons";
import Header from "../components/Header";
import Loader from "../components/Loader";
import { fields, LOCAL_STORAGE_KEY } from "../constants";
import { getDetailsApi } from "../utils/api";

const Kerala = () => {
  const isLoggedIn = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));

  const state = "kerela";
  const history = useHistory();

  // all input fields
  const [payLoad, setPayLoad] = useState({
    vehicleNo: "",
    chassisNo: "",
    mobileNo: "",
    vehiclePermitType: "",
    seatingCapacityExcludingDriver: "",
    sleeperCapacityExcludingDriver: "",
    borderBarrier: "",
    totalAmount: "",
    ownerName: "",
    fromState: "",
    vehicleClass: "",
    taxMode: "",
    taxFromDate: "",
    taxUptoDate: "",
    permitType: "",
    serviceType: "",
    grossVehicleWeight: "",
    unladenWeight: "",
    basicPermitValidity: "",
    fitnessValidity: "",
    insuranceValidity: "",
    taxValidity: "",
    floorArea: "",
    infraCess: "",
    mvTax: "",
    cess: "",
    permitFee: "",
    permitEndoresment: "",
    routeOfTheJourney: "",
    purposeOfJourney: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const form = useRef(null);

  const getDetailsHandler = async () => {
    if (!payLoad.vehicleNo) {
      alert("Please enter vehicle no.");
      return;
    }
    setIsLoading(true);
    const { data } = await getDetailsApi({
      vehicleNo: payLoad.vehicleNo,
    });
    setIsLoading(false);
    if (data && data.success) {
      const preLoadedData = {};
      ["chassisNo", "mobileNo", "ownerName", "borderBarrier"].forEach((key) => {
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

    if (
      (payLoad.vehiclePermitType === "CONSTRUCTION EQUIPMENT VEHICLE" &&
        payLoad.permitType === "NOT APPLICABLE") ||
      (payLoad.vehiclePermitType === "CONTRACT CARRIAGE/PASSANGER VEHICLES" &&
        payLoad.permitType === "TOURIST PERMIT") ||
      (payLoad.vehiclePermitType === "GOODS VEHICLE" &&
        payLoad.permitType === "NATIONAL PERMIT")
    ) {
      payLoad.totalAmount = +payLoad.mvTax + +payLoad.cess + +payLoad.infraCess;
    } else {
      payLoad.totalAmount =
        +payLoad.mvTax +
        +payLoad.cess +
        +payLoad.infraCess +
        +payLoad.permitFee +
        +payLoad.permitEndoresment;
    }

    history.push("/select-payment", {
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
      p[e] = "";
    });
    setPayLoad({ ...p });
  };

  if (!isLoggedIn.accessState.includes(fields.stateName.bihar)) {
    return (
      <>
        <Header />
        <div className="container text-center mt-4 ">
          <h3>No Access of this state</h3>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="text-center">
        <p className="login-heading mt-4">
          <b>BORDER TAX PAYMENT FOR ENTRY INTO</b> <span>KERELA</span>
        </p>
      </div>
      <div className="box box--main">
        <div className="box__heading--blue">Tax Payment Details</div>
        <form
          ref={form}
          onSubmit={onSubmitHandler}
          className="service-type tax-details mt-4"
        >
          <div className="row">
            <div className="col-6">
              {/* <!-- vehicle number --> */}
              <div className="form__control">
                <label
                  className="form__label d-block w-100 text-left"
                  htmlFor="vehicleNo"
                >
                  Vehicle No.<sup>*</sup>
                </label>
                <input
                  tabIndex="1"
                  required
                  maxLength="10"
                  autoFocus
                  inputMode="text"
                  disabled={isLoading}
                  value={payLoad.vehicleNo}
                  onChange={onChangeHandler}
                  className="form__input w-100"
                  type="text"
                  id="vehicleNo"
                  name="vehicleNo"
                />
              </div>
              <div className="row">
                <div className="col-sm-6">
                  {/* <!-- chassis number --> */}
                  <div className="form__control">
                    <label
                      className="form__label d-block w-100 text-left"
                      htmlFor="chassisNo"
                    >
                      Chassis No.<sup>*</sup>
                    </label>
                    <input
                      required
                      tabIndex="2"
                      maxLength="19"
                      inputMode="text"
                      disabled={isLoading}
                      onChange={onChangeHandler}
                      value={payLoad.chassisNo}
                      className="form__input w-100"
                      type="text"
                      id="chassisNo"
                      name="chassisNo"
                    />
                  </div>
                </div>
                <div className="col-sm-6">
                  {/* <!-- mobile number --> */}
                  <div className="form__control">
                    <label
                      className="form__label d-block w-100 text-left"
                      htmlFor="mobileNo"
                    >
                      Mobile No.<sup>*</sup>
                    </label>
                    <input
                      required
                      tabIndex="3"
                      disabled={isLoading}
                      value={payLoad.mobileNo}
                      onChange={onChangeHandler}
                      placeholder="SMS about payment will be sent to this number "
                      className="form__input w-100"
                      type="text"
                      id="mobileNo"
                      inputMode="tel"
                      maxLength="10"
                      minLength="10"
                      name="mobileNo"
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                {/* District Name */}
                <div className="col-sm-6">
                  <div className="form__control">
                    <label
                      className="form__label d-block w-100 text-left"
                      htmlFor="districtName"
                    >
                      District Name<sup>*</sup>
                    </label>
                    <select
                      tabIndex="4"
                      value={payLoad.districtName}
                      onChange={onChangeHandler}
                      required
                      name="districtName"
                      id="districtName"
                    >
                      <option value="">--Select District--</option>
                    </select>
                  </div>
                </div>
                {/* Checkpost Name */}
                <div className="col-sm-6">
                  <div className="form__control">
                    <label
                      className="form__label d-block w-100 text-left"
                      htmlFor="checkpostName"
                    >
                      Checkpost Name
                    </label>
                    <select
                      tabIndex="4"
                      value={payLoad.checkpostName}
                      onChange={onChangeHandler}
                      required
                      name="checkpostName"
                      id="checkpostName"
                    >
                      <option value="">--Select Checkpost Name--</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="row">
                {/* <!-- vehicle type --> */}
                <div className="col-sm-6">
                  <div className="form__control">
                    <label
                      className="form__label d-block w-100 text-left"
                      htmlFor="vehiclePermitType"
                    >
                      Vehicle Type<sup>*</sup>
                    </label>
                    <select
                      tabIndex="4"
                      value={payLoad.vehiclePermitType}
                      onChange={onChangeHandler}
                      required
                      name="vehiclePermitType"
                      id="vehiclePermitType"
                    >
                      <option value="">--Select Vehicle Type--</option>
                      {fields.kerala.vehiclePermitType.map((type) => {
                        return (
                          <option value={type.name} key={type.name}>
                            {type.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
                {/* <!-- vehicle className --> */}
                <div className="col-sm-6">
                  <div className="form__control">
                    <label
                      className="form__label d-block w-100 text-left"
                      htmlFor="vehicleClass"
                    >
                      Vehicle Class<sup>*</sup>
                    </label>
                    <select
                      tabIndex="11"
                      required
                      disabled={isLoading}
                      value={payLoad.vehicleClass}
                      onChange={onChangeHandler}
                      name="vehicleClass"
                      id="vehicleClass"
                    >
                      <option value="">--Select Vehicle Class--</option>
                      {payLoad.vehiclePermitType ===
                        "CONTRACT CARRIAGE/PASSANGER VEHICLES" && (
                        <>
                          <option value="THREE WHEELER(PASSENGER)">
                            THREE WHEELER(PASSENGER)
                          </option>
                          <option value="MOTOR CAB">MOTOR CAB</option>
                          <option value="MAXI CAB">MAXI CAB</option>
                          <option value="OMNI BUS">OMNI BUS</option>
                          <option value="BUS">BUS</option>
                        </>
                      )}
                      {payLoad.vehiclePermitType === "GOODS VEHICLE" && (
                        <>
                          <option value="LIGHT GOODS VEHICLE">
                            LIGHT GOODS VEHICLE
                          </option>
                          <option value="MEDIUM GOODS VEHICLE">
                            MEDIUM GOODS VEHICLE
                          </option>
                          <option value="HEAVY GOODS VEHICLE">
                            HEAVY GOODS VEHICLE
                          </option>
                        </>
                      )}
                      {payLoad.vehiclePermitType ===
                        "EDUCATIONAL INSTITUTIONAL BUS" && (
                        <option value="EDUCATIONAL BUS">EDUCATIONAL BUS</option>
                      )}
                      {payLoad.vehiclePermitType ===
                        "CONSTRUCTION EQUIPMENT VEHICLE" && (
                        <option value="CONSTRUCTION EQUIPMENT VEHICLE">
                          CONSTRUCTION EQUIPMENT VEHICLE
                        </option>
                      )}
                      {payLoad.vehiclePermitType === "PRIVATE VEHICLE" && (
                        <>
                          <option value="MOTOR CYCLE">MOTOR CYCLE</option>
                          <option value="MOTOR CAR">MOTOR CAR</option>
                          <option value="TRAILER">TRAILER</option>
                          <option value="PRIVATE SERVICE VEHICLE">
                            PRIVATE SERVICE VEHICLE
                          </option>
                          <option value="EDUCATIONAL BUS USED BY SCHOOL">
                            EDUCATIONAL BUS USED BY SCHOOL
                          </option>
                          <option value="TRACTOR">TRACTOR</option>
                          <option value="AGRICULTURE TRACTOR">
                            AGRICULTURE TRACTOR
                          </option>
                          <option value="AGRICULTURE TRAILER">
                            AGRICULTURE TRAILER
                          </option>
                          <option value="HARVESTER">HARVESTER</option>
                          <option value="TRAILER FOR PERSONAL USE">
                            TRAILER FOR PERSONAL USE
                          </option>
                          <option value="TRACTOR-TROLLEY(COMMERCIAL)">
                            TRACTOR-TROLLEY(COMMERCIAL)
                          </option>
                        </>
                      )}
                    </select>
                  </div>
                </div>
              </div>

              {payLoad.vehiclePermitType ==
              "CONTRACT CARRIAGE/PASSANGER VEHICLES" ? (
                <div className="row">
                  {/* <!-- seating capacity --> */}
                  <div className="col-sm-6">
                    <div className="form__control">
                      <label
                        className="form__label d-block w-100 text-left"
                        htmlFor="seatingCapacityExcludingDriver"
                      >
                        Seating Capacity(Ex. Driver)<sup>*</sup>
                      </label>
                      <input
                        required
                        tabIndex="5"
                        min="0"
                        disabled={isLoading}
                        onChange={onChangeHandler}
                        className="form__input w-100"
                        type="number"
                        value={payLoad.seatingCapacityExcludingDriver}
                        id="seatingCapacityExcludingDriver"
                        name="seatingCapacityExcludingDriver"
                      />
                    </div>
                  </div>

                  {/* <!-- sleeper capacity  --> */}
                  <div className="col-sm-6">
                    <div className="form__control">
                      <label
                        className="form__label d-block w-100 text-left"
                        htmlFor="sleeperCapacityExcludingDriver"
                      >
                        Sleeper Capacity <sup>*</sup>
                      </label>
                      <input
                        tabIndex="6"
                        required
                        min="0"
                        disabled={isLoading}
                        onChange={onChangeHandler}
                        value={payLoad.sleeperCapacityExcludingDriver}
                        className="form__input w-100"
                        type="number"
                        id="sleeperCapacityExcludingDriver"
                        name="sleeperCapacityExcludingDriver"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="row">
                  {/* <!-- gross vehicle weight --> */}
                  <div className="col-sm-6">
                    <div className="form__control">
                      <label
                        className="form__label d-block w-100 text-left"
                        htmlFor="grossVehicleWeight"
                      >
                        Gross Vehicle Wt.(in kg)<sup>*</sup>
                      </label>
                      <input
                        required
                        tabIndex="5"
                        min="0"
                        disabled={isLoading}
                        onChange={onChangeHandler}
                        className="form__input w-100"
                        type="number"
                        value={payLoad.grossVehicleWeight}
                        id="grossVehicleWeight"
                        name="grossVehicleWeight"
                      />
                    </div>
                  </div>
                  {/* <!-- un laden weight --> */}
                  <div className="col-sm-6">
                    <div className="form__control">
                      <label
                        className="form__label d-block w-100 text-left"
                        htmlFor="unladenWeight"
                      >
                        Unladen Wt.(in kg)<sup>*</sup>
                      </label>
                      <input
                        required
                        tabIndex="5"
                        min="0"
                        disabled={isLoading}
                        onChange={onChangeHandler}
                        className="form__input w-100"
                        type="number"
                        value={payLoad.unladenWeight}
                        id="unladenWeight"
                        name="unladenWeight"
                      />
                    </div>
                  </div>
                </div>
              )}
              <div className="row">
                <div className="col-sm-6">
                  {/* <!-- Insurance Validity --> */}
                  <div className="form__control">
                    <label
                      className="form__label d-block w-100 text-left"
                      htmlFor="insuranceValidity"
                    >
                      Insurance Validity<sup>*</sup>
                    </label>
                    <input
                      required
                      tabIndex="15"
                      disabled={isLoading}
                      className="form__input w-100"
                      type="datetime-local"
                      id="insuranceValidity"
                      name="insuranceValidity"
                      onChange={onChangeHandler}
                      value={payLoad.insuranceValidity}
                    />
                  </div>
                </div>
                {/* <!-- Road Tax Validity --> */}
                <div className="col-sm-6">
                  <div className="form__control">
                    <label
                      className="form__label d-block w-100 text-left"
                      htmlFor="roadTaxValidity"
                    >
                      Road Tax Validity<sup>*</sup>
                    </label>
                    <input
                      required
                      tabIndex="16"
                      disabled={isLoading}
                      className="form__input w-100"
                      id="roadTaxValidity"
                      name="roadTaxValidity"
                      type="datetime-local"
                      value={payLoad.roadTaxValidity}
                      onChange={onChangeHandler}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                {/* <!-- Fitness Validity --> */}
                <div className="col-sm-6">
                  <div className="form__control">
                    <label
                      className="form__label d-block w-100 text-left"
                      htmlFor="fitnessValidity"
                    >
                      Road Tax Validity<sup>*</sup>
                    </label>
                    <input
                      required
                      tabIndex="16"
                      disabled={isLoading}
                      className="form__input w-100"
                      id="fitnessValidity"
                      name="fitnessValidity"
                      type="datetime-local"
                      value={payLoad.fitnessValidity}
                      onChange={onChangeHandler}
                    />
                  </div>
                </div>
                {/* <!-- Tax mode --> */}
                <div className="col-sm-6">
                  <div className="form__control">
                    <label
                      className="form__label d-block w-100 text-left"
                      htmlFor="taxMode"
                    >
                      Tax Mode<sup>*</sup>
                    </label>
                    <select
                      tabIndex="7"
                      required
                      disabled={isLoading}
                      onChange={onChangeHandler}
                      value={payLoad.taxMode}
                      name="taxMode"
                      id="taxMode"
                    >
                      <option value="">--Select Tax Mode--</option>
                      {fields?.Kerala?.taxMode.map((type) => {
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
              {/* <!-- Tax From Date --> */}
              <div className="form__control">
                <label
                  className="form__label d-block w-100 text-left"
                  htmlFor="taxFromDate"
                >
                  Tax From Date<sup>*</sup>
                </label>
                <input
                  required
                  tabIndex="15"
                  disabled={isLoading}
                  className="form__input w-100"
                  type="datetime-local"
                  id="taxFromDate"
                  name="taxFromDate"
                  onChange={onChangeHandler}
                  value={payLoad.taxFromDate}
                />
              </div>
            </div>
            {/* =========================== right side fields ============================ */}
            <div className="col-6">
              <div className="form__control text-left">
                <label className="form__label d-block w-100 text-left">
                  &nbsp;
                </label>
                {isLoading && <Loader className="loader__get-details" />}
                {!isLoading && (
                  <button
                    disabled={isLoading}
                    type="button"
                    onClick={getDetailsHandler}
                    className="box__button get-details"
                  >
                    <span className="glyphicon glyphicon-arrow-down mr-3"></span>
                    Get Details
                  </button>
                )}
              </div>
              {/* <!-- owner name --> */}
              <div className="form__control">
                <label
                  className="form__label d-block w-100 text-left"
                  htmlFor="ownerName"
                >
                  Owner Name<sup>*</sup>
                </label>
                <input
                  required
                  tabIndex="9"
                  disabled={isLoading}
                  className="form__input w-100"
                  type="text"
                  id="ownerName"
                  inputMode="text"
                  name="ownerName"
                  onChange={onChangeHandler}
                  value={payLoad.ownerName}
                />
              </div>

              <div className="row">
                {/* <!-- from state --> */}
                <div className="col-sm-6">
                  <div className="form__control">
                    <label
                      className="form__label d-block w-100 text-left"
                      htmlFor="fromState"
                    >
                      From State<sup>*</sup>
                    </label>
                    <select
                      tabIndex="10"
                      disabled={isLoading}
                      required
                      value={payLoad.fromState}
                      onChange={onChangeHandler}
                      name="fromState"
                      id="fromState"
                    >
                      <option value="">--Select State--</option>
                      {fields.fromState.map((type) => {
                        return (
                          <option key={type.name} value={type.name}>
                            {type.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
                {/* <!-- Issuing Authority --> */}
                <div className="col-sm-6">
                  <div className="form__control">
                    <label
                      className="form__label d-block w-100 text-left"
                      htmlFor="fromState"
                    >
                      Issuing Authority<sup>*</sup>
                    </label>
                    <select
                      tabIndex="10"
                      disabled={isLoading}
                      required
                      value={payLoad.fromState}
                      onChange={onChangeHandler}
                      name="fromState"
                      id="fromState"
                    >
                      <option value="">--Select Issuing Authority--</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="row">
                {/* <!-- Vehicle Category --> */}
                <div className="col-sm-6">
                  <div className="form__control">
                    <label
                      className="form__label d-block w-100 text-left"
                      htmlFor="vehicleCategory"
                    >
                      Vehicle Category<sup>*</sup>
                    </label>
                    <select
                      tabIndex="10"
                      disabled={isLoading}
                      required
                      value={payLoad.vehicleCategory}
                      onChange={onChangeHandler}
                      name="vehicleCategory"
                      id="vehicleCategory"
                    >
                      <option value="">--Select Vehicle Category--</option>
                    </select>
                  </div>
                </div>
                {/* <!-- DL Number --> */}
                <div className="col-sm-6">
                  <div className="form__control">
                    <label
                      className="form__label d-block w-100 text-left"
                      htmlFor="dlNumber"
                    >
                      DL Number<sup>*</sup>
                    </label>
                    <input
                      required
                      tabIndex="5"
                     
                      disabled={isLoading}
                      onChange={onChangeHandler}
                      className="form__input w-100"
                      type="text"
                      value={payLoad.dlNumber}
                      id="dlNumber"
                      name="dlNumber"
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                {/* <!-- Service Type --> */}
                <div className="col-sm-6">
                  <div className="form__control">
                    <label
                      className="form__label d-block w-100 text-left"
                      htmlFor="serviceType"
                    >
                      Service type<sup>*</sup>
                    </label>
                    <select
                      required
                      tabIndex="11"
                      disabled={isLoading}
                      name="serviceType"
                      id="serviceType"
                      value={payLoad.serviceType}
                      onChange={onChangeHandler}
                    >
                      <option value="">--Select Service Type--</option>
                      {fields.kerala.serviceType.map((type) => {
                        return (
                          <option value={type.name} key={type.name}>
                            {type.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
                {/* <!-- permit type --> */}
                <div className="col-sm-6">
                  <div className="form__control">
                    <label
                      className="form__label d-block w-100 text-left"
                      htmlFor="permitType"
                    >
                      Permit Type<sup>*</sup>
                    </label>
                    <select
                      required
                      tabIndex="12"
                      disabled={isLoading}
                      value={payLoad.permitType}
                      onChange={onChangeHandler}
                      name="permitType"
                      id="permitType"
                    >
                      <option value="">--Select Permit Type--</option>
                      {fields.kerala.permitType.map((type) => {
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

              <div className="row">
                {/* <!-- Source --> */}
                <div className="col-sm-6">
                  <div className="form__control">
                    <label
                      className="form__label d-block w-100 text-left"
                      htmlFor="source"
                    >
                      Source<sup>*</sup>
                    </label>
                    <input
                      required
                      inputMode="text"
                      disabled={isLoading}
                      onChange={onChangeHandler}
                      value={payLoad.source}
                      className="form__input w-100"
                      type="text"
                      id="source"
                      name="source"
                    />
                  </div>
                </div>
                {/* <!-- Destination --> */}
                <div className="col-sm-6">
                  <div className="form__control">
                    <label
                      className="form__label d-block w-100 text-left"
                      htmlFor="destination"
                    >
                      Destination<sup>*</sup>
                    </label>
                    <input
                      required
                      inputMode="text"
                      disabled={isLoading}
                      onChange={onChangeHandler}
                      value={payLoad.destination}
                      className="form__input w-100"
                      type="text"
                      id="destination"
                      name="destination"
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-sm-6">
                  {/* <!-- Permit validity --> */}
                  <div className="form__control">
                    <label
                      className="form__label d-block w-100 text-left"
                      htmlFor="permitValidity"
                    >
                      Permit validity<sup>*</sup>
                    </label>
                    <input
                      required
                      tabIndex="15"
                      disabled={isLoading}
                      className="form__input w-100"
                      type="datetime-local"
                      id="permitValidity"
                      name="permitValidity"
                      onChange={onChangeHandler}
                      value={payLoad.permitValidity}
                    />
                  </div>
                </div>
                {/* <!-- Permit Authorization Date --> */}
                <div className="col-sm-6">
                  <div className="form__control">
                    <label
                      className="form__label d-block w-100 text-left"
                      htmlFor="permitAuthorizationDate"
                    >
                      Permit Authorization Date<sup>*</sup>
                    </label>
                    <input
                      required
                      tabIndex="16"
                      disabled={isLoading}
                      className="form__input w-100"
                      id="permitAuthorizationDate"
                      name="permitAuthorizationDate"
                      type="datetime-local"
                      value={payLoad.permitAuthorizationDate}
                      onChange={onChangeHandler}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6">
                  {/* <!-- Purpose of Journey --> */}
                  <div className="form__control">
                    <label
                      className="form__label d-block w-100 text-left"
                      htmlFor="purposeOfJourney"
                    >
                      Purpose of Journey<sup>*</sup>
                    </label>
                    <select
                      tabIndex="13"
                      required
                      disabled={isLoading}
                      value={payLoad.borderBarrier}
                      onChange={onChangeHandler}
                      name="purposeOfJourney"
                      id="purposeOfJourney"
                    >
                      <option value="">--Purpose of Journey--</option>
                      {fields.kerala.purposeOfJourney.map((dist) => {
                        return (
                          <option key={dist.name} value={dist.name}>
                            {dist.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
                {/* <!-- Entering District --> */}
                <div className="col-sm-6">
                  <div className="form__control">
                    <label
                      className="form__label d-block w-100 text-left"
                      htmlFor="enteringDistrict"
                    >
                      Entering District<sup>*</sup>
                    </label>
                    <select
                      tabIndex="13"
                      required
                      disabled={isLoading}
                      value={payLoad.enteringDistrict}
                      onChange={onChangeHandler}
                      name="enteringDistrict"
                      id="enteringDistrict"
                    >
                      <option value="">--Select Entering District--</option>
                      {fields.kerala.enteringDistrict.map((dist) => {
                        return (
                          <option key={dist.name} value={dist.name}>
                            {dist.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              </div>

              {/* <!-- Tax upto Date --> */}
              <div className="form__control">
                <label
                  className="form__label d-block w-100 text-left"
                  htmlFor="taxUptoDate"
                >
                  Tax Upto Date<sup>*</sup>
                </label>
                <input
                  required
                  tabIndex="16"
                  disabled={isLoading}
                  className="form__input w-100"
                  id="taxUptoDate"
                  name="taxUptoDate"
                  type="datetime-local"
                  value={payLoad.taxUptoDate}
                  onChange={onChangeHandler}
                />
              </div>
            </div>
          </div>
          {/* =============== table ======================== */}
          <div className="row mt-3">
            <div className="col-12">
              <table className="hr-table">
                <thead>
                  <tr>
                    <th className="hr-table-1">SI. No.</th>
                    <th className="hr-table-2">Particulars</th>
                    <th>Tax From</th>
                    <th>Tax Upto</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="">1</td>
                    <td className="pb-table-text">MV Tax</td>
                    <td className=""></td>
                    <td className=""></td>
                    <td className="input-box">
                      <center>
                        <input
                          tabIndex="17"
                          required
                          disabled={isLoading}
                          value={payLoad.mvTax}
                          onChange={onChangeHandler}
                          name="mvTax"
                          type="number"
                          min="0"
                          inputMode="numeric"
                        />
                      </center>
                    </td>
                  </tr>
                  <tr>
                    <td className="">2</td>
                    <td className="pb-table-text">Cess</td>
                    <td className=""></td>
                    <td className=""></td>
                    <td className="input-box">
                      <center>
                        <input
                          tabIndex="17"
                          required
                          disabled={isLoading}
                          value={payLoad.cess}
                          onChange={onChangeHandler}
                          name="cess"
                          type="number"
                          min="0"
                          inputMode="numeric"
                        />
                      </center>
                    </td>
                  </tr>
                  <tr>
                    <td className="">3</td>
                    <td className="pb-table-text">Infra Cess</td>
                    <td className=""></td>
                    <td className=""></td>
                    <td className="input-box">
                      <center>
                        <input
                          tabIndex="17"
                          required
                          disabled={isLoading}
                          value={payLoad.infraCess}
                          onChange={onChangeHandler}
                          name="infraCess"
                          type="number"
                          min="0"
                          inputMode="numeric"
                        />
                      </center>
                    </td>
                  </tr>

                  {(payLoad.vehiclePermitType ===
                    "CONSTRUCTION EQUIPMENT VEHICLE" &&
                    payLoad.permitType === "NOT APPLICABLE") ||
                  (payLoad.vehiclePermitType ===
                    "CONTRACT CARRIAGE/PASSANGER VEHICLES" &&
                    payLoad.permitType === "TOURIST PERMIT") ||
                  (payLoad.vehiclePermitType === "GOODS VEHICLE" &&
                    payLoad.permitType === "NATIONAL PERMIT") ? (
                    <></>
                  ) : (
                    <>
                      <tr>
                        <td className="">4</td>
                        <td className="pb-table-text">Permit Fee</td>
                        <td className=""></td>
                        <td className=""></td>
                        <td className="input-box">
                          <center>
                            <input
                              tabIndex="17"
                              required
                              disabled={isLoading}
                              value={payLoad.permitFee}
                              onChange={onChangeHandler}
                              name="permitFee"
                              type="number"
                              min="0"
                              inputMode="numeric"
                            />
                          </center>
                        </td>
                      </tr>
                      <tr>
                        <td className="">5</td>
                        <td className="pb-table-text">
                          Permit Endoresment/Variation
                        </td>
                        <td className=""></td>
                        <td className=""></td>
                        <td className="input-box">
                          <center>
                            <input
                              tabIndex="17"
                              required
                              disabled={isLoading}
                              value={payLoad.permitEndoresment}
                              onChange={onChangeHandler}
                              name="permitEndoresment"
                              type="number"
                              min="0"
                              inputMode="numeric"
                            />
                          </center>
                        </td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-sm-6">
              {/* <!-- Total amount --> */}
              <div className="form__control">
                <label
                  className="form__label d-block w-100 text-left"
                  htmlFor="totalAmount"
                >
                  Total amount<sup>*</sup>
                </label>
                <input
                  required
                  tabIndex="18"
                  min="0"
                  disabled
                  value={
                    (payLoad.vehiclePermitType ===
                      "CONSTRUCTION EQUIPMENT VEHICLE" &&
                      payLoad.permitType === "NOT APPLICABLE") ||
                    (payLoad.vehiclePermitType ===
                      "CONTRACT CARRIAGE/PASSANGER VEHICLES" &&
                      payLoad.permitType === "TOURIST PERMIT") ||
                    (payLoad.vehiclePermitType === "GOODS VEHICLE" &&
                      payLoad.permitType === "NATIONAL PERMIT")
                      ? +payLoad.mvTax + +payLoad.cess + +payLoad.infraCess
                      : +payLoad.mvTax +
                        +payLoad.cess +
                        +payLoad.infraCess +
                        +payLoad.permitFee +
                        +payLoad.permitEndoresment
                  }
                  className="form__input w-100"
                  type="number"
                  id="totalAmount"
                  name="totalAmount"
                />
              </div>
            </div>
            <div className="col-sm-6">
              <label className="form__label d-block w-100 text-left">
                &nbsp;
              </label>
              <ActionButtons
                tabIndex="19"
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

export default Kerala;
