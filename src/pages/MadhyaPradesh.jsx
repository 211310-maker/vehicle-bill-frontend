// src/pages/MadhyaPradesh.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useHistory } from "react-router";
import ActionButtons from "../components/ActionButtons";
import Header from "../components/Header";
import Loader from "../components/Loader";
import { fields, LOCAL_STORAGE_KEY } from "../constants";
import { getDetailsApi } from "../utils/api";

const MadhyaPradesh = () => {
  const history = useHistory();
  const formRef = useRef(null);

  const stateKey = "mp";

  const isLoggedIn = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    } catch {
      return null;
    }
  }, []);

  const hasAccess = Boolean(
    isLoggedIn?.accessState?.includes(fields?.stateName?.mp)
  );

  const norm = (s) =>
    String(s || "")
      .toUpperCase()
      .replace(/\s+/g, " ")
      .trim();

  const [isLoading, setIsLoading] = useState(false);

  // ✅ Form state
  const [payLoad, setPayLoad] = useState({
    vehicleNo: "",
    chassisNo: "",
    mobileNo: "",
    ownerName: "",
    fromState: "",

    vehiclePermitType: "",
    vehicleClass: "",

    // passenger
    seatingCapacityExcludingDriver: "",
    sleeperCapacityExcludingDriver: "",
    standingCapacity: "",

    // goods
    grossVehicleWeight: "",
    unladenWeight: "",

    permitNo: "",
    permitValidity: "",
    aitpPermitValidity: "",

    permitType: "",
    serviceType: "",
    taxMode: "",
    noOfPeriods: "",

    fitnessValidity: "",
    insuranceValidity: "",
    puccValidity: "",
    roadTaxValidity: "",

    // IMPORTANT: keep these names used in your JSX labels
    districtName: "", // mapped to barrier list
    checkpostName: "",

    taxFromDate: "",
    taxUptoDate: "",

    // table values
    mvTax: "",
    userCharge: "",
    permitFee: "",
    cgst: "",
    sgst: "",

    totalAmount: "",

    // legacy compatibility
    floorArea: "",
    infraCess: "",
    cess: "",
    permitEndoresment: "",
    routeOfTheJourney: "",
    purposeOfJourney: "",
    basicPermitValidity: "",
    taxValidity: "",
  });

  // ✅ normalize permit type (fixes old PASSANGER spelling)
  const normalizedPermitType = useMemo(() => {
    const t = norm(payLoad.vehiclePermitType);
    if (t === "CONTRACT CARRIAGE/PASSANGER VEHICLES")
      return "CONTRACT CARRIAGE/PASSENGER VEHICLES";
    return t;
  }, [payLoad.vehiclePermitType]);

  const isContractPassenger =
    normalizedPermitType === "CONTRACT CARRIAGE/PASSENGER VEHICLES";
  const isGoodsVehicle = normalizedPermitType === "GOODS VEHICLE";
  const isConstructionEq =
    normalizedPermitType === "CONSTRUCTION EQUIPMENT VEHICLE";
  const isTempRegistered =
    normalizedPermitType ===
    "TEMPORARY REGISTERED VEHICLES/VEHICLE ON TRADE CERTIFICATE NUMBER";

  // ✅ Vehicle Type options
  const vehiclePermitTypeOptions = useMemo(() => {
    const fromConstants = (fields?.madhyaPradesh?.vehiclePermitType || [])
      .map((x) => x?.name)
      .filter(Boolean);

    const fallback = [
      "CONTRACT CARRIAGE/PASSENGER VEHICLES",
      "GOODS VEHICLE",
      "CONSTRUCTION EQUIPMENT VEHICLE",
      "TEMPORARY REGISTERED VEHICLES/VEHICLE ON TRADE CERTIFICATE NUMBER",
    ];

    const seen = new Set();
    return [...fromConstants, ...fallback].filter((v) => {
      const k = norm(v);
      if (!k || seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  }, []);

  // ✅ Vehicle class options
  const vehicleClassOptions = useMemo(() => {
    if (isContractPassenger) {
      return [
        "THREE WHEELER(PASSENGER)",
        "MOTOR CAB",
        "LUXURY CAB",
        "MAXI CAB",
        "OMNI BUS",
        "BUS",
      ];
    }

    if (isGoodsVehicle) {
      return [
        "LIGHT GOODS VEHICLE",
        "MEDIUM GOODS VEHICLE",
        "HEAVY GOODS VEHICLE",
        "LIBRARY VAN",
        "MOBILE WORKSHOP",
        "MOBILE CLINIC",
        "X-RAY VAN",
        "CASH VAN",
        "ARTICULATED VAN",
        "MULTI-AXLED GOODS",
      ];
    }

    if (isConstructionEq) {
      return [
        "CHASSIS OF VEHICLES",
        "VEHICLE FITTED WITH RIG",
        "VEHICLE FITTED WITH COMPRESSOR",
        "TOWER WAGONS",
        "TREE TRIMMING VEHICLE",
        "FORK LIFT",
        "VEHICLE FITTED WITH AIR GENERATOR",
      ];
    }

    if (isTempRegistered) {
      return ["TEMPORARY REGISTERED VEHICLE"];
    }

    return [];
  }, [isContractPassenger, isGoodsVehicle, isConstructionEq, isTempRegistered]);

  // ✅ required fields
  const required = useMemo(() => {
    return {
      vehicleNo: true,
      chassisNo: true,
      mobileNo: true,
      ownerName: true,
      fromState: true,

      vehiclePermitType: true,
      vehicleClass: true,

      seatingCapacityExcludingDriver: isContractPassenger,
      sleeperCapacityExcludingDriver: isContractPassenger,
      standingCapacity: isContractPassenger,

      grossVehicleWeight: !isContractPassenger,
      unladenWeight: !isContractPassenger,

      permitNo: true,
      permitValidity: true,

      permitType: true,
      serviceType: true,
      taxMode: true,
      noOfPeriods: false,

      fitnessValidity: true,
      insuranceValidity: true,
      puccValidity: true,
      roadTaxValidity: true,

      aitpPermitValidity: true,

      districtName: true,
      checkpostName: true,

      taxFromDate: true,
      taxUptoDate: true,

      mvTax: true,
      userCharge: true,
      permitFee: true,
      cgst: true,
      sgst: true,
    };
  }, [isContractPassenger]);

  const star = (k) => (required[k] ? <sup>*</sup> : null);

  // ✅ Filtered checkpost list (maps checkposts to selected border barrier)
  // NOTE: Your constants should be like:
  // fields.mp.checkPostName = [{ name: 'SOYAT', borderBarrier: 'AGAR MALWA' }, ...]
  const filteredCheckposts = useMemo(() => {
    const barrier = norm(payLoad.districtName); // districtName UI = borderBarrier choice
    const list = fields?.mp?.checkPostName || fields?.mp?.checkposts || [];
    if (!barrier) return [];
    return list
      .filter((c) => norm(c?.borderBarrier) === barrier)
      .map((c) => ({ name: c?.name }))
      .filter((c) => c.name);
  }, [payLoad.districtName]);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;

    setPayLoad((old) => {
      // when vehicle type changes reset dependent fields
      if (name === "vehiclePermitType") {
        const nextNorm =
          norm(value) === "CONTRACT CARRIAGE/PASSANGER VEHICLES"
            ? "CONTRACT CARRIAGE/PASSENGER VEHICLES"
            : norm(value);

        const nextIsContract =
          nextNorm === "CONTRACT CARRIAGE/PASSENGER VEHICLES";

        return {
          ...old,
          vehiclePermitType: value,
          vehicleClass: "",

          seatingCapacityExcludingDriver: nextIsContract
            ? old.seatingCapacityExcludingDriver
            : "",
          sleeperCapacityExcludingDriver: nextIsContract
            ? old.sleeperCapacityExcludingDriver
            : "",
          standingCapacity: nextIsContract ? old.standingCapacity : "",

          grossVehicleWeight: nextIsContract ? "" : old.grossVehicleWeight,
          unladenWeight: nextIsContract ? "" : old.unladenWeight,
        };
      }

      // ✅ when district/border barrier changes, reset checkpost
      if (name === "districtName") {
        return { ...old, districtName: value, checkpostName: "" };
      }

      return { ...old, [name]: value };
    });
  };

  // ✅ computed total (MV + User + CGST + SGST)
  const computedTotal = useMemo(() => {
    const mv = Number(payLoad.mvTax || 0);
    const uc = Number(payLoad.userCharge || 0);
    const cg = Number(payLoad.cgst || 0);
    const sg = Number(payLoad.sgst || 0);
    return mv + uc + cg + sg;
  }, [payLoad.mvTax, payLoad.userCharge, payLoad.cgst, payLoad.sgst]);

  useEffect(() => {
    setPayLoad((p) => ({ ...p, totalAmount: String(computedTotal || "") }));
  }, [computedTotal]);

  const getDetailsHandler = async () => {
    if (!payLoad.vehicleNo) {
      alert("Please enter vehicle no.");
      return;
    }

    setIsLoading(true);
    const { data, error } = await getDetailsApi({
      vehicleNo: payLoad.vehicleNo,
    });
    setIsLoading(false);

    if (error) {
      alert(error.message || "Failed to fetch vehicle details");
      return;
    }

    if (data?.success) {
      const d = data.detail || {};
      setPayLoad((p) => ({
        ...p,
        chassisNo: d.chassisNo || p.chassisNo,
        mobileNo: d.mobileNo || p.mobileNo,
        ownerName: d.ownerName || p.ownerName,
        fromState: d.fromState || p.fromState,

        vehiclePermitType: d.vehiclePermitType || p.vehiclePermitType,
        vehicleClass: d.vehicleClass || p.vehicleClass,

        districtName: d.districtName || d.borderBarrier || p.districtName,
        checkpostName: d.checkpostName || d.checkPostName || p.checkpostName,
      }));
    }
  };

  const onResetHandler = () => {
    setPayLoad({
      vehicleNo: "",
      chassisNo: "",
      mobileNo: "",
      ownerName: "",
      fromState: "",

      vehiclePermitType: "",
      vehicleClass: "",

      seatingCapacityExcludingDriver: "",
      sleeperCapacityExcludingDriver: "",
      standingCapacity: "",

      grossVehicleWeight: "",
      unladenWeight: "",

      permitNo: "",
      permitValidity: "",
      aitpPermitValidity: "",

      permitType: "",
      serviceType: "",
      taxMode: "",
      noOfPeriods: "",

      fitnessValidity: "",
      insuranceValidity: "",
      puccValidity: "",
      roadTaxValidity: "",

      districtName: "",
      checkpostName: "",

      taxFromDate: "",
      taxUptoDate: "",

      mvTax: "",
      userCharge: "",
      permitFee: "",
      cgst: "",
      sgst: "",

      totalAmount: "",

      floorArea: "",
      infraCess: "",
      cess: "",
      permitEndoresment: "",
      routeOfTheJourney: "",
      purposeOfJourney: "",
      basicPermitValidity: "",
      taxValidity: "",
    });
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();

    const formData = {
      ...payLoad,
      state: stateKey,
      totalAmount: String(computedTotal || 0),
      vehiclePermitType: normalizedPermitType,
    };

    history.push("/select-payment", { formData });
  };

  if (!hasAccess) {
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
          <b>BORDER TAX PAYMENT FOR ENTRY INTO</b>{" "}
          <span>MADHYA PRADESH</span>
        </p>
      </div>

      <div className="box box--main">
        <div className="box__heading--blue">Tax Payment Details</div>

        <form
          ref={formRef}
          onSubmit={onSubmitHandler}
          className="service-type tax-details mt-4"
        >
          <div className="row">
            {/* LEFT */}
            <div className="col-6">
              <div className="form__control">
                <label
                  className="form__label d-block w-100 text-left"
                  htmlFor="vehicleNo"
                >
                  Vehicle No.{star("vehicleNo")}
                </label>
                <input
                  required={required.vehicleNo}
                  maxLength="10"
                  disabled={isLoading}
                  value={payLoad.vehicleNo}
                  onChange={onChangeHandler}
                  className="form__input w-100"
                  type="text"
                  id="vehicleNo"
                  name="vehicleNo"
                />
              </div>

              <div className="form__control">
                <label
                  className="form__label d-block w-100 text-left"
                  htmlFor="chassisNo"
                >
                  Chassis No.{star("chassisNo")}
                </label>
                <input
                  required={required.chassisNo}
                  maxLength="19"
                  disabled={isLoading}
                  onChange={onChangeHandler}
                  value={payLoad.chassisNo}
                  className="form__input w-100"
                  type="text"
                  id="chassisNo"
                  name="chassisNo"
                />
              </div>

              <div className="form__control">
                <label
                  className="form__label d-block w-100 text-left"
                  htmlFor="mobileNo"
                >
                  Mobile No.{star("mobileNo")}
                </label>
                <input
                  required={required.mobileNo}
                  disabled={isLoading}
                  value={payLoad.mobileNo}
                  onChange={onChangeHandler}
                  placeholder="SMS about payment will be sent to this number"
                  className="form__input w-100"
                  type="text"
                  id="mobileNo"
                  inputMode="tel"
                  maxLength="10"
                  minLength="10"
                  name="mobileNo"
                />
              </div>

              {/* Vehicle Type + Vehicle Class */}
              <div className="row">
                <div className="col-sm-6">
                  <div className="form__control">
                    <label
                      className="form__label d-block w-100 text-left"
                      htmlFor="vehiclePermitType"
                    >
                      Vehicle Type{star("vehiclePermitType")}
                    </label>
                    <select
                      required={required.vehiclePermitType}
                      value={payLoad.vehiclePermitType}
                      onChange={onChangeHandler}
                      name="vehiclePermitType"
                      id="vehiclePermitType"
                      disabled={isLoading}
                    >
                      <option value="">--Select Vehicle Type--</option>
                      {vehiclePermitTypeOptions.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="form__control">
                    <label
                      className="form__label d-block w-100 text-left"
                      htmlFor="vehicleClass"
                    >
                      Vehicle Class{star("vehicleClass")}
                    </label>
                    <select
                      required={required.vehicleClass}
                      disabled={isLoading || !payLoad.vehiclePermitType}
                      value={payLoad.vehicleClass}
                      onChange={onChangeHandler}
                      name="vehicleClass"
                      id="vehicleClass"
                    >
                      <option value="">--Select Vehicle Class--</option>
                      {vehicleClassOptions.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Passenger vs Goods section */}
              {isContractPassenger ? (
                <>
                  <div className="row">
                    <div className="col-sm-6">
                      <div className="form__control">
                        <label
                          className="form__label d-block w-100 text-left"
                          htmlFor="seatingCapacityExcludingDriver"
                        >
                          Seating Capacity (Excluding Driver)
                          {star("seatingCapacityExcludingDriver")}
                        </label>
                        <input
                          required={required.seatingCapacityExcludingDriver}
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

                    <div className="col-sm-6">
                      <div className="form__control">
                        <label
                          className="form__label d-block w-100 text-left"
                          htmlFor="sleeperCapacityExcludingDriver"
                        >
                          Sleeper Capacity
                          {star("sleeperCapacityExcludingDriver")}
                        </label>
                        <input
                          required={required.sleeperCapacityExcludingDriver}
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

                  <div className="row">
                    <div className="col-sm-6">
                      <div className="form__control">
                        <label
                          className="form__label d-block w-100 text-left"
                          htmlFor="standingCapacity"
                        >
                          Standing Capacity{star("standingCapacity")}
                        </label>
                        <input
                          required={required.standingCapacity}
                          min="0"
                          disabled={isLoading}
                          onChange={onChangeHandler}
                          className="form__input w-100"
                          type="number"
                          value={payLoad.standingCapacity}
                          id="standingCapacity"
                          name="standingCapacity"
                        />
                      </div>
                    </div>

                    <div className="col-sm-6">
                      <div className="form__control">
                        <label
                          className="form__label d-block w-100 text-left"
                          htmlFor="noOfPeriods"
                        >
                          No of Periods{star("noOfPeriods")}
                        </label>
                        <input
                          required={required.noOfPeriods}
                          min="0"
                          disabled={isLoading}
                          onChange={onChangeHandler}
                          className="form__input w-100"
                          type="number"
                          value={payLoad.noOfPeriods}
                          id="noOfPeriods"
                          name="noOfPeriods"
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="row">
                  <div className="col-sm-6">
                    <div className="form__control">
                      <label
                        className="form__label d-block w-100 text-left"
                        htmlFor="grossVehicleWeight"
                      >
                        Gross Vehicle Wt.(in kg){star("grossVehicleWeight")}
                      </label>
                      <input
                        required={required.grossVehicleWeight}
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

                  <div className="col-sm-6">
                    <div className="form__control">
                      <label
                        className="form__label d-block w-100 text-left"
                        htmlFor="unladenWeight"
                      >
                        Unladen Wt.(in kg){star("unladenWeight")}
                      </label>
                      <input
                        required={required.unladenWeight}
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

              {/* Permit No + Permit Validity */}
              <div className="row">
                <div className="col-sm-6">
                  <div className="form__control">
                    <label
                      className="form__label d-block w-100 text-left"
                      htmlFor="permitNo"
                    >
                      Permit No.{star("permitNo")}
                    </label>
                    <input
                      required={required.permitNo}
                      disabled={isLoading}
                      onChange={onChangeHandler}
                      className="form__input w-100"
                      type="text"
                      value={payLoad.permitNo}
                      id="permitNo"
                      name="permitNo"
                    />
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="form__control">
                    <label
                      className="form__label d-block w-100 text-left"
                      htmlFor="permitValidity"
                    >
                      Permit Validity{star("permitValidity")}
                    </label>
                    <input
                      required={required.permitValidity}
                      disabled={isLoading}
                      className="form__input w-100"
                      type="date"
                      id="permitValidity"
                      name="permitValidity"
                      onChange={onChangeHandler}
                      value={payLoad.permitValidity}
                    />
                  </div>
                </div>
              </div>

              {/* AITP Permit Validity */}
              <div className="form__control">
                <label
                  className="form__label d-block w-100 text-left"
                  htmlFor="aitpPermitValidity"
                >
                  AITP Permit Validity{star("aitpPermitValidity")}
                </label>
                <input
                  required={required.aitpPermitValidity}
                  disabled={isLoading}
                  className="form__input w-100"
                  type="date"
                  id="aitpPermitValidity"
                  name="aitpPermitValidity"
                  onChange={onChangeHandler}
                  value={payLoad.aitpPermitValidity}
                />
              </div>

              {/* District + Tax From */}
              <div className="row">
                <div className="col-sm-6">
                  <div className="form__control">
                    <label
                      className="form__label d-block w-100 text-left"
                      htmlFor="districtName"
                    >
                      District Name{star("districtName")}
                    </label>
                    <select
                      required={required.districtName}
                      disabled={isLoading}
                      value={payLoad.districtName}
                      onChange={onChangeHandler}
                      name="districtName"
                      id="districtName"
                    >
                      <option value="">--Select District Name--</option>
                      {(fields?.mp?.borderBarrier ||
                        fields?.madhyaPradesh?.borderBarrier ||
                        []).map((d) => (
                        <option key={d.name} value={d.name}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="form__control">
                    <label
                      className="form__label d-block w-100 text-left"
                      htmlFor="taxFromDate"
                    >
                      Tax From Date{star("taxFromDate")}
                    </label>
                    <input
                      required={required.taxFromDate}
                      disabled={isLoading}
                      className="form__input w-100"
                      type="date"
                      id="taxFromDate"
                      name="taxFromDate"
                      onChange={onChangeHandler}
                      value={payLoad.taxFromDate}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT */}
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

              <div className="form__control">
                <label
                  className="form__label d-block w-100 text-left"
                  htmlFor="ownerName"
                >
                  Owner Name{star("ownerName")}
                </label>
                <input
                  required={required.ownerName}
                  disabled={isLoading}
                  className="form__input w-100"
                  type="text"
                  id="ownerName"
                  name="ownerName"
                  onChange={onChangeHandler}
                  value={payLoad.ownerName}
                />
              </div>

              <div className="form__control">
                <label
                  className="form__label d-block w-100 text-left"
                  htmlFor="fromState"
                >
                  From State{star("fromState")}
                </label>
                <select
                  required={required.fromState}
                  disabled={isLoading}
                  value={payLoad.fromState}
                  onChange={onChangeHandler}
                  name="fromState"
                  id="fromState"
                >
                  <option value="">--Select State--</option>
                  {(fields?.fromState || []).map((t) => (
                    <option key={t.name} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Permit Type + Service Type */}
              <div className="row">
                <div className="col-sm-6">
                  <div className="form__control">
                    <label
                      className="form__label d-block w-100 text-left"
                      htmlFor="permitType"
                    >
                      Permit Type{star("permitType")}
                    </label>
                    <select
                      required={required.permitType}
                      disabled={isLoading}
                      value={payLoad.permitType}
                      onChange={onChangeHandler}
                      name="permitType"
                      id="permitType"
                    >
                      <option value="">--Select Permit Type--</option>
                      {(fields?.madhyaPradesh?.permitType || []).map((t) => (
                        <option key={t.name} value={t.name}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="form__control">
                    <label
                      className="form__label d-block w-100 text-left"
                      htmlFor="serviceType"
                    >
                      Service Type{star("serviceType")}
                    </label>
                    <select
                      required={required.serviceType}
                      disabled={isLoading}
                      name="serviceType"
                      id="serviceType"
                      value={payLoad.serviceType}
                      onChange={onChangeHandler}
                    >
                      <option value="">--Select Service Type--</option>
                      {(fields?.madhyaPradesh?.serviceType || []).map((t) => (
                        <option key={t.name} value={t.name}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Tax Mode */}
              <div className="form__control">
                <label
                  className="form__label d-block w-100 text-left"
                  htmlFor="taxMode"
                >
                  Tax Mode{star("taxMode")}
                </label>
                <select
                  required={required.taxMode}
                  disabled={isLoading}
                  onChange={onChangeHandler}
                  value={payLoad.taxMode}
                  name="taxMode"
                  id="taxMode"
                >
                  <option value="">--Select Payment Mode--</option>
                  {(fields?.madhyaPradesh?.taxMode || []).map((t) => (
                    <option key={t.name} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fitness + Insurance */}
              <div className="row">
                <div className="col-sm-6">
                  <div className="form__control">
                    <label
                      className="form__label d-block w-100 text-left"
                      htmlFor="fitnessValidity"
                    >
                      Fitness Validity{star("fitnessValidity")}
                    </label>
                    <input
                      required={required.fitnessValidity}
                      disabled={isLoading}
                      className="form__input w-100"
                      type="date"
                      id="fitnessValidity"
                      name="fitnessValidity"
                      onChange={onChangeHandler}
                      value={payLoad.fitnessValidity}
                    />
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="form__control">
                    <label
                      className="form__label d-block w-100 text-left"
                      htmlFor="insuranceValidity"
                    >
                      Insurance Validity{star("insuranceValidity")}
                    </label>
                    <input
                      required={required.insuranceValidity}
                      disabled={isLoading}
                      className="form__input w-100"
                      type="date"
                      id="insuranceValidity"
                      name="insuranceValidity"
                      onChange={onChangeHandler}
                      value={payLoad.insuranceValidity}
                    />
                  </div>
                </div>
              </div>

              {/* PUCC + Road Tax Validity */}
              <div className="row">
                <div className="col-sm-6">
                  <div className="form__control">
                    <label
                      className="form__label d-block w-100 text-left"
                      htmlFor="puccValidity"
                    >
                      PUCC Validity{star("puccValidity")}
                    </label>
                    <input
                      required={required.puccValidity}
                      disabled={isLoading}
                      className="form__input w-100"
                      type="date"
                      id="puccValidity"
                      name="puccValidity"
                      onChange={onChangeHandler}
                      value={payLoad.puccValidity}
                    />
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="form__control">
                    <label
                      className="form__label d-block w-100 text-left"
                      htmlFor="roadTaxValidity"
                    >
                      Road Tax Validity{star("roadTaxValidity")}
                    </label>
                    <input
                      required={required.roadTaxValidity}
                      disabled={isLoading}
                      className="form__input w-100"
                      type="date"
                      id="roadTaxValidity"
                      name="roadTaxValidity"
                      onChange={onChangeHandler}
                      value={payLoad.roadTaxValidity}
                    />
                  </div>
                </div>
              </div>

              {/* Checkpost + Tax Upto */}
              <div className="row">
                <div className="col-sm-6">
                  <div className="form__control">
                    <label
                      className="form__label d-block w-100 text-left"
                      htmlFor="checkpostName"
                    >
                      Checkpost Name{star("checkpostName")}
                    </label>
                    <select
                      required={required.checkpostName}
                      disabled={isLoading || !payLoad.districtName}
                      value={payLoad.checkpostName}
                      onChange={onChangeHandler}
                      name="checkpostName"
                      id="checkpostName"
                    >
                      <option value="">--Select Checkpost Name--</option>
                      {filteredCheckposts.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="form__control">
                    <label
                      className="form__label d-block w-100 text-left"
                      htmlFor="taxUptoDate"
                    >
                      Tax Upto Date{star("taxUptoDate")}
                    </label>
                    <input
                      required={required.taxUptoDate}
                      disabled={isLoading}
                      className="form__input w-100"
                      id="taxUptoDate"
                      name="taxUptoDate"
                      type="date"
                      value={payLoad.taxUptoDate}
                      onChange={onChangeHandler}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="row mt-3">
            <div className="col-12">
              <table className="hr-table">
                <thead>
                  <tr>
                    <th className="hr-table-1">Sl. No.</th>
                    <th className="hr-table-2">Particulars</th>
                    <th>Tax From</th>
                    <th>Tax Upto</th>
                    <th>Amount</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>1</td>
                    <td className="pb-table-text">MV Tax</td>
                    <td>{payLoad.taxFromDate || ""}</td>
                    <td>{payLoad.taxUptoDate || ""}</td>
                    <td className="input-box">
                      <center>
                        <input
                          required={required.mvTax}
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
                    <td>2</td>
                    <td className="pb-table-text">Service/User Charge</td>
                    <td></td>
                    <td></td>
                    <td className="input-box">
                      <center>
                        <input
                          required={required.userCharge}
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

                  <tr>
                    <td>3</td>
                    <td className="pb-table-text">Permit Fee</td>
                    <td>{payLoad.taxFromDate || ""}</td>
                    <td>{payLoad.taxUptoDate || ""}</td>
                    <td className="input-box">
                      <center>
                        <input
                          required={required.permitFee}
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
                    <td>4</td>
                    <td className="pb-table-text">CGST</td>
                    <td></td>
                    <td></td>
                    <td className="input-box">
                      <center>
                        <input
                          required={required.cgst}
                          disabled={isLoading}
                          value={payLoad.cgst}
                          onChange={onChangeHandler}
                          name="cgst"
                          type="number"
                          min="0"
                          inputMode="numeric"
                        />
                      </center>
                    </td>
                  </tr>

                  <tr>
                    <td>5</td>
                    <td className="pb-table-text">SGST</td>
                    <td></td>
                    <td></td>
                    <td className="input-box">
                      <center>
                        <input
                          required={required.sgst}
                          disabled={isLoading}
                          value={payLoad.sgst}
                          onChange={onChangeHandler}
                          name="sgst"
                          type="number"
                          min="0"
                          inputMode="numeric"
                        />
                      </center>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <br />

          <div className="row">
            <div className="col-sm-6">
              <div className="form__control">
                <label
                  className="form__label d-block w-100 text-left"
                  htmlFor="totalAmount"
                >
                  Total Amount<sup>*</sup>
                </label>
                <input
                  disabled
                  value={computedTotal || 0}
                  className="form__input w-100"
                  type="number"
                  id="totalAmount"
                  name="totalAmount"
                />
              </div>
            </div>

            <div className="col-sm-6">
              <label className="form__label d-block w-100 text-left">&nbsp;</label>
              <ActionButtons isDisabled={isLoading} onReset={onResetHandler} />
            </div>
          </div>
        </form>

        <br />
      </div>

      <br />
      <br />
      <br />
    </>
  );
};

export default MadhyaPradesh;
