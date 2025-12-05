import React, { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import ActionButtons from "../components/ActionButtons";
import Header from "../components/Header";
import Loader from "../components/Loader";
import { fields, LOCAL_STORAGE_KEY } from "../constants";
import { getDetailsApi } from "../utils/api";

const MadhyaPradesh = () => {
  const isLoggedIn = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "null");

  const state = "mp";
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
    grossVehicleWeight: "",
    unladenWeight: "",
    basicPermitValidity: "",
    fitnessValidity: "",
    insuranceValidity: "",
    taxValidity: "",
    floorArea: "",
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

  if (!isLoggedIn || !isLoggedIn.accessState || !isLoggedIn.accessState.includes(fields.stateName.mp)) {
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
                      {fields.mp?.vehiclePermitType?.map((type) => {
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
                    </select>
                  </div>
                </div>
              </div>
              {/* ... the rest of the original Madhya Pradesh markup stays identical ... */}
            </div>

            {/* right-side unchanged */}
            <div className="col-6">
              {/* copy the remaining markup from user's original file */}
            </div>
          </div>

          {/* =============== table, totals etc - keep as provided */}
        </form>
        <br />
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </>
  );
};

export default MadhyaPradesh;
