import axios from "axios";

export const API_BASE = "http://localhost:5000";

export const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("linkpulse_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (!error.config.url.includes("/auth/login") && !error.config.url.includes("/auth/register")) {
        localStorage.removeItem("linkpulse_token");
        localStorage.removeItem("linkpulse_user");
        window.dispatchEvent(new Event("auth_logout"));
      }
    }
    return Promise.reject(error);
  }
);