// src/pages/Telangana.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useHistory } from "react-router";
import ActionButtons from "../components/ActionButtons";
import Header from "../components/Header";
import Loader from "../components/Loader";
import { fields, LOCAL_STORAGE_KEY } from "../constants";
import { getDetailsApi } from "../utils/api";

const Telangana = () => {
  const history = useHistory();
  const formRef = useRef(null);

  const stateKey = "telangana";

  const isLoggedIn = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    } catch {
      return null;
    }
  }, []);

  const hasAccess = Boolean(
    isLoggedIn?.accessState?.includes(fields?.stateName?.telangana)
  );

  const norm = (s) =>
    String(s || "")
      .toUpperCase()
      .replace(/\s+/g, " ")
      .trim();

  const [isLoading, setIsLoading] = useState(false);

  const [payLoad, setPayLoad] = useState({
    vehicleNo: "",
    chassisNo: "",
    ownerName: "",
    mobileNo: "",
    fromState: "",

    // Telangana vehicle info (screenshots)
    vehicleType: "", // TRANSPORT / NON-TRANSPORT
    vehicleClass: "",
    vehicleCategory: "", // LIGHT/MEDIUM/HEAVY passenger/goods depending
    permitType: "", // TEMPORARY PERMIT / NOT APPLICABLE / etc
    serviceType: "",

    grossVehicleWeight: "", // (in Kg)
    seatingCapacityExcludingDriver: "",
    sleeperCapacityExcludingDriver: "",
    permitValidity: "",

    // entry info
    districtName: "",
    checkpostName: "",

    taxMode: "",
    paymentMode: "ONLINE",

    taxFromDate: "",
    taxUptoDate: "",

    // table amounts (as per your table screenshot)
    mvTax: "",
    userCharge: "",
    taxTokenFee: "",

    totalAmount: "",
  });

  // ✅ Vehicle Type options
  const vehicleTypeOptions = useMemo(() => {
    const fromConstants = (fields?.telangana?.vehicleType || [])
      .map((x) => x?.name)
      .filter(Boolean);

    const fallback = ["TRANSPORT", "NON-TRANSPORT"];

    const seen = new Set();
    return [...fromConstants, ...fallback].filter((v) => {
      const k = norm(v);
      if (!k || seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  }, []);

  const isTransport = norm(payLoad.vehicleType) === "TRANSPORT";
  const isNonTransport = norm(payLoad.vehicleType) === "NON-TRANSPORT";

  // ✅ Vehicle Class options (from your screenshots)
  const vehicleClassOptions = useMemo(() => {
    if (isTransport) {
      return [
        "MULTI-AXLED GOODS",
        "MOTOR CAB",
        "MAXI CAB",
        "EDUCATIONAL INSTITUTION BUS",
        "BUS",
        "PRIVATE SERVICE VEHICLE",
        "POWER TILLER (COMMERCIAL)",
        "ARTICULATED VEHICLE",
        "AUXILIARY TRAILER",
        "TRACTOR-TROLLEY(COMMERCIAL)",
        "TRAILER (COMMERCIAL)",
        "GOODS CARRIER",
        "MODULAR HYDRAULIC TRAILER",
        "DUMPER",
        "CASH VAN",
        "CHASSIS OF VEHICLES",
        "AMBULANCE",
        "ANIMAL AMBULANCE",
        "X-RAY VAN",
        "SNORKED LADDERS",
        "FIRE TENDERS",
        "LIBRARY VAN",
        "MOBILE WORKSHOP",
        "TRACTOR (COMMERCIAL)",
        "MOBILE CANTEEN",
        "HEARSES",
        "MOBILE CLINIC",
        "SEMI-TRAILER (COMMERCIAL)",
        "OMNI BUS",
      ];
    }

    if (isNonTransport) {
      return [
        "VEHICLE FITTED WITH RIG",
        "VEHICLE FITTED WITH GENERATOR",
        "ARMOURED/SPECIALISED VEHICLE",
        "QUADRICYCLE(PRIVATE)",
        "HARVESTER",
        "RECOVERY VEHICLE",
        "THREE WHEELER (PERSONAL)",
        "POWER TILLER",
        "TRAILER FOR PERSONAL USE",
        "TREE TRIMMING VEHICLE",
        "TOWER WAGON",
        "BREAKDOWN VAN",
        "TOW TRUCK",
        "CAMPER VAN / TRAILER (PRIVATE USE)",
        "VEHICLE FITTED WITH COMPRESSOR",
      ];
    }

    return [];
  }, [isTransport, isNonTransport]);

  // ✅ Vehicle Category options (screenshots show different category sets)
  const vehicleCategoryOptions = useMemo(() => {
    const vclass = norm(payLoad.vehicleClass);

    // If goods-ish class -> goods categories
    const goodsHints = [
      "GOODS",
      "CARRIER",
      "DUMPER",
      "TRAILER",
      "TRACTOR",
      "CASH VAN",
      "MULTI-AXLED",
      "ARTICULATED",
    ];
    const isGoodsish = goodsHints.some((h) => vclass.includes(h));

    if (isGoodsish) {
      return ["LIGHT GOODS VEHICLE", "MEDIUM GOODS VEHICLE", "HEAVY GOODS VEHICLE"];
    }

    // else passenger categories
    return [
      "LIGHT PASSENGER VEHICLE",
      "MEDIUM PASSENGER VEHICLE",
      "HEAVY PASSENGER VEHICLE",
    ];
  }, [payLoad.vehicleClass]);

  // ✅ Permit Type options (you asked to include NOT APPLICABLE)
  const permitTypeOptions = useMemo(() => {
    const fromConstants = (fields?.telangana?.permitType || [])
      .map((x) => x?.name)
      .filter(Boolean);

    const fallback = [
      "TEMPORARY PERMIT",
      "NOT APPLICABLE",
      "ALL INDIA TOURIST PERMIT",
      "GOODS PERMIT",
    ];

    const seen = new Set();
    return [...fromConstants, ...fallback].filter((v) => {
      const k = norm(v);
      if (!k || seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  }, []);

  // ✅ Required fields (keep minimal but matching portal feel)
  const required = useMemo(() => {
    return {
      vehicleNo: true,
      chassisNo: true,
      ownerName: true,
      mobileNo: true,
      fromState: true,

      vehicleType: true,
      vehicleClass: true,
      permitType: true,
      serviceType: true,

      // shown in your screenshots
      grossVehicleWeight: true,
      permitValidity: false,

      vehicleCategory: true,

      districtName: true,
      checkpostName: true,

      taxMode: true,
      taxFromDate: true,
      taxUptoDate: true,

      mvTax: true,
      userCharge: true,
      taxTokenFee: true,
    };
  }, []);

  const star = (k) => (required[k] ? <sup>*</sup> : null);

  // ✅ computed total (MV + User + Token Fee)
  const computedTotal = useMemo(() => {
    const mv = Number(payLoad.mvTax || 0);
    const uc = Number(payLoad.userCharge || 0);
    const tf = Number(payLoad.taxTokenFee || 0);
    return mv + uc + tf;
  }, [payLoad.mvTax, payLoad.userCharge, payLoad.taxTokenFee]);

  useEffect(() => {
    setPayLoad((p) => ({ ...p, totalAmount: String(computedTotal || "") }));
  }, [computedTotal]);

  // ✅ Filtered checkposts (if you already have mapping like MP)
  const filteredCheckposts = useMemo(() => {
    const barrier = norm(payLoad.districtName);
    const list =
      fields?.telangana?.checkPostName ||
      fields?.telangana?.checkposts ||
      fields?.checkPostName ||
      [];
    if (!barrier) return [];
    return list
      .filter((c) => norm(c?.borderBarrier || c?.districtName) === barrier)
      .map((c) => ({ name: c?.name }))
      .filter((c) => c.name);
  }, [payLoad.districtName]);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;

    setPayLoad((old) => {
      // reset dependent fields when vehicleType changes
      if (name === "vehicleType") {
        return {
          ...old,
          vehicleType: value,
          vehicleClass: "",
          vehicleCategory: "",
        };
      }

      // reset category when class changes
      if (name === "vehicleClass") {
        return { ...old, vehicleClass: value, vehicleCategory: "" };
      }

      // reset checkpost when district changes
      if (name === "districtName") {
        return { ...old, districtName: value, checkpostName: "" };
      }

      return { ...old, [name]: value };
    });
  };

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

        vehicleType: d.vehicleType || p.vehicleType,
        vehicleClass: d.vehicleClass || p.vehicleClass,
        vehicleCategory: d.vehicleCategory || p.vehicleCategory,
        permitType: d.permitType || p.permitType,
        serviceType: d.serviceType || p.serviceType,

        grossVehicleWeight: d.grossVehicleWeight || p.grossVehicleWeight,
        permitValidity: d.permitValidity || p.permitValidity,

        districtName: d.districtName || d.borderBarrier || p.districtName,
        checkpostName: d.checkpostName || d.checkPostName || p.checkpostName,
      }));
    }
  };

  const onResetHandler = () => {
    setPayLoad({
      vehicleNo: "",
      chassisNo: "",
      ownerName: "",
      mobileNo: "",
      fromState: "",

      vehicleType: "",
      vehicleClass: "",
      vehicleCategory: "",
      permitType: "",
      serviceType: "",

      grossVehicleWeight: "",
      seatingCapacityExcludingDriver: "",
      sleeperCapacityExcludingDriver: "",
      permitValidity: "",

      districtName: "",
      checkpostName: "",

      taxMode: "",
      paymentMode: "ONLINE",

      taxFromDate: "",
      taxUptoDate: "",

      mvTax: "",
      userCharge: "",
      taxTokenFee: "",

      totalAmount: "",
    });
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();

    const formData = {
      ...payLoad,
      state: stateKey,
      totalAmount: String(computedTotal || 0),
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
          <b>BORDER TAX PAYMENT FOR ENTRY INTO</b> <span>TELANGANA</span>
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
                  className="form__input w-100"
                  type="text"
                  id="mobileNo"
                  inputMode="tel"
                  maxLength="10"
                  minLength="10"
                  name="mobileNo"
                />
              </div>

              {/* Vehicle Type */}
              <div className="form__control">
                <label className="form__label d-block w-100 text-left" htmlFor="vehicleType">
                  Vehicle Type{star("vehicleType")}
                </label>
                <select
                  required={required.vehicleType}
                  value={payLoad.vehicleType}
                  onChange={onChangeHandler}
                  name="vehicleType"
                  id="vehicleType"
                  disabled={isLoading}
                >
                  <option value="">--Select Vehicle Type--</option>
                  {vehicleTypeOptions.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
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
                  {permitTypeOptions.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Gross Combination Weight (your screenshot shows this) */}
              <div className="form__control">
                <label className="form__label d-block w-100 text-left" htmlFor="grossVehicleWeight">
                  Gross Vehicle Weight (in Kg){star("grossVehicleWeight")}
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

            {/* RIGHT */}
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
                  {(fields?.fromState || []).map((t) => (
                    <option key={t.name} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Vehicle Class */}
              <div className="form__control">
                <label className="form__label d-block w-100 text-left" htmlFor="vehicleClass">
                  Vehicle Class{star("vehicleClass")}
                </label>
                <select
                  required={required.vehicleClass}
                  disabled={isLoading || !payLoad.vehicleType}
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

              {/* Vehicle Category */}
              <div className="form__control">
                <label className="form__label d-block w-100 text-left" htmlFor="vehicleCategory">
                  Vehicle Category{star("vehicleCategory")}
                </label>
                <select
                  required={required.vehicleCategory}
                  disabled={isLoading || !payLoad.vehicleClass}
                  value={payLoad.vehicleCategory}
                  onChange={onChangeHandler}
                  name="vehicleCategory"
                  id="vehicleCategory"
                >
                  <option value="">--Select Vehicle Category--</option>
                  {vehicleCategoryOptions.map((c) => (
                    <option key={c} value={c}>
                      {c}
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
                  value={payLoad.serviceType}
                  onChange={onChangeHandler}
                  name="serviceType"
                  id="serviceType"
                >
                  <option value="">--Select Service Type--</option>
                  {(fields?.telangana?.serviceType || fields?.serviceType || []).map((t) => (
                    <option key={t.name} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Permit Validity (seen in one screenshot flow) */}
              <div className="form__control">
                <label className="form__label d-block w-100 text-left" htmlFor="permitValidity">
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

          {/* Entry + Tax */}
          <div className="row mt-2">
            <div className="col-6">
              <div className="form__control">
                <label className="form__label d-block w-100 text-left" htmlFor="districtName">
                  Entry District Name{star("districtName")}
                </label>
                <select
                  required={required.districtName}
                  disabled={isLoading}
                  value={payLoad.districtName}
                  onChange={onChangeHandler}
                  name="districtName"
                  id="districtName"
                >
                  <option value="">--Select District--</option>
                  {(fields?.telangana?.borderBarrier || fields?.telangana?.districts || []).map((d) => (
                    <option key={d.name} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="col-6">
              <div className="form__control">
                <label className="form__label d-block w-100 text-left" htmlFor="checkpostName">
                  Entry CheckPost Name{star("checkpostName")}
                </label>
                <select
                  required={required.checkpostName}
                  disabled={isLoading || !payLoad.districtName}
                  value={payLoad.checkpostName}
                  onChange={onChangeHandler}
                  name="checkpostName"
                  id="checkpostName"
                >
                  <option value="">--Select Checkpost--</option>
                  {filteredCheckposts.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="row mt-2">
            <div className="col-4">
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
                  {(fields?.telangana?.taxMode || fields?.taxMode || []).map((t) => (
                    <option key={t.name} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="col-4">
              <div className="form__control">
                <label className="form__label d-block w-100 text-left" htmlFor="taxFromDate">
                  Tax From{star("taxFromDate")}
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

            <div className="col-4">
              <div className="form__control">
                <label className="form__label d-block w-100 text-left" htmlFor="taxUptoDate">
                  Tax Upto{star("taxUptoDate")}
                </label>
                <input
                  required={required.taxUptoDate}
                  disabled={isLoading}
                  className="form__input w-100"
                  type="date"
                  id="taxUptoDate"
                  name="taxUptoDate"
                  onChange={onChangeHandler}
                  value={payLoad.taxUptoDate}
                />
              </div>
            </div>
          </div>

          {/* TABLE (as per your second screenshot: MV Tax + User Charge + Tax Token Fee) */}
          <div className="row mt-3">
            <div className="col-12">
              <table className="hr-table">
                <thead>
                  <tr>
                    <th className="hr-table-1">S. No.</th>
                    <th className="hr-table-2">Tax/Fee Particulars</th>
                    <th>Tax From</th>
                    <th>Tax Upto</th>
                    <th>₹ Amount</th>
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
                    <td>{payLoad.taxFromDate || ""}</td>
                    <td>{payLoad.taxUptoDate || ""}</td>
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
                    <td className="pb-table-text">Tax Token Fee</td>
                    <td>{payLoad.taxFromDate || ""}</td>
                    <td>{payLoad.taxUptoDate || ""}</td>
                    <td className="input-box">
                      <center>
                        <input
                          required={required.taxTokenFee}
                          disabled={isLoading}
                          value={payLoad.taxTokenFee}
                          onChange={onChangeHandler}
                          name="taxTokenFee"
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
                <label className="form__label d-block w-100 text-left" htmlFor="totalAmount">
                  Total amount<sup>*</sup>
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

export default Telangana;
