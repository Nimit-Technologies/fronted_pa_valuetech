export const CREDENTIALS = {
  APP_NAME: import.meta.env.VITE_APP_NAME,
  APP_DESCRIPTION: import.meta.env.VITE_APP_DESCRIPTION,
  ENVIRONMENT: import.meta.env.VITE_ENVIRONMENT,

  SERVER_PORT: import.meta.env.VITE_SERVER_PORT,
  BACKEND_URL: import.meta.env.VITE_SERVER_BASE_URL,
  API_TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT ?? 30000),
  API_VERSION: import.meta.env.VITE_API_VERSION,

  ENABLE_DEBUG_MODE: import.meta.env.VITE_ENABLE_DEBUG_MODE === "true",
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === "true",
  LOG_LEVEL: import.meta.env.VITE_LOG_LEVEL,
};
