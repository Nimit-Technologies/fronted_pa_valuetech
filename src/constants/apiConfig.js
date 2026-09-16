import { CREDENTIALS } from "./credentials.js";

const REQUIRED_CREDENTIALS = [{ key: "API_URL", envVar: "VITE_API_URL" }];

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

// Strip any trailing slash(es) so defineEndpoints' `${apiBackendUrl}/${resource}`
// never produces a double slash regardless of how VITE_API_URL is set.
export const apiBackendUrl = CREDENTIALS.API_URL.replace(/\/+$/, "");

function defineEndpoints(resource, actions) {
  const resourceBaseUrl = `${apiBackendUrl}/${resource}`;
  const endpoints = { baseUrl: resourceBaseUrl };

  for (const [action, path] of Object.entries(actions)) {
    endpoints[action] = path ? `${resourceBaseUrl}/${path}` : resourceBaseUrl;
  }

  return Object.freeze(endpoints);
}

export const apiConfig = Object.freeze({
  apiBackendUrl,

  auth: defineEndpoints("auth", {
    login: "login",
    logout: "logout",
    session: "session",
  }),
  user: defineEndpoints("user", {
    getAllUser: "all-user",
    getUserById: "",
    createUser: "create-user",
    updateUser: "update",
    updateProfile: "profile",
    deleteUser: "delete",
    softDeleteUser: "soft-delete",
    updateUserStatus: "status",
    restoreUser: "restore",
    getAadhaarByEmployeeId: "aadhaar",
  }),
  branch: defineEndpoints("branch", {
    getAllBranches: "all-branch",
    createBranch: "create-branch",
    updateBranch: "update",
    deleteBranch: "delete",
    softDeleteBranch: "soft-delete",
    updateBranchStatus: "status",
    restoreBranch: "restore",
  }),
  department: defineEndpoints("department", {
    getAllDepartment: "all-department",
    createDepartment: "create-department",
    updateDepartment: "update",
    deleteDepartment: "delete",
    softDeleteDepartment: "soft-delete",
    updateDepartmentStatus: "status",
    restoreDepartment: "restore",
  }),
  role: defineEndpoints("role", {
    getAllRole: "all-role",
    createRole: "create-role",
    updateRole: "update",
    deleteRole: "delete",
    softDeleteRole: "soft-delete",
    updateRoleStatus: "status",
    restoreRole: "restore",
  }),
  dashboard: defineEndpoints("dashboard", {
    superAdminSummary: "super-admin",
  }),
});
