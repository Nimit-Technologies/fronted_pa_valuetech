// Promoted to the shared filter layer now that the branchAdmin department
// list filters the same `state.department` slice. Re-exported here so this
// feature's import path keeps working.
export {
  default,
  DEPARTMENT_FILTER_COLUMNS,
} from "@/hooks/filters/useDepartmentFilters";
