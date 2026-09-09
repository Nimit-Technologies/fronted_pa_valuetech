import axios from "axios";
import { CREDENTIALS } from "@/constants/credentials";
import { apiBackendUrl } from "@/constants/apiConfig";
import logger from "@/utils/logger";
import store from "@/store/store";
import { logout } from "@/features/auth/slice/authSlice";

// Routes that already render the login screen (see src/App.jsx) — don't
// force-redirect if we're already on one.
const PUBLIC_ROUTES = ["/", "/login"];

const api = axios.create({
  baseURL: apiBackendUrl,
  withCredentials: true,
  timeout: CREDENTIALS.API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — hook point for attaching an auth token if the
// backend ever needs one alongside the httpOnly cookie session.
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

// Guards against firing multiple redirects if a burst of concurrent
// requests (e.g. on page load) all come back 401 at once.
let isRedirectingToLogin = false;

// Response interceptor — centralizes auth-error handling so call sites
// don't each need to check for 401/403 themselves.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // Network failure, timeout, or the request was cancelled — no status
      // to branch on, but still worth surfacing instead of failing silently.
      logger.error("Network error or no response from server", error);
      return Promise.reject(error);
    }

    const { status } = error.response;

    if (status === 401) {
      const isPublicRoute = PUBLIC_ROUTES.includes(window.location.pathname);
      if (!isPublicRoute && !isRedirectingToLogin) {
        isRedirectingToLogin = true;
        logger.error("Unauthorized - redirecting to login", error);
        // Clear persisted auth state before the hard reload so the
        // freshly-loaded /login page doesn't rehydrate a stale
        // isAuthenticated: true and have to fire a redundant session check.
        store.dispatch(logout());
        window.location.href = "/";
      }
    }

    if (status === 403) {
      logger.error("Forbidden - insufficient permissions", error);
    }

    return Promise.reject(error);
  },
);

export default api;
