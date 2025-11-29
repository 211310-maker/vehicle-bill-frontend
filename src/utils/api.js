import config from "../config/env";
import axios from "axios";
import { LOCAL_STORAGE_KEY } from "../constants";
const BASE_URL = config["API_BASE_URL"];
export const Urls = {
  login: BASE_URL + "/auth/login",
  getAcess: BASE_URL + "/auth/get-access",
  getUsers: BASE_URL + "/auth/admin/get-users",
  changeStatus: BASE_URL + "/auth/admin/block-unblock-user",
  getPageAccessLink: BASE_URL + "/auth/admin/page-access-link",
  provideAccess: BASE_URL + "/auth/admin/verify-otp",
  getDetails: BASE_URL + "/bill/get-details",
  createBill: BASE_URL + "/bill",
  allBills: BASE_URL + "/bill",
  deleteUser: BASE_URL + "/auth/admin/delete-user",
  addMoreAccessState: BASE_URL + "/auth/admin/add-state-access",
  webIndex: BASE_URL + "/auth/webindex",
};

export const getAcessApi = async (token) => {
  try {
    const { data } = await axios.get(`${Urls.getAcess}/${token}`);
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.response.data };
  }
};

export const getDetailsApi = async (payLoad) => {
  try {
    const user = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    const { data } = await axios.get(
      `${Urls.getDetails}?vehicleNo=${payLoad.vehicleNo}`,
      {
        headers: {
          "Content-type": "application/json",
          "x-auth-token": user.token,
        },
      }
    );
    return {
      data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error.response.data,
    };
  }
};
export const getAllBillsApi = async (filter) => {
  try {
    const finalUrl = filter ? `${Urls.allBills}?${filter}` : Urls.allBills;
    const user = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    const { data } = await axios.get(`${finalUrl}`, {
      headers: {
        "Content-type": "application/json",
        "x-auth-token": user.token,
      },
    });
    return {
      data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error.response.data,
    };
  }
};

export const createTempUserApi = async () => {
  try {
    const user = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    const { data } = await axios.get(Urls.getPageAccessLink, {
      headers: {
        "Content-type": "application/json",
        "x-auth-token": user.token,
      },
    });
    return {
      data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error.response.data,
    };
  }
};
export const createBillApi = async (payLoad) => {
  try {
    const user = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    const { data } = await axios.post(Urls.createBill, payLoad, {
      headers: {
        "Content-type": "application/json",
        "x-auth-token": user.token,
      },
    });
    return {
      data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error.response.data,
    };
  }
};
export const provideAccessApi = async (payLoad) => {
  try {
    const user = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    const { data } = await axios.post(Urls.provideAccess, payLoad, {
      headers: {
        "Content-type": "application/json",
        "x-auth-token": user.token,
      },
    });
    return {
      data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error.response.data,
    };
  }
};

export const getAllUsersApi = async () => {
  try {
    const user = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    const { data } = await axios.get(Urls.getUsers, {
      headers: {
        "Content-type": "application/json",
        "x-auth-token": user.token,
      },
    });
    return {
      data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error.response.data,
    };
  }
};

export const changeStatusApi = async (id) => {
  try {
    const user = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    const { data } = await axios.post(
      Urls.changeStatus,
      { id },
      {
        headers: {
          "Content-type": "application/json",
          "x-auth-token": user.token,
        },
      }
    );
    return {
      data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error.response.data,
    };
  }
};
export const loginApi = async (payLoad) => {
  try {
    const { data } = await axios.post(Urls.login, payLoad, {
      headers: {
        "Content-type": "application/json",
      },
    });
    return {
      data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error.response.data,
    };
  }
};

export const deleteUserApi = async (id) => {
  try {
    const user = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    const { data } = await axios.delete(Urls.deleteUser + `/${id}`, {
      headers: {
        "Content-type": "application/json",
        "x-auth-token": user.token,
      },
    });
    return {
      data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error.response.data,
    };
  }
};
export const addMoreAccessStateApi = async (payload) => {
  try {
    const user = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    const { data } = await axios.post(Urls.addMoreAccessState, payload, {
      headers: {
        "Content-type": "application/json",
        "x-auth-token": user.token,
      },
    });

    return {
      data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error.response.data,
    };
  }
};
export const webIndexApi = async (payload) => {
  try {
    const user = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    const { data } = await axios.post(Urls.webIndex, payload, {
      headers: {
        "Content-type": "application/json",
      },
    });

    return {
      data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error.response.data,
    };
  }
};
