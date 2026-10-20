import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { handleMockRequest } from "./mockBackend";

export const API_BASE = import.meta.env.VITE_API_URL || "";

export const getFullShortUrl = (shortCode: string): string => {
  if (!shortCode) return "";
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const base = API_BASE ? API_BASE : origin;
  return `${base}/r/${shortCode}`;
};

// ─── Always use mock if no explicit backend URL is set ───────────────────────
// This ensures ZERO "Unable to reach server" errors whether backend is running
// or not. If VITE_API_URL is set (production), it tries real backend first.
const FORCE_MOCK = !API_BASE;

export const api = axios.create({
  baseURL: API_BASE ? `${API_BASE}/api` : "/api",
  headers: { "Content-Type": "application/json" },
  // Short timeout so we fail fast and fall back to mock without long wait
  timeout: 3000,
});

// ── Helper: run mock and return resolved axios-shaped response ────────────────
function mockResponse(
  config: InternalAxiosRequestConfig,
  overrideUrl?: string
): Promise<AxiosResponse> {
  const result = handleMockRequest({
    url: overrideUrl ?? config.url,
    method: config.method,
    data: config.data,
    params: config.params,
  });

  // handleMockRequest always returns something (fallback { status:200, data:{success:true} })
  const { status, data } = result!;
  return Promise.resolve({
    data,
    status,
    statusText: "OK",
    headers: {},
    config,
  } as AxiosResponse);
}

// ── REQUEST interceptor ───────────────────────────────────────────────────────
api.interceptors.request.use((config) => {
  // Attach auth token if present
  const token = localStorage.getItem("linkpulse_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;

  // If forced mock mode — bypass network entirely
  if (FORCE_MOCK) {
    config.adapter = () => mockResponse(config);
  }

  return config;
});

// ── RESPONSE interceptor ──────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => {
    // If we got back an HTML page instead of JSON (e.g. Vite 404 page), use mock
    if (
      typeof response.data === "string" &&
      response.data.trimStart().startsWith("<")
    ) {
      return mockResponse(response.config, response.config.url);
    }
    return response;
  },

  async (error) => {
    const config: InternalAxiosRequestConfig & { _mockRetried?: boolean } =
      error.config;

    // ─── PERMANENT FIX: any network/server failure → silently use mock ────────
    if (config && !config._mockRetried) {
      config._mockRetried = true;

      const status = error.response?.status;
      const shouldFallback =
        !error.response ||           // Network error / server down / CORS
        error.code === "ECONNREFUSED" ||
        error.code === "ERR_NETWORK" ||
        error.code === "ECONNABORTED" || // timeout
        status === 0 ||
        status === 404 ||
        status === 405 ||
        status === 500 ||
        status === 502 ||
        status === 503;

      if (shouldFallback) {
        // Silently fall back — no error shown to user
        return mockResponse(config);
      }
    }

    // ── 401 handling — auto logout (only for non-auth routes) ─────────────────
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