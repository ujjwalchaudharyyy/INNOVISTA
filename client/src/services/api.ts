import axios from "axios";
import { handleMockRequest } from "./mockBackend";

export const API_BASE = import.meta.env.VITE_API_URL || "";

export const api = axios.create({
  baseURL: API_BASE ? `${API_BASE}/api` : "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Track whether real backend is available
let backendAlive: boolean | null = null;

async function checkBackend(): Promise<boolean> {
  if (backendAlive !== null) return backendAlive;
  try {
    const baseUrl = API_BASE || window.location.origin;
    const res = await fetch(`${baseUrl}/api/auth/me`, {
      method: "GET",
      signal: AbortSignal.timeout(2500),
    });
    // 401 means server is alive (just unauthenticated)
    backendAlive = res.status !== 404 && res.status !== 405;
  } catch {
    backendAlive = false;
  }
  return backendAlive;
}

// Auth token interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("linkpulse_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: on failure, try mock backend
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    // If this was already a mock retry, don't loop
    if (config?._mockRetried) {
      if (error.response?.status === 401) {
        if (!config.url?.includes("/auth/login") && !config.url?.includes("/auth/register")) {
          localStorage.removeItem("linkpulse_token");
          localStorage.removeItem("linkpulse_user");
          window.dispatchEvent(new Event("auth_logout"));
        }
      }
      return Promise.reject(error);
    }

    // Network error, 405, or 404 on API routes -> fallback to mock
    const status = error.response?.status;
    const isNetworkError = !error.response && error.message?.includes("Network Error");
    const shouldMock = isNetworkError || status === 405 || status === 404;

    if (shouldMock && config) {
      config._mockRetried = true;
      backendAlive = false; // Mark backend as down

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

    // Normal 401 handling
    if (status === 401) {
      if (!config?.url?.includes("/auth/login") && !config?.url?.includes("/auth/register")) {
        localStorage.removeItem("linkpulse_token");
        localStorage.removeItem("linkpulse_user");
        window.dispatchEvent(new Event("auth_logout"));
      }
    }

    return Promise.reject(error);
  }
);

// Pre-check backend on load; if down, install request interceptor for instant mock
checkBackend().then((alive) => {
  if (!alive) {
    // Backend is down — intercept ALL requests before they go out
    api.interceptors.request.use((config) => {
      const mockResult = handleMockRequest({
        url: config.url,
        method: config.method,
        data: config.data,
        params: config.params,
      });

      if (mockResult) {
        // Return a custom adapter that resolves immediately with mock data
        config.adapter = () =>
          Promise.resolve({
            data: mockResult.data,
            status: mockResult.status,
            statusText: "OK",
            headers: {},
            config,
          });
      }
      return config;
    });
  }
});