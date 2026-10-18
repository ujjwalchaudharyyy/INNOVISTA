import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { handleMockRequest } from "./mockBackend";

export const API_BASE = import.meta.env.VITE_API_URL || "";

// Detect if we're on a deployed site (not localhost/dev server)
const isLocalDev =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname.startsWith("192.168.") ||
    window.location.hostname.startsWith("10."));

// If deployed (no local dev server) AND no explicit backend URL configured → always use mock
const USE_MOCK = !isLocalDev && !API_BASE;

export const api = axios.create({
  baseURL: API_BASE ? `${API_BASE}/api` : "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Auth token interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("linkpulse_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // On deployed sites: intercept request and return mock data instantly
  if (USE_MOCK) {
    const mockResult = handleMockRequest({
      url: config.url,
      method: config.method,
      data: config.data,
      params: config.params,
    });

    if (mockResult) {
      config.adapter = (): Promise<AxiosResponse> =>
        Promise.resolve({
          data: mockResult.data,
          status: mockResult.status,
          statusText: "OK",
          headers: {},
          config: config as InternalAxiosRequestConfig,
        });
    }
  }

  return config;
});

// Response interceptor: handle errors + fallback to mock for local dev failures
api.interceptors.response.use(
  (response) => {
    // Even on local dev, if we get HTML back instead of JSON, fall back to mock
    if (
      !USE_MOCK &&
      typeof response.data === "string" &&
      response.data.includes("<!DOCTYPE") 
    ) {
      const mockResult = handleMockRequest({
        url: response.config.url,
        method: response.config.method,
        data: response.config.data,
        params: response.config.params,
      });
      if (mockResult) {
        return { ...response, data: mockResult.data, status: mockResult.status };
      }
    }
    return response;
  },
  (error) => {
    const config = error.config;

    // On local dev, if backend is down, fall back to mock
    if (!USE_MOCK && config && !config._mockRetried) {
      const status = error.response?.status;
      const isNetworkError = !error.response;
      const shouldMock = isNetworkError || status === 405 || status === 404;

      if (shouldMock) {
        config._mockRetried = true;
        const mockResult = handleMockRequest({
          url: config.url,
          method: config.method,
          data: config.data,
          params: config.params,
        });
        if (mockResult) {
          return { ...mockResult, headers: {}, config };
        }
      }
    }

    // 401 handling — logout if not on auth endpoints
    if (error.response?.status === 401) {
      if (
        !config?.url?.includes("/auth/login") &&
        !config?.url?.includes("/auth/register")
      ) {
        localStorage.removeItem("linkpulse_token");
        localStorage.removeItem("linkpulse_user");
        window.dispatchEvent(new Event("auth_logout"));
      }
    }

    return Promise.reject(error);
  }
);