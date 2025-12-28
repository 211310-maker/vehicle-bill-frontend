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

  const hasAccess = Boolean(isLoggedIn?.accessState?.includes(fields?.stateName?.mp));

  // ✅ IMPORTANT: Use a single source for MP constants
  const mpFields = fields?.mp || fields?.madhyaPradesh || {};

  const norm = (s) =>
    String(s || "")
      .toUpperCase()
      .replace(/\s+/g, " ")
      .trim();

  const [isLoading, setIsLoading] = useState(false);

  const [payLoad, setPayLoad] = useState({
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

  // ✅ normalize vehiclePermitType spelling
  const normalizedPermitType = useMemo(() => {
    const t = norm(payLoad.vehiclePermitType);
    if (t === "CONTRACT CARRIAGE/PASSANGER VEHICLES") return "CONTRACT CARRIAGE/PASSENGER VEHICLES";
    return t;
  }, [payLoad.vehiclePermitType]);

  const isContractPassenger = normalizedPermitType === "CONTRACT CARRIAGE/PASSENGER VEHICLES";
  const isGoodsVehicle = normalizedPermitType === "GOODS VEHICLE";
  const isConstructionEq = normalizedPermitType === "CONSTRUCTION EQUIPMENT VEHICLE";
  const isTempRegistered =
    normalizedPermitType === "TEMPORARY REGISTERED VEHICLES/VEHICLE ON TRADE CERTIFICATE NUMBER";

  // ✅ Vehicle Type options from index.js (fallback if empty)
  const vehiclePermitTypeOptions = useMemo(() => {
    const fromConstants = (mpFields?.vehiclePermitType || []).map((x) => x?.name).filter(Boolean);

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
  }, [mpFields]);

  // ✅ Vehicle Class options (filtered from mpFields.vehicleClass by category)
  const vehicleClassOptions = useMemo(() => {
    const selectedType = normalizedPermitType;
    const list = mpFields?.vehicleClass || [];
    return list
      .filter((x) => norm(x?.category) === norm(selectedType))
      .map((x) => x?.name)
      .filter(Boolean);
  }, [mpFields, normalizedPermitType]);

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

  // ✅ Checkposts filtered by selected barrier (districtName dropdown)
  // Your index.js should have: fields.mp.checkPostName = [{ name, borderBarrier }]
  const filteredCheckposts = useMemo(() => {
    const barrier = norm(payLoad.districtName);
    const list = mpFields?.checkPostName || [];
    if (!barrier) return [];
    return list
      .filter((c) => norm(c?.borderBarrier) === barrier)
      .map((c) => ({ name: c?.name }))
      .filter((c) => c.name);
  }, [mpFields, payLoad.districtName]);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;

    setPayLoad((old) => {
      if (name === "vehiclePermitType") {
        return {
          ...old,
          vehiclePermitType: value,
          vehicleClass: "", // reset class when type changes
        };
      }

      if (name === "districtName") {
        return { ...old, districtName: value, checkpostName: "" }; // reset checkpost
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
    const { data, error } = await getDetailsApi({ vehicleNo: payLoad.vehicleNo });
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
          <b>BORDER TAX PAYMENT FOR ENTRY INTO</b> <span>MADHYA PRADESH</span>
        </p>
      </div>

      <div className="box box--main">
        <div className="box__heading--blue">Tax Payment Details</div>

        <form ref={formRef} onSubmit={onSubmitHandler} className="service-type tax-details mt-4">
          <div className="row">
            {/* LEFT */}
            <div className="col-6">
              <div className="form__control">
                <label className="form__label d-block w-100 text-left" htmlFor="vehicleNo">
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
                <label className="form__label d-block w-100 text-left" htmlFor="chassisNo">
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
                <label className="form__label d-block w-100 text-left" htmlFor="mobileNo">
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
                    <label className="form__label d-block w-100 text-left" htmlFor="vehiclePermitType">
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
                    <label className="form__label d-block w-100 text-left" htmlFor="vehicleClass">
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

              {/* District + Tax From */}
              <div className="row">
                <div className="col-sm-6">
                  <div className="form__control">
                    <label className="form__label d-block w-100 text-left" htmlFor="districtName">
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
                      {(mpFields?.borderBarrier || []).map((d) => (
                        <option key={d.name} value={d.name}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="form__control">
                    <label className="form__label d-block w-100 text-left" htmlFor="taxFromDate">
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
              {/* Get Details */}
              <div className="form__control text-left">
                <label className="form__label d-block w-100 text-left">&nbsp;</label>
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

              {/* Permit Type */}
              <div className="form__control">
                <label className="form__label d-block w-100 text-left" htmlFor="permitType">
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
                  {(mpFields?.permitType || []).map((t) => (
                    <option key={t.name} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Service Type */}
              <div className="form__control">
                <label className="form__label d-block w-100 text-left" htmlFor="serviceType">
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
                  {(mpFields?.serviceType || []).map((t) => (
                    <option key={t.name} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tax Mode */}
              <div className="form__control">
                <label className="form__label d-block w-100 text-left" htmlFor="taxMode">
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
                  {(mpFields?.taxMode || []).map((t) => (
                    <option key={t.name} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Checkpost + Tax Upto */}
              <div className="row">
                <div className="col-sm-6">
                  <div className="form__control">
                    <label className="form__label d-block w-100 text-left" htmlFor="checkpostName">
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
                    <label className="form__label d-block w-100 text-left" htmlFor="taxUptoDate">
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

          {/* total + buttons */}
          <br />
          <div className="row">
            <div className="col-sm-6">
              <div className="form__control">
                <label className="form__label d-block w-100 text-left" htmlFor="totalAmount">
                  Total Amount<sup>*</sup>
                </label>
                <input disabled value={computedTotal || 0} className="form__input w-100" type="number" />
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
    </>
  );
};

export default MadhyaPradesh;
