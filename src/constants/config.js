/**
 * Application-wide constants and configuration
 */

export const APP_NAME = import.meta.env.VITE_APP_NAME || "PA ValueTech";
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || "1.0.0";

export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://api.valuetech.com",
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || "30000", 10),
};

export const FEATURE_FLAGS = {
  debug: import.meta.env.VITE_ENABLE_DEBUG_MODE === "true",
  analytics: import.meta.env.VITE_ENABLE_ANALYTICS === "true",
};

export const AUTH_CONFIG = {
  cookieName: import.meta.env.VITE_AUTH_COOKIE_NAME || "__auth",
  tokenStorage: import.meta.env.VITE_AUTH_TOKEN_STORAGE || "localStorage",
};

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
};

export const ROUTES = {
  HOME: "/",
  SUPER_ADMIN: "/super-admin",
  BRANCH: "/super-admin/branch",
  BRANCH_ADMIN: "/super-admin/branch-admin",
  USER_PROFILE: "/super-admin/user-profile",
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
};

/**
 * Error messages for user display
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection and try again.",
  SERVER_ERROR: "Server error. Please try again later.",
  UNAUTHORIZED: "Your session has expired. Please log in again.",
  FORBIDDEN: "You do not have permission to perform this action.",
  NOT_FOUND: "The requested resource was not found.",
  VALIDATION_ERROR: "Please check your input and try again.",
};

export const SUCCESS_MESSAGES = {
  CREATED: "Resource created successfully.",
  UPDATED: "Resource updated successfully.",
  DELETED: "Resource deleted successfully.",
  SAVED: "Changes saved successfully.",
};
