// Public surface of the superAdmin feature (CLAUDE.md §3.1): the only things
// another feature may import. Anything not re-exported here is internal.
//
// Pages and the layout are deliberately absent. The router lazy-imports those
// directly so each one keeps its own chunk; re-exporting them here would pull
// the whole feature into any chunk that touches this barrel.

// Shared presentation reused by other role dashboards.
export { default as SuperAdminCard } from "./components/SuperAdminCard";

// Dashboard summary.
export { default as useSuperAdminSummary } from "./hooks/dashboard/useSuperAdminSummary";

// User reads. Writes stay internal to this feature's own screens.
export { default as useGetUserById } from "./hooks/user/useGetUserById";
export { default as useGetAadhaarByEmployeeId } from "./hooks/user/useGetAadhaarByEmployeeId";
export { default as allUser } from "./services/user/allUser";
export { default as getUserById } from "./services/user/getUserById";

// Reference lists other features populate dropdowns and tables from.
export { default as allDepartments } from "./services/department/allDepartments";
export { default as allRole } from "./services/role/allRole";

// Business types are owned by this feature; the slice is registered in the
// root store, and the selectors are the supported way to read it.
export { default as businessReducer } from "./slice/business/businessSlice";
export * from "./slice/business/businessSelectors";
