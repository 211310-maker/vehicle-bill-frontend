import React, { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import ActionButtons from "../components/ActionButtons";
import Header from "../components/Header";
import Loader from "../components/Loader";
import { fields, LOCAL_STORAGE_KEY } from "../constants";
import { getDetailsApi } from "../utils/api";

// safe helper to avoid calling .map on undefined
const safe = (v) => (Array.isArray(v) ? v : []);

const Kerala = () => {
  const isLoggedIn = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));

  const state = "kerala";
  const history = useHistory();

  // all input fields
  const [payLoad, setPayLoad] = useState({
    vehicleNo: "",
    surChargeFee: "",
    userCharge: "",
    chassisNo: "",
    mobileNo: "",
    vehiclePermitType: "",
    seatingCapacityExcludingDriver: "",
    sleeperCap: "",
    borderBarrier: "",
    districtName: "",
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
    checkpostName: "",
    registrationType: "",
    puccValidity: "",
    permitAuthorizationValidity: "",
    permit: "",
    pushbackSeats: "",
    tipperBody: "",
    permitNo: "",
    saleAmount: "",
    permitValidity: "",
    ordinarySeats: "",
    issuingAuthority: "",
    goodsName: "",
    fuelType: "",
    vehicleCategory: "",
    greenTaxValidity: "",
    cessPaidDate: "",
    regnDate: "",
    cubicCap: "",
    permitCategory: "",
    driverName: "",
    dlNumber: "",
    dlValidUptoDate: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const form = useRef(null);

  const keralaFields = (fields && fields.kerala) ? fields.kerala : {};
  const kerala = {
    districtName: keralaFields.districtName || [],
    checkPostName: keralaFields.checkPostName || [],
    vehiclePermitType: keralaFields.vehiclePermitType || [],
    vehicleClass: keralaFields.vehicleClass || [],
    goodsName: keralaFields.goodsName || [],
    permitType: keralaFields.permitType || [],
    permitCategory: keralaFields.permitCategory || [],
    registrationType: keralaFields.registrationType || [],
    vehicleCategory: keralaFields.vehicleCategory || [],
    tipperBody: keralaFields.tipperBody || [],
    permit: keralaFields.permit || [],
    serviceType: keralaFields.serviceType || [],
    taxMode: keralaFields.taxMode || [],
    fuelType: keralaFields.fuelType || [],
    enteringDistrict: keralaFields.enteringDistrict || [],
    purposeOfJourney: keralaFields.purposeOfJourney || [],
  };

  console.debug('fields.kerala', fields?.kerala);


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
      payLoad.vehiclePermitType === "GOODS VEHICLE" &&
      payLoad.vehicleCategory === 'HEAVY Goods vehicle'
    ) {
      payLoad.totalAmount = +payLoad.mvTax + +payLoad.userCharge + +payLoad.permitFee + +payLoad.cess + +payLoad.surChargeFee
    } else if (
      (payLoad.vehiclePermitType ===
        'CONTRACT CARRIAGE/PASSANGER VEHICLES' &&
        payLoad.vehicleClass === 'MAXI CAB') ||
      (payLoad.vehiclePermitType === "GOODS VEHICLE" &&
        payLoad.vehicleCategory === 'MEDIUM Goods vehicle')) {
      payLoad.totalAmount = +payLoad.mvTax + +payLoad.userCharge + +payLoad.permitFee
    } else if (payLoad.vehiclePermitType ===
      'CONTRACT CARRIAGE/PASSANGER VEHICLES' &&
      payLoad.vehicleClass === "MOTOR CAB") {
      payLoad.totalAmount = +payLoad.mvTax + +payLoad.userCharge + +payLoad.permitFee + +payLoad.cess
    } else {
      payLoad.totalAmount = +payLoad.mvTax + +payLoad.cess
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

  if (!isLoggedIn || !Array.isArray(isLoggedIn.accessState) || !isLoggedIn.accessState.includes(fields?.stateName?.kerala || "kerala")) {
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
                      placeholder=""
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
                      {safe(fields?.kerala?.districtName).map((dist) => {
                        return (
                          <option key={dist.name} value={dist.name}>
                            {dist.name}
                          </option>
                        );
                      })}
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
                      {safe(fields?.kerala?.checkPostName)
                        .filter(
                          (e) => (e.district || "").toLowerCase() === (payLoad.districtName || "").toLowerCase()
                        )
                        .map((checkpost) => {
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
                      {safe(fields?.kerala?.vehiclePermitType).map((type) => {
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
                      {safe(fields?.kerala?.vehicleClass)
                        .filter(
                          (e) => (e.category || "").toLowerCase() === (payLoad.vehiclePermitType || "").toLowerCase()
                        )
                        .map((type) => {
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
                          Seating Capacity(Including Driver)<sup>*</sup>
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
                          htmlFor="sleeperCap"
                      >
                        Sleeper Capacity <sup>*</sup>
                      </label>
                      <input
                        tabIndex="6"
                        required
                        min="0"
                        disabled={isLoading}
                        onChange={onChangeHandler}
                          value={payLoad.sleeperCap}
                        className="form__input w-100"
                        type="number"
                          id="sleeperCap"
                          name="sleeperCap"
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
                  {/* <!-- Name Of Goods --> */}
                  <div className="form__control">
                    <label
                      className="form__label d-block w-100 text-left"
                      htmlFor="goodsName"
                    >
                      Name of Goods<sup>*</sup>
                    </label>
                    <select
                      required
                      tabIndex="12"
                      disabled={isLoading}
                      value={payLoad.goodsName}
                      onChange={onChangeHandler}
                      name="goodsName"
                      id="goodsName"
                    >
                      <option value="">--Select Name of Goods--</option>
                      {safe(fields?.kerala?.goodsName).map((type) => {
                        return (
                          <option value={type.name} key={type.name}>
                            {type.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
                {/* <!-- Road Tax Validity --> */}
                <div className="col-sm-6">
                  <div className="form__control">
                    <label
                      className="form__label d-block w-100 text-left"
                      htmlFor="ordinarySeats"
                    >
                      Ordinary seats
                    </label>
                    <input
                      required
                      tabIndex="16"
                      disabled={isLoading}
                      className="form__input w-100"
                      id="ordinarySeats"
                      name="ordinarySeats"
                      type="number"
                      value={payLoad.ordinarySeats}
                      onChange={onChangeHandler}
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-sm-6">
                  {/* <!-- Permit Category --> */}
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
                      {safe(fields?.kerala?.permitType)
                        .filter(
                          (e) => (e.category || "").toLowerCase() === (payLoad.vehiclePermitType || "").toLowerCase()
                        )
                        .map((type) => {
                          return (
                            <option value={type.name} key={type.name}>
                              {type.name}
                            </option>
                          );
                        })}
                    </select>
                  </div>
                </div>
                {/* <!-- Road Tax Validity --> */}
                <div className="col-sm-6">
                  <div className="form__control">
                    <label
                      className="form__label d-block w-100 text-left"
                      htmlFor="permitCategory"
                    >
                      Permit Category<sup>*</sup>
                    </label>
                    <select
                      required
                      tabIndex="12"
                      disabled={isLoading}
                      value={payLoad.permitCategory}
                      onChange={onChangeHandler}
                      name="permitCategory"
                      id="permitCategory"
                    >
                      <option value="">--Select Permit Category--</option>
                      {safe(fields?.kerala?.permitCategory)
                        .filter(
                          (e) => (e.category || "").toLowerCase() === (payLoad.vehiclePermitType || "").toLowerCase()
                        )
                        .map((type) => {
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
                <div className="col-sm-6">
                  {/* <!-- Floor Area--> */}
                  <div className="form__control">
                    <label
                      className="form__label d-block w-100 text-left"
                      htmlFor="floorArea"
                    >
                      Floor Area(In Meter)
                    </label>
                    <input
                      required
                      tabIndex="15"
                      disabled={isLoading}
                      className="form__input w-100"
                      type="number"
                      id="floorArea"
                      name="floorArea"
                      onChange={onChangeHandler}
                      value={payLoad.floorArea}
                    />
                  </div>
                </div>
                {/* <!-- Cubic Cap --> */}
                <div className="col-sm-6">
                  <div className="form__control">
                    <label
                      className="form__label d-block w-100 text-left"
                      htmlFor="cubicCap"
                    >
                      Cubic Cap(CC)
                    </label>
                    <input
                      required
                      tabIndex="16"
                      disabled={isLoading}
                      className="form__input w-100"
                      id="cubicCap"
                      name="cubicCap"
                      type="number"
                      value={payLoad.cubicCap}
                      onChange={onChangeHandler}
                    />
                  </div>
                </div>
              </div>

              <div className="form__control">
                {/* Registration Type */}
                <label
                  className="form__label d-block w-100 text-left"
                  htmlFor="registrationType"
                >
                  Registration Type<sup>*</sup>
                </label>
                <select
                  required
                  tabIndex="12"
                  disabled={isLoading}
                  value={payLoad.registrationType}
                  onChange={onChangeHandler}
                  name="registrationType"
                  id="registrationType"
                >
                  <option value="">--Select Permit Category--</option>
                  {safe(fields?.kerala?.registrationType).map((type) => {
                    return (
                      <option value={type.name} key={type.name}>
                        {type.name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="row">
                <div className="col-sm-6">
                  {/* <!-- Permit validity --> */}
                  <div className="form__control">
                    <label
                      className="form__label d-block w-100 text-left"
                      htmlFor="permitValidity"
                    >
                      Basic Permit validity<sup>*</sup>
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

                {/* <!-- Fitness valid --> */}
                <div className="col-sm-6">
                  <div className="form__control">
                    <label
                      className="form__label d-block w-100 text-left"
                      htmlFor="fitnessValidity"
                    >
                      Fitness Validity<sup>*</sup>
                    </label>
                    <input
                      required
                      tabIndex="16"
                      disabled={isLoading}
                      className="form__input w-100"
                      id="fitnessValidity"
                      name="fitnessValidity"
                      type="date"
                      value={payLoad.fitnessValidity}
                      onChange={onChangeHandler}
                    />
                  </div>
                </div>

                {/* <!-- Pucc valid --> */}
                <div className="col-sm-6">
                  <div className="form__control">
                    <label
                      className="form__label d-block w-100 text-left"
                      htmlFor="puccValidUpto"
                    >
                      PUCC Valid up to<sup>*</sup>
                    </label>
                    <input
                      required
                      tabIndex="16"
                      disabled={isLoading}
                      className="form__input w-100"
                      id="puccValidity"
                      name="puccValidity"
                      type="date"
                      value={payLoad.puccValidity}
                      onChange={onChangeHandler}
                    />
                  </div>
                </div>
                {/* <!-- Permit Authorization Date --> */}
                <div className="col-sm-6">
                  <div className="form__control">
                    <label
                      className="form__label d-block w-100 text-left"
                      htmlFor="permitAuthorizationValidity"
                    >
                      Authorization Valid up to<sup>*</sup>
                    </label>
                    <input
                      required
                      tabIndex="16"
                      disabled={isLoading}
                      className="form__input w-100"
                      id="permitAuthorizationValidity"
                      name="permitAuthorizationValidity"
                      type="datetime-local"
                      value={payLoad.permitAuthorizationValidity}
                      onChange={onChangeHandler}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                {/* <!-- Registration Date --> */}
                <div className="col-sm-6">
                  <div className="form__control">
                    <label
                      className="form__label d-block w-100 text-left"
                      htmlFor="regnDate"
                    >
                      Registration Date<sup>*</sup>
                    </label>
                    <input
                      required
                      tabIndex="16"
                      disabled={isLoading}
                      className="form__input w-100"
                      id="regnDate"
                      name="regnDate"
                      type="date"
                      value={payLoad.regnDate}
                      onChange={onChangeHandler}
                    />
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form__control">
                    <label
                      className="form__label d-block w-100 text-left"
                      htmlFor="fuelType"
                    >
                      Fuel<sup>*</sup>
                    </label>
                    <select
                      tabIndex="7"
                      required
                      disabled={isLoading}
                      onChange={onChangeHandler}
                      value={payLoad.fuelType}
                      name="fuelType"
                      id="fuelType"
                    >
                  <option value="">--Select Fuel--</option>
                  {safe(fields?.kerala?.fuelType).map((type) => {
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

              {/* <!-- Tax mode --> */}
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
                  {safe(fields?.kerala?.taxMode).map((type) => {
                    return (
                      <option value={type.name} key={type.name}>
                        {type.name}
                      </option>
                    );
                  })}
                </select>
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
                      {safe(fields?.fromState).map((type) => {
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
                      htmlFor="issuingAuthority"
                    >
                      Issuing Authority<sup>*</sup>
                    </label>
                    <input
                      tabIndex="15"
                      disabled={isLoading}
                      className="form__input w-100"
                      type="text"
                      id="issuingAuthority"
                      name="issuingAuthority"
                      onChange={onChangeHandler}
                      value={payLoad.issuingAuthority}
                    />
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
                      {safe(fields?.kerala?.vehicleCategory)
                        .filter(
                          (e) => (e.category || "").toLowerCase() === (payLoad.vehiclePermitType || "").toLowerCase()
                        )
                        .map((type) => {
                          return (
                            <option key={type.name} value={type.name}>
                              {type.name}
                            </option>
                          );
                        })}
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
                {/* <!-- Driver Details--> */}
                <div className="col-sm-6">
                  <div className="form__control">
                    <label
                      className="form__label d-block w-100 text-left"
                      htmlFor="driverName"
                    >
                      Driver Name<sup>*</sup>
                    </label>
                    <input
                      required
                      tabIndex="5"
                      disabled={isLoading}
                      onChange={onChangeHandler}
                      className="form__input w-100"
                      type="text"
                      value={payLoad.driverName}
                      id="driverName"
                      name="driverName"
                    />
                  </div>
                </div>
                {/* <!--   DL Valid Upto --> */}
                <div className="col-sm-6">
                  <div className="form__control">
                    <label
                      className="form__label d-block w-100 text-left"
                      htmlFor="dlValidUptoDate"
                    >
                      DL Valid Upto<sup>*</sup>
                    </label>
                    <input
                      required
                      tabIndex="15"
                      disabled={isLoading}
                      className="form__input w-100"
                      type="date"
                      id="dlValidUptoDate"
                      name="dlValidUptoDate"
                      onChange={onChangeHandler}
                      value={payLoad.dlValidUptoDate}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                {/* <!-- Pushback Seats --> */}
                <div className="col-sm-6">
                  <div className="form__control">
                    <label
                      className="form__label d-block w-100 text-left"
                      htmlFor="pushbackSeats"
                    >
                      Pushback seats
                    </label>
                    <input
                      tabIndex="15"
                      disabled={isLoading}
                      className="form__input w-100"
                      type="number"
                      id="pushbackSeats"
                      name="pushbackSeats"
                      onChange={onChangeHandler}
                      value={payLoad.pushbackSeats}
                    />
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form__control">
                    <label
                      className="form__label d-block w-100 text-left"
                      htmlFor="tipperBody"
                    >
                      Tipper Body<sup>*</sup>
                    </label>
                    <select
                      required
                      tabIndex="11"
                      disabled={isLoading}
                      name="tipperBody"
                      id="tipperBody"
                      value={payLoad.tipperBody}
                      onChange={onChangeHandler}
                    >
                      <option value="">--Select Tipper Body--</option>
                      {safe(fields?.kerala?.tipperBody).map((type) => {
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
                {/* Permit and Base permit no */}
                <div className="col-sm-6">
                  <div className="form__control">
                    <label
                      className="form__label d-block w-100 text-left"
                      htmlFor="permit"
                    >
                      Permit<sup>*</sup>
                    </label>
                    <select
                      required
                      tabIndex="11"
                      disabled={isLoading}
                      name="permit"
                      id="permit"
                      value={payLoad.permit}
                      onChange={onChangeHandler}
                    >
                      <option value="">--Select Permit--</option>
                      {safe(fields?.kerala?.permit)
                        .filter(
                          (e) => (e.category || "").toLowerCase() === (payLoad.vehiclePermitType || "").toLowerCase()
                        )
                        .map((type) => {
                          return (
                            <option value={type.name} key={type.name}>
                              {type.name}
                            </option>
                          );
                        })}
                    </select>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form__control">
                    <label
                      className="form__label d-block w-100 text-left"
                      htmlFor="permitNo"
                    >
                      Base Permit No
                    </label>
                    <input
                      tabIndex="15"
                      disabled={isLoading}
                      className="form__input w-100"
                      type="text"
                      id="permitNo"
                      name="permitNo"
                      onChange={onChangeHandler}
                      value={payLoad.permitNo}
                    />
                  </div>
                </div>
              </div>

              <div className="form__control">
                <label
                  className="form__label d-block w-100 text-left"
                  htmlFor="routeOfTheJourney"
                >
                  Route
                </label>
                <input
                  inputMode="text"
                  disabled={isLoading}
                  onChange={onChangeHandler}
                  value={payLoad.routeOfTheJourney}
                  className="form__input w-100"
                  type="text"
                  id="routeOfTheJourney"
                  name="routeOfTheJourney"
                />

              </div>
              <div className="row">
                <div className="col-sm-6">
                  {/* <!-- Purpose of Journey --> */}
                  <div className="form__control">
                    <label
                      className="form__label d-block w-100 text-left"
                      htmlFor="serviceType"
                    >
                      Service Type<sup>*</sup>
                    </label>
                    <select
                      tabIndex="13"
                      required
                      disabled={isLoading}
                      value={payLoad.serviceType}
                      onChange={onChangeHandler}
                      name="serviceType"
                      id="serviceType"
                    >
                      <option value="">--Service Type--</option>
                      {safe(fields?.kerala?.serviceType).map((dist) => {
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
                      htmlFor="saleAmount"
                    >
                      Sale Amount
                    </label>
                    <input
                      tabIndex="15"
                      disabled={isLoading}
                      className="form__input w-100"
                      type="number"
                      id="saleAmount"
                      name="saleAmount"
                      onChange={onChangeHandler}
                      value={payLoad.saleAmount}
                    />
                  </div>
                </div>
              </div>
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
                      htmlFor="taxValidity"
                    >
                      Tax Validity<sup>*</sup>
                    </label>
                    <input
                      required
                      tabIndex="16"
                      disabled={isLoading}
                      className="form__input w-100"
                      id="taxValidity"
                      name="taxValidity"
                      type="datetime-local"
                      value={payLoad.taxValidity}
                      onChange={onChangeHandler}
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-sm-6">
                  {/* <!-- Green Tax Paid --> */}
                  <div className="form__control">
                    <label
                      className="form__label d-block w-100 text-left"
                      htmlFor="greenTaxValidity"
                    >
                      Green Tax Paid upto Date<sup>*</sup>
                    </label>
                    <input
                      required
                      tabIndex="15"
                      disabled={isLoading}
                      className="form__input w-100"
                      type="datetime-local"
                      id="greenTaxValidity"
                      name="greenTaxValidity"
                      onChange={onChangeHandler}
                      value={payLoad.greenTaxValidity}
                    />
                  </div>
                </div>
                {/* <!-- Cess Paid Date --> */}
                <div className="col-sm-6">
                  <div className="form__control">
                    <label
                      className="form__label d-block w-100 text-left"
                      htmlFor="cessPaidDate"
                    >
                      Cess Paid Date<sup>*</sup>
                    </label>
                    <input
                      required
                      tabIndex="16"
                      disabled={isLoading}
                      className="form__input w-100"
                      id="cessPaidDate"
                      name="cessPaidDate"
                      type="datetime-local"
                      value={payLoad.cessPaidDate}
                      onChange={onChangeHandler}
                    />
                  </div>
                </div>
              </div>

              {/* <!-- Tax From Date --> */}
              {/* <!-- Tax upto Date --> */}
              <div className="row">
                <div className="col-sm-6">
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
                <div className="col-sm-6">
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

                  {((payLoad.vehiclePermitType ===
                    'CONTRACT CARRIAGE/PASSANGER VEHICLES' &&
                    payLoad.vehicleClass !== 'MAXI CAB') ||
                    (payLoad.vehiclePermitType === "GOODS VEHICLE" &&
                      payLoad.vehicleCategory !== 'MEDIUM Goods vehicle')) && (
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
                    )}

                  {/* Five Line Case Only */}
                  {(payLoad.vehiclePermitType === "GOODS VEHICLE" &&
                    payLoad.vehicleCategory === 'HEAVY Goods vehicle') && (
                    <tr>
                      <td className="">3</td>
                      <td className="pb-table-text">Green Tax</td>
                      <td className=""></td>
                      <td className=""></td>
                      <td className="input-box">
                        <center>
                          <input
                            tabIndex="17"
                            required
                            disabled={isLoading}
                            value={payLoad.surChargeFee}
                            onChange={onChangeHandler}
                            name="surChargeFee"
                            type="number"
                            min="0"
                            inputMode="numeric"
                          />
                        </center>
                      </td>
                    </tr>
                    )}

                  {((payLoad.vehiclePermitType ===
                    'CONTRACT CARRIAGE/PASSANGER VEHICLES' &&
                    payLoad.vehicleClass === "MOTOR CAB") ||
                    (payLoad.vehiclePermitType ===
                    'CONTRACT CARRIAGE/PASSANGER VEHICLES' &&
                      payLoad.vehicleClass === 'MAXI CAB') ||
                    (payLoad.vehiclePermitType === "GOODS VEHICLE" &&
                      payLoad.vehicleCategory === 'MEDIUM Goods vehicle') ||
                    (payLoad.vehiclePermitType === "GOODS VEHICLE" &&
                      payLoad.vehicleCategory === 'HEAVY Goods vehicle')) && (
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
                      </>
                    )}

                  {((payLoad.vehiclePermitType ===
                    'CONTRACT CARRIAGE/PASSANGER VEHICLES' &&
                    payLoad.vehicleClass === "MOTOR CAB") ||
                    (payLoad.vehiclePermitType ===
                    'CONTRACT CARRIAGE/PASSANGER VEHICLES' &&
                      payLoad.vehicleClass === 'MAXI CAB') ||
                    (payLoad.vehiclePermitType === "GOODS VEHICLE" &&
                      payLoad.vehicleCategory === 'MEDIUM Goods vehicle') ||
                    (payLoad.vehiclePermitType === "GOODS VEHICLE" &&
                      payLoad.vehicleCategory === 'HEAVY Goods vehicle')) && (
                      <tr>
                        <td className="">5</td>
                      <td className="pb-table-text">Service/User Charge</td>
                        <td className=""></td>
                        <td className=""></td>
                        <td className="input-box">
                          <center>
                            <input
                              tabIndex="17"
                              required
                              disabled={isLoading}
                            value={payLoad.userCharge}
                              onChange={onChangeHandler}
                            name="userCharge"
                              type="number"
                              min="0"
                              inputMode="numeric"
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
                      ? +payLoad.mvTax + +payLoad.userCharge + +payLoad.permitFee + +payLoad.cess + +payLoad.surChargeFee
                      : +payLoad.mvTax + +payLoad.userCharge + +payLoad.permitFee + +payLoad.cess + +payLoad.surChargeFee
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
