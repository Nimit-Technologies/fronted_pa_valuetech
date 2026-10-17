// Promoted to the shared filter layer now that the branchAdmin role list
// filters the same `state.role` slice. Re-exported here so this feature's
// import path keeps working.
export { default, ROLE_FILTER_COLUMNS } from "@/hooks/filters/useRoleFilters";
