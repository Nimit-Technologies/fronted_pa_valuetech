import axios from "axios";
import { CREDENTIALS } from "@/constants/credentials";
import logger from "@/utils/logger";
import store from "@/store/store";
import { logout } from "@/features/auth/slice/authSlice";

// Routes that already render the login screen (see src/App.jsx) — don't
// force-redirect if we're already on one.
const PUBLIC_ROUTES = ["/", "/login"];

// No baseURL here: every call site passes a full absolute URL already built
// from apiConfig (see src/constants/apiConfig.js), and axios ignores baseURL
// whenever the request URL is absolute.
const api = axios.create({
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

// Only methods that can be repeated without changing anything. A retried POST
// creates a second case; a retried PATCH re-applies an edit over someone
// else's. Those failures belong to the user to retry deliberately, which is
// why there is no "retry everything" switch here.
const RETRYABLE_METHODS = new Set(["get", "head", "options"]);

const MAX_RETRIES = 2;
const RETRY_BASE_DELAY_MS = 300;

// Worth another attempt: the request never reached a server (network drop,
// timeout), or the server failed in a way that is plausibly transient.
//
// 429 is deliberately excluded. Retrying a rate limit is what produced it;
// the user is told to wait instead (see extractErrorMessage, which surfaces
// the API's own "too many attempts" wording).
const isTransient = (error) => {
  if (!error.response) return true;
  return error.response.status >= 500;
};

// Exponential, with jitter so that a burst of requests failing together does
// not retry in lockstep and hit the recovering server as another spike.
const retryDelay = (attempt) => {
  const backoff = RETRY_BASE_DELAY_MS * 2 ** (attempt - 1);
  return backoff + Math.random() * RETRY_BASE_DELAY_MS;
};

const sleep = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const shouldRetry = (error) => {
  const config = error.config;
  if (!config) return false;
  if (!RETRYABLE_METHODS.has((config.method || "get").toLowerCase())) {
    return false;
  }
  if (!isTransient(error)) return false;

  return (config.retryCount ?? 0) < MAX_RETRIES;
};

// Response interceptor — centralizes retry and auth-error handling so call
// sites don't each need to check for 401/403 themselves.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (shouldRetry(error)) {
      const config = error.config;
      config.retryCount = (config.retryCount ?? 0) + 1;

      logger.warn(
        `Retrying ${config.method?.toUpperCase()} ${config.url} ` +
          `(attempt ${config.retryCount} of ${MAX_RETRIES})`,
      );

      await sleep(retryDelay(config.retryCount));
      return api.request(config);
    }

    if (!error.response) {
      // Network failure, timeout, or the request was cancelled — no status
      // to branch on, but still worth surfacing instead of failing silently.
      // Retries are already exhausted by this point.
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
      logger.error("Forbidden - insufficient permissions ", error);
    }

    return Promise.reject(error);
  },
);

export default api;
