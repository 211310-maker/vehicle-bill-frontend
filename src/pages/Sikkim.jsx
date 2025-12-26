// src/pages/Sikkim.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useHistory } from "react-router";
import Header from "../components/Header";
import Loader from "../components/Loader";
import ActionButtons from "../components/ActionButtons";
import { borderBarriers, checkposts, fields, LOCAL_STORAGE_KEY } from "../constants";
import { getDetailsApi } from "../utils/api";

const Sikkim = () => {
  const history = useHistory();
  const formRef = useRef(null);

  // ✅ safe parse (prevents crash if localStorage is empty/corrupt)
  const isLoggedIn = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    } catch (e) {
      return null;
    }
  }, []);

  const stateKey = "sikkim";
  const stateDisplayName = (fields.stateName && fields.stateName[stateKey]) || "SIKKIM";
  const accessStateName = stateDisplayName;

  const borderOptions = borderBarriers[stateKey] || [];
  const rawCheckpostOptions = checkposts[stateKey] || [];

  const [isLoading, setIsLoading] = useState(false);

  // ✅ payload (now includes GOODS fields too)
  const [payLoad, setPayLoad] = useState({
    vehicleNo: "",
    chassisNo: "",
    mobileNo: "",
    ownerName: "",
    fromState: "",

    vehiclePermitType: "",
    vehicleClass: "",
    permitType: "",
    noOfWheelers: "",

    // passenger fields
    seatingCapacityExcludingDriver: "",
    sleeperCapacityExcludingDriver: "",

    // ✅ goods fields (new)
    grossVehicleWeight: "",
    unladenWeight: "",

    borderBarrier: "",
    checkpostName: "",

    aitpPermitValidity: "",
    aitpPermitAuthValidity: "",

    projectName: "",
    projectAddress: "",

    taxMode: "",
    numberOfPeriod: "",

    taxFromDate: "",
    taxUptoDate: "",

    permitFee: "",
    totalAmount: "",
  });

  // Required fields (your current setup)
  const required = {
    vehicleNo: true,
    chassisNo: true,
    mobileNo: true,
    ownerName: true,
    fromState: true,

    vehiclePermitType: true,
    vehicleClass: true,
    permitType: true,
    noOfWheelers: false,

    seatingCapacityExcludingDriver: true,
    sleeperCapacityExcludingDriver: true,

    // ✅ goods inputs will be required only when goods selected
    grossVehicleWeight: true,
    unladenWeight: true,

    borderBarrier: true,
    checkpostName: true,

    aitpPermitValidity: false,
    aitpPermitAuthValidity: false,

    taxMode: true,
    numberOfPeriod: false,
    taxFromDate: true,
    taxUptoDate: true,

    permitFee: true,
    totalAmount: true,
  };

  // ✅ normalize permit type (fixes dropdown mismatch issue)
  const permitTypeKey = useMemo(() => {
    return String(payLoad.vehiclePermitType || "").trim().toUpperCase();
  }, [payLoad.vehiclePermitType]);

  const isGoodsVehicle = permitTypeKey === "GOODS VEHICLE";

  const onChangeHandler = (e) => {
    const { name, value } = e.target;

    setPayLoad((old) => {
      // ✅ if vehiclePermitType changes => clear dependent fields
      if (name === "vehiclePermitType") {
        const nextKey = String(value || "").trim().toUpperCase();
        const nextIsGoods = nextKey === "GOODS VEHICLE";

        return {
          ...old,
          vehiclePermitType: value,
          vehicleClass: "",

          // clear passenger fields when switching to goods
          seatingCapacityExcludingDriver: nextIsGoods ? "" : old.seatingCapacityExcludingDriver,
          sleeperCapacityExcludingDriver: nextIsGoods ? "" : old.sleeperCapacityExcludingDriver,

          // clear goods fields when switching away from goods
          grossVehicleWeight: nextIsGoods ? old.grossVehicleWeight : "",
          unladenWeight: nextIsGoods ? old.unladenWeight : "",
        };
      }

      // ✅ if district changes => reset checkpost
      if (name === "borderBarrier") {
        return { ...old, borderBarrier: value, checkpostName: "" };
      }

      return { ...old, [name]: value };
    });
  };

  // Total Amount = Permit Fee
  useEffect(() => {
    const amt = Number(payLoad.permitFee || 0);
    setPayLoad((p) => ({
      ...p,
      totalAmount: amt ? String(amt) : "",
    }));
  }, [payLoad.permitFee]);

  // Filter checkposts by selected district
  const filteredCheckposts = useMemo(() => {
    return (rawCheckpostOptions || []).filter((cp) => {
      if (!payLoad.borderBarrier) return true;
      if (cp.district) return cp.district === payLoad.borderBarrier;
      if (cp.borderBarrier) return cp.borderBarrier === payLoad.borderBarrier;
      return true;
    });
  }, [rawCheckpostOptions, payLoad.borderBarrier]);

  // ✅ Vehicle class options EXACTLY like your screenshots
  const vehicleClassOptions = useMemo(() => {
    if (permitTypeKey === "CONTRACT CARRIAGE/PASSENGER VEHICLES") {
      return [
        { value: "MOTOR CAB", label: "MOTOR CAB" },
        { value: "LUXURY CAB", label: "LUXURY CAB" },
        { value: "MAXI CAB", label: "MAXI CAB" },
      ];
    }

    if (permitTypeKey === "GOODS VEHICLE") {
      return [
        { value: "LIGHT GOODS VEHICLE", label: "LIGHT GOODS VEHICLE" },
        { value: "MEDIUM GOODS VEHICLE", label: "MEDIUM GOODS VEHICLE" },
        { value: "HEAVY GOODS VEHICLE", label: "HEAVY GOODS VEHICLE" },
        { value: "TRAILER", label: "TRAILER" },
      ];
    }

    if (permitTypeKey === "STAGE CARRIAGE") {
      return [{ value: "BUS", label: "BUS" }];
    }

    return [];
  }, [permitTypeKey]);

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
      const detail = data.detail || {};
      setPayLoad((p) => ({
        ...p,
        chassisNo: detail.chassisNo || p.chassisNo,
        mobileNo: detail.mobileNo || p.mobileNo,
        ownerName: detail.ownerName || p.ownerName,
        fromState: detail.fromState || p.fromState,
        vehiclePermitType: detail.vehiclePermitType || p.vehiclePermitType,
        vehicleClass: detail.vehicleClass || p.vehicleClass,
        permitType: detail.permitType || p.permitType,
        seatingCapacityExcludingDriver:
          detail.seatingCapacityExcludingDriver || p.seatingCapacityExcludingDriver,
        sleeperCapacityExcludingDriver:
          detail.sleeperCapacityExcludingDriver || p.sleeperCapacityExcludingDriver,

        // ✅ goods values if backend provides later
        grossVehicleWeight: detail.grossVehicleWeight || p.grossVehicleWeight,
        unladenWeight: detail.unladenWeight || p.unladenWeight,

        borderBarrier: detail.borderBarrier || detail.districtName || detail.district || p.borderBarrier,
        checkpostName: detail.checkpostName || detail.checkPostName || p.checkpostName,
      }));
    } else if (data?.message) {
      alert(data.message);
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
      permitType: "",
      noOfWheelers: "",

      seatingCapacityExcludingDriver: "",
      sleeperCapacityExcludingDriver: "",

      grossVehicleWeight: "",
      unladenWeight: "",

      borderBarrier: "",
      checkpostName: "",
      aitpPermitValidity: "",
      aitpPermitAuthValidity: "",
      projectName: "",
      projectAddress: "",
      taxMode: "",
      numberOfPeriod: "",
      taxFromDate: "",
      taxUptoDate: "",
      permitFee: "",
      totalAmount: "",
    });
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();

    // ✅ enforce goods/passenger required UI properly
    if (isGoodsVehicle) {
      if (!payLoad.grossVehicleWeight || !payLoad.unladenWeight) {
        alert("Please enter Gross Vehicle Weight and Unladen Weight.");
        return;
      }
    } else {
      if (!payLoad.seatingCapacityExcludingDriver || payLoad.sleeperCapacityExcludingDriver === "") {
        alert("Please enter Seating Cap and Sleeper Capacity.");
        return;
      }
    }

    history.push("/select-payment", {
      formData: {
        ...payLoad,
        state: stateKey,
      },
    });
  };

  const star = (field) => (required[field] ? <sup>*</sup> : null);

  // ✅ Access check moved here (AFTER hooks)
  if (!isLoggedIn?.accessState?.includes(accessStateName)) {
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
          <b style={{ textTransform: "uppercase" }}>
            BORDER TAX PAYMENT FOR ENTRY INTO{" "}
            <span style={{ color: "red" }}>{stateDisplayName}</span>
          </b>
        </p>
      </div>

      <div className="box box--main">
        <div className="box__heading--blue">Tax Payment Details</div>

        <form ref={formRef} onSubmit={onSubmitHandler} className="service-type tax-details mt-4">
          <div className="row">
            {/* LEFT COLUMN */}
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
                  value={payLoad.chassisNo}
                  onChange={onChangeHandler}
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
                  className="form__input w-100"
                  type="text"
                  id="mobileNo"
                  inputMode="tel"
                  maxLength="10"
                  minLength="10"
                  name="mobileNo"
                />
              </div>

              <div className="form__control">
                <label className="form__label d-block w-100 text-left" htmlFor="vehiclePermitType">
                  Vehicle Permit Type{star("vehiclePermitType")}
                </label>
                <select
                  required={required.vehiclePermitType}
                  disabled={isLoading}
                  value={payLoad.vehiclePermitType}
                  onChange={onChangeHandler}
                  name="vehiclePermitType"
                  id="vehiclePermitType"
                >
                  <option value="">--Select Vehicle Type--</option>
                  {(fields[stateKey]?.vehiclePermitType || []).map((t) => (
                    <option key={t.name} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* ✅ passenger fields OR goods fields */}
              {!isGoodsVehicle ? (
                <div className="row">
                  <div className="col-sm-6">
                    <div className="form__control">
                      <label className="form__label d-block w-100 text-left" htmlFor="seatingCapacityExcludingDriver">
                        Seating Cap{star("seatingCapacityExcludingDriver")}
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
                      <label className="form__label d-block w-100 text-left" htmlFor="sleeperCapacityExcludingDriver">
                        Sleeper Capacity{star("sleeperCapacityExcludingDriver")}
                      </label>
                      <input
                        required={required.sleeperCapacityExcludingDriver}
                        min="0"
                        disabled={isLoading}
                        onChange={onChangeHandler}
                        className="form__input w-100"
                        type="number"
                        value={payLoad.sleeperCapacityExcludingDriver}
                        id="sleeperCapacityExcludingDriver"
                        name="sleeperCapacityExcludingDriver"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="row">
                  <div className="col-sm-6">
                    <div className="form__control">
                      <label className="form__label d-block w-100 text-left" htmlFor="grossVehicleWeight">
                        Gross Vehicle Weight(In Kg.)<sup>*</sup>
                      </label>
                      <input
                        required
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
                      <label className="form__label d-block w-100 text-left" htmlFor="unladenWeight">
                        Unladen Wt(In Kg.)<sup>*</sup>
                      </label>
                      <input
                        required
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

              <div className="form__control">
                <label className="form__label d-block w-100 text-left" htmlFor="aitpPermitValidity">
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

              <div className="form__control">
                <label className="form__label d-block w-100 text-left" htmlFor="projectName">
                  Project Name
                </label>
                <input
                  disabled={isLoading}
                  className="form__input w-100"
                  type="text"
                  id="projectName"
                  name="projectName"
                  onChange={onChangeHandler}
                  value={payLoad.projectName}
                />
              </div>

              <div className="row">
                <div className="col-sm-6">
                  <div className="form__control">
                    <label className="form__label d-block w-100 text-left" htmlFor="taxMode">
                      Tax Mode{star("taxMode")}
                    </label>
                    <select
                      required={required.taxMode}
                      disabled={isLoading}
                      value={payLoad.taxMode}
                      onChange={onChangeHandler}
                      name="taxMode"
                      id="taxMode"
                    >
                      <option value="">--Select Tax Mode--</option>
                      {(fields.taxMode || []).map((t) => (
                        <option key={t.name} value={t.name}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="form__control">
                    <label className="form__label d-block w-100 text-left" htmlFor="numberOfPeriod">
                      No of Period{star("numberOfPeriod")}
                    </label>
                    <input
                      required={required.numberOfPeriod}
                      min="0"
                      disabled={isLoading}
                      className="form__input w-100"
                      type="number"
                      id="numberOfPeriod"
                      name="numberOfPeriod"
                      onChange={onChangeHandler}
                      value={payLoad.numberOfPeriod}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="col-6">
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

              <div className="form__control">
                <label className="form__label d-block w-100 text-left" htmlFor="ownerName">
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
                <label className="form__label d-block w-100 text-left" htmlFor="fromState">
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
                  {(fields.fromState || []).map((t) => (
                    <option key={t.name} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="row">
                <div className="col-sm-6">
                  <div className="form__control">
                    <label className="form__label d-block w-100 text-left" htmlFor="vehicleClass">
                      Vehicle Class{star("vehicleClass")}
                    </label>
                    <select
                      required={required.vehicleClass}
                      disabled={isLoading}
                      value={payLoad.vehicleClass}
                      onChange={onChangeHandler}
                      name="vehicleClass"
                      id="vehicleClass"
                    >
                      <option value="">--Select Vehicle Class--</option>
                      {vehicleClassOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="col-sm-6">
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
                      {(fields[stateKey]?.permitType || []).map((t) => (
                        <option key={t.name} value={t.name}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="form__control">
                <label className="form__label d-block w-100 text-left" htmlFor="noOfWheelers">
                  No. of Wheelers{star("noOfWheelers")}
                </label>
                <input
                  required={required.noOfWheelers}
                  min="0"
                  disabled={isLoading}
                  className="form__input w-100"
                  type="number"
                  id="noOfWheelers"
                  name="noOfWheelers"
                  onChange={onChangeHandler}
                  value={payLoad.noOfWheelers}
                />
              </div>

              <div className="row">
                <div className="col-sm-6">
                  <div className="form__control">
                    <label className="form__label d-block w-100 text-left" htmlFor="borderBarrier">
                      District Name{star("borderBarrier")}
                    </label>
                    <select
                      required={required.borderBarrier}
                      disabled={isLoading}
                      value={payLoad.borderBarrier}
                      onChange={onChangeHandler}
                      name="borderBarrier"
                      id="borderBarrier"
                    >
                      <option value="">--Select District--</option>
                      {borderOptions.map((t) => (
                        <option key={t.name} value={t.name}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="form__control">
                    <label className="form__label d-block w-100 text-left" htmlFor="checkpostName">
                      CheckPost Name{star("checkpostName")}
                    </label>
                    <select
                      required={required.checkpostName}
                      disabled={isLoading}
                      value={payLoad.checkpostName}
                      onChange={onChangeHandler}
                      name="checkpostName"
                      id="checkpostName"
                    >
                      <option value="">--Select CheckpostName/Barrier--</option>
                      {filteredCheckposts.map((t) => (
                        <option key={t.name} value={t.name}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="form__control">
                <label className="form__label d-block w-100 text-left" htmlFor="aitpPermitAuthValidity">
                  AITP Permit Auth Validity{star("aitpPermitAuthValidity")}
                </label>
                <input
                  required={required.aitpPermitAuthValidity}
                  disabled={isLoading}
                  className="form__input w-100"
                  type="date"
                  id="aitpPermitAuthValidity"
                  name="aitpPermitAuthValidity"
                  onChange={onChangeHandler}
                  value={payLoad.aitpPermitAuthValidity}
                />
              </div>

              <div className="form__control">
                <label className="form__label d-block w-100 text-left" htmlFor="projectAddress">
                  Project Address
                </label>
                <input
                  disabled={isLoading}
                  className="form__input w-100"
                  type="text"
                  id="projectAddress"
                  name="projectAddress"
                  onChange={onChangeHandler}
                  value={payLoad.projectAddress}
                />
              </div>

              <div className="row">
                <div className="col-sm-6">
                  <div className="form__control">
                    <label className="form__label d-block w-100 text-left" htmlFor="taxFromDate">
                      Tax From Date{star("taxFromDate")}
                    </label>
                    <input
                      required={required.taxFromDate}
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
                    <label className="form__label d-block w-100 text-left" htmlFor="taxUptoDate">
                      Tax Upto Date{star("taxUptoDate")}
                    </label>
                    <input
                      required={required.taxUptoDate}
                      disabled={isLoading}
                      className="form__input w-100"
                      type="datetime-local"
                      id="taxUptoDate"
                      name="taxUptoDate"
                      onChange={onChangeHandler}
                      value={payLoad.taxUptoDate}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* TABLE (Permit Fee only) */}
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
                    <td className="hr-table-body">
                      <span className="hr-table-text">1</span>
                    </td>
                    <td className="hr-table-body">
                      <span className="hr-table-text">Permit Fee</span>
                    </td>
                    <td className="hr-table-body">
                      <span className="hr-table-text">{payLoad.taxFromDate || "-"}</span>
                    </td>
                    <td className="hr-table-body">
                      <span className="hr-table-text">{payLoad.taxUptoDate || "-"}</span>
                    </td>
                    <td className="hr-table-body">
                      <input
                        required={required.permitFee}
                        min="0"
                        disabled={isLoading}
                        value={payLoad.permitFee}
                        onChange={onChangeHandler}
                        className="form__input w-100"
                        type="number"
                        id="permitFee"
                        name="permitFee"
                        placeholder="0"
                      />
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
                <label className="form__label d-block w-100 text-left" htmlFor="totalAmount">
                  Total Amount{star("totalAmount")}
                </label>
                <input
                  required={required.totalAmount}
                  min="0"
                  disabled={isLoading}
                  readOnly
                  value={payLoad.totalAmount}
                  className="form__input w-100"
                  type="number"
                  id="totalAmount"
                  name="totalAmount"
                />
              </div>
            </div>

            <div className="col-sm-6">
              <label className="form__label d-block w-100 text-left">&nbsp;</label>
              <ActionButtons tabIndex="22" isDisabled={isLoading} onReset={onResetHandler} />
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

export default Sikkim;
