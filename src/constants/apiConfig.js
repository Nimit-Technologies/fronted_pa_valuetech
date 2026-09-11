import { CREDENTIALS } from "./credentials.js";

const REQUIRED_CREDENTIALS = [
  { key: "BACKEND_URL", envVar: "VITE_SERVER_BASE_URL" },
  { key: "SERVER_PORT", envVar: "VITE_SERVER_PORT" },
  { key: "API_VERSION", envVar: "VITE_API_VERSION" },
];

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

export const apiConfig = Object.freeze({
  baseBackendUrl,
  apiBackendUrl,

  auth: defineEndpoints("auth", {
    login: "login",
    logout: "logout",
    session: "session",
  }),
  user: defineEndpoints("user", {
    getUserById: "",
    getAadhaarByEmployeeId: "aadhaar",
    createUser: "create-user",
  }),
  branch: defineEndpoints("branch", {
    getAllBranches: "all-branch",
    getBranchById: "",
    createBranch: "create-branch",
    updateBranch: "update",
    deleteBranch: "delete",
    softDeleteBranch: "soft-delete",
    updateBranchStatus: "status",
    restoreBranch: "restore",
  }),
});
