import { CREDENTIALS } from "./credentials.js";

if (!CREDENTIALS.BACKEND_URL) {
  throw new Error(
    "[apiConfig] VITE_SERVER_BASE_URL is not defined. " +
      "Check your .env file and ensure the variable is set before building.",
  );
}
if (!CREDENTIALS.SERVER_PORT) {
  throw new Error(
    "[apiConfig] VITE_SERVER_PORT is not defined. " +
      "Check your .env file and ensure the variable is set before building.",
  );
}
if (!CREDENTIALS.API_VERSION) {
  throw new Error(
    "[apiConfig] VITE_API_VERSION is not defined. " +
      "Check your .env file and ensure the variable is set before building.",
  );
}

// Single source of truth for the backend's base URL — every request goes
// through the shared axios instance (src/utils/axiosInstance.js) as a
// relative path (e.g. "/auth/login") against this baseURL.
export const baseBackendUrl = `${CREDENTIALS.BACKEND_URL}:${CREDENTIALS.SERVER_PORT}/${CREDENTIALS.API_VERSION}`;

// export apiEndPoints = {
//   baseBackendUrl,
//   auth:{
//     login:baseBackendUrl/
//   }
// }
