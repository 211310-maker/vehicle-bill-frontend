import config from "../config/env";
import axios from "axios";
import { LOCAL_STORAGE_KEY } from "../constants";

/**
 * Determine base API URL:
 * - Prefer REACT_APP_API_BASE_URL from config
 * - If not set, fallback to current origin (window.location.origin)
 * - If page is loaded over https and BASE_URL starts with http, normalize to https
 */
let BASE_URL = (config["API_BASE_URL"] || "").replace(/\/$/, "");

if (typeof window !== "undefined") {
  if (!BASE_URL) {
    // fall back to same origin to avoid mixed content issues
    BASE_URL = window.location.origin;
    console.warn("API_BASE_URL not provided — falling back to window.location.origin:", BASE_URL);
  } else if (window.location.protocol === "https:" && BASE_URL.startsWith("http://")) {
    // avoid mixed-content by normalizing to https when page is https
    BASE_URL = BASE_URL.replace(/^http:\/\//i, "https://");
    console.warn("Normalized API_BASE_URL to https to avoid mixed-content:", BASE_URL);
  }
}

// Create an axios instance with baseURL
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper: safely read token and return auth headers (no throw)
const getAuthHeaders = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return {};
    const user = JSON.parse(raw);
    if (user && user.token) {
      return { "x-auth-token": user.token };
    }
    return {};
  } catch (err) {
    console.warn("Failed to read auth token from localStorage:", err);
    return {};
  }
};

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

const normalizeError = (error) => {
  let errData = { message: "Network error" };
  try {
    if (error && error.response && error.response.data) {
      errData = error.response.data;
    } else if (error && error.message) {
      errData = { message: error.message };
    }
  } catch (e) {
    errData = { message: "Network error" };
  }
  return errData;
};

export const getAcessApi = async (token) => {
  try {
    const { data } = await axiosInstance.get(`${Urls.getAcess}/${token}`);
    return { data, error: null };
  } catch (error) {
    const errData = normalizeError(error);
    console.error("getAcessApi error:", errData, error);
    return { data: null, error: errData };
  }
};

export const getDetailsApi = async (payLoad) => {
  try {
    const headers = { ...getAuthHeaders() };
    const { data } = await axiosInstance.get(`${Urls.getDetails}?vehicleNo=${payLoad.vehicleNo}`, {
      headers,
    });
    return { data, error: null };
  } catch (error) {
    return { data: null, error: normalizeError(error) };
  }
};

export const getAllBillsApi = async (filter) => {
  try {
    const finalUrl = filter ? `${Urls.allBills}?${filter}` : Urls.allBills;
    const headers = { ...getAuthHeaders() };
    const { data } = await axiosInstance.get(finalUrl, { headers });
    return { data, error: null };
  } catch (error) {
    return { data: null, error: normalizeError(error) };
  }
};

export const createTempUserApi = async () => {
  try {
    const headers = { ...getAuthHeaders() };
    const { data } = await axiosInstance.get(Urls.getPageAccessLink, { headers });
    return { data, error: null };
  } catch (error) {
    return { data: null, error: normalizeError(error) };
  }
};

export const createBillApi = async (payLoad) => {
  try {
    const headers = { ...getAuthHeaders() };
    const { data } = await axiosInstance.post(Urls.createBill, payLoad, { headers });
    return { data, error: null };
  } catch (error) {
    return { data: null, error: normalizeError(error) };
  }
};

export const provideAccessApi = async (payLoad) => {
  try {
    const headers = { ...getAuthHeaders() };
    const { data } = await axiosInstance.post(Urls.provideAccess, payLoad, { headers });
    return { data, error: null };
  } catch (error) {
    return { data: null, error: normalizeError(error) };
  }
};

export const getAllUsersApi = async () => {
  try {
    const headers = { ...getAuthHeaders() };
    const { data } = await axiosInstance.get(Urls.getUsers, { headers });
    return { data, error: null };
  } catch (error) {
    return { data: null, error: normalizeError(error) };
  }
};

export const changeStatusApi = async (id) => {
  try {
    const headers = { ...getAuthHeaders() };
    const { data } = await axiosInstance.post(Urls.changeStatus, { id }, { headers });
    return { data, error: null };
  } catch (error) {
    return { data: null, error: normalizeError(error) };
  }
};

export const loginApi = async (payLoad) => {
  try {
    const { data } = await axiosInstance.post(Urls.login, payLoad);
    return { data, error: null };
  } catch (error) {
    return { data: null, error: normalizeError(error) };
  }
};

export const deleteUserApi = async (id) => {
  try {
    const headers = { ...getAuthHeaders() };
    const { data } = await axiosInstance.delete(`${Urls.deleteUser}/${id}`, { headers });
    return { data, error: null };
  } catch (error) {
    return { data: null, error: normalizeError(error) };
  }
};

export const addMoreAccessStateApi = async (payload) => {
  try {
    const headers = { ...getAuthHeaders() };
    const { data } = await axiosInstance.post(Urls.addMoreAccessState, payload, { headers });
    return { data, error: null };
  } catch (error) {
    return { data: null, error: normalizeError(error) };
  }
};

export const webIndexApi = async (payload) => {
  try {
    const headers = { ...getAuthHeaders() };
    const { data } = await axiosInstance.post(Urls.webIndex, payload, { headers });
    return { data, error: null };
  } catch (error) {
    return { data: null, error: normalizeError(error) };
  }
};
