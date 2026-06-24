import axios, { AxiosError, AxiosRequestConfig } from "axios";

import { getStorageItemAsync, setStorageItemAsync } from "@ttm/storage";

import { isTokenExpiredError } from "../utils/errors";

let globalLogout: (() => void) | null = null;

export const setGlobalLogout = (logoutFn: () => void) => {
  globalLogout = logoutFn;
};

const performAutoLogout = () => {
  if (globalLogout) {
    console.log("Auto-logout triggered");
    globalLogout();
  } else {
    console.warn("Global logout function not set");
  }
};

// Configuration management
const config = {
  // there is no setting apiEndpoint here anymore. I keeping it as default for the bootstraping purpose. The baseUrl will come from the app itself. Don't touch this file.
  // make sure all the apps/* have their own .env file with the correct baseUrl
  apiEndpoint: "http://localhost:8000/v1",
  timeout: 20000,
};

export const axiosClient = axios.create({
  baseURL: config.apiEndpoint,
  timeout: config.timeout,
  withCredentials: true,
});

axiosClient.interceptors.request.use(
  async (config) => {
    const accessToken = await getStorageItemAsync("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

const handleUnauthorizedError = async (originalRequest: AxiosRequestConfig) => {
  const refreshToken = await getStorageItemAsync("refreshToken");
  console.log(refreshToken);
  if (!refreshToken) {
    console.error("Refresh token not available - triggering logout");
    performAutoLogout();
    return Promise.reject("Refresh token not available.");
  }

  try {
    const response = await axiosClient.post(
      "/rest-auth/token/refresh/",
      {
        refresh: refreshToken,
      },
      {
        withCredentials: false,
      },
    );

    const { access, refresh } = response.data;
    await setStorageItemAsync("accessToken", access);
    await setStorageItemAsync("refreshToken", refresh);
    originalRequest.headers.Authorization = `Bearer ${access}`;

    return axiosClient(originalRequest);
  } catch (err) {
    console.error("Error during token refresh:", err);
    // TODO: Logout the user, need a pipeline what works on both web and mobile
    performAutoLogout();
    return Promise.reject(err);
  }
};

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if it's a token expired error and if we haven't already retried the request
    if (
      isTokenExpiredError(error) &&
      !originalRequest?.retry &&
      originalRequest.url !== "/rest-auth/token/refresh/"
    ) {
      originalRequest.retry = true; // Mark it so we don't end up in an infinite loop. We are manually adding this to the request config
      return handleUnauthorizedError(originalRequest);
    }

    if (error.response?.status === 401 || error.response?.status === 403) {
      console.error("Unauthorized access - triggering logout");
      performAutoLogout();
    }

    // Detailed error handling based on status code, etc.
    if (error.response) {
      // Handle HTTP response errors
      // TODO: Add sentry logging
      console.error(
        `API Error: ${error.response.status}:`,
        error.response.data,
      );
    } else if (error.request) {
      // Handle no response was received
      console.error("API No Response Error:", error.request);
    } else {
      // Handle setup errors
      console.error("API Configuration Error:", error.message);
    }

    // TODO: Logout the user, need a pipeline what works on both web and mobile
    return Promise.reject({
      status: error.response?.status,
      data: error.response?.data,
    });
  },
);

axiosClient.interceptors.response.use((response) => {
  return response;
});

axiosClient.interceptors.request.use(
  (config) => {
    if (config.data) {
      console.info("requestData:", config.data);
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);
