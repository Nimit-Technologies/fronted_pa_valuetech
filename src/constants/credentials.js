export const CREDENTIALS = {
  // application configuration
  APP_NAME: import.meta.env.VITE_APP_NAME,
  APP_DESCRIPTION: import.meta.env.VITE_APP_DESCRIPTION,
  ENVIRONMENT: import.meta.env.VITE_ENVIRONMENT,

  // backend configuration
  // (the full base URL, e.g. "http://localhost:5000/api/v1", is built once
  // in src/constants/apiConfig.js — see baseBackendUrl there)
  SERVER_PORT: import.meta.env.VITE_SERVER_PORT,
  BACKEND_URL: import.meta.env.VITE_SERVER_BASE_URL,
  API_TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT ?? 30000),
  API_VERSION: import.meta.env.VITE_API_VERSION,

  // debugging and analytics
  ENABLE_DEBUG_MODE: import.meta.env.VITE_ENABLE_DEBUG_MODE === "true",
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === "true",
  LOG_LEVEL: import.meta.env.VITE_LOG_LEVEL,

  // NOTE: no auth token/cookie config here on purpose. The session is a
  // backend-set httpOnly cookie the JS never reads or names — see
  // src/utils/axiosInstance.js (withCredentials) and the backend's
  // constant/cookie-option.js.
};
