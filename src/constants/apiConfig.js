import { CREDENTIALS } from "./credentials.js";

/**
 * Environment variables the API layer cannot function without. `key` is the
 * resolved field on CREDENTIALS; `envVar` is the underlying Vite env var
 * name, surfaced in the error so it points straight at the .env file.
 */
const REQUIRED_CREDENTIALS = [
  { key: "BACKEND_URL", envVar: "VITE_SERVER_BASE_URL" },
  { key: "SERVER_PORT", envVar: "VITE_SERVER_PORT" },
  { key: "API_VERSION", envVar: "VITE_API_VERSION" },
];

/**
 * Fails fast (at import time) if any required backend env var is missing,
 * rather than letting the app boot with a broken/undefined API base URL.
 */
function assertRequiredCredentials() {
  const missing = REQUIRED_CREDENTIALS.filter(({ key }) => !CREDENTIALS[key]);

  if (missing.length > 0) {
    const missingList = missing.map(({ envVar }) => envVar).join(", ");
    throw new Error(
      `[apiConfig] Missing required environment variable(s): ${missingList}. ` +
        "Check your .env file and ensure they are set before building.",
    );
  }
}

assertRequiredCredentials();

export const baseBackendUrl = `${CREDENTIALS.BACKEND_URL}:${CREDENTIALS.SERVER_PORT}`;
export const apiBackendUrl = `${baseBackendUrl}/${CREDENTIALS.API_VERSION}`;

function defineEndpoints(resource, actions) {
  const resourceBaseUrl = `${apiBackendUrl}/${resource}`;
  const endpoints = { baseUrl: resourceBaseUrl };

  for (const [action, path] of Object.entries(actions)) {
    endpoints[action] = path ? `${resourceBaseUrl}/${path}` : resourceBaseUrl;
  }

  return Object.freeze(endpoints);
}

/**
 * Central, immutable registry of backend endpoints grouped by resource.
 * Add new resource groups here (via `defineEndpoints`) rather than building
 * ad-hoc URL strings at call sites.
 */
export const apiConfig = Object.freeze({
  baseBackendUrl,
  apiBackendUrl,

  auth: defineEndpoints("auth", {
    login: "login",
    logout: "logout",
    session: "session",
  }),
});
