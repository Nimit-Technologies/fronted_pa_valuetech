import useColumnFilters from "@/hooks/filters/useColumnFilters";
import {
  EMPTY_ROLE_FILTERS,
  setRoleFilter,
  clearRoleFilter,
  clearRoleFilters,
} from "@/store/slice/role/roleSlice";

// Which columns of a role table can be filtered and how to read them off a
// raw role row. `label` must match the header text in that feature's
// roleTableHeader so the table can place the control in the right column —
// a table without a Branch column simply gets no Branch control. The list
// API flattens both relations onto the row, so a role's branch is present
// even when it is only reachable through its department.
//
// Shared rather than feature-local: the superAdmin and branchAdmin role
// lists read the same `state.role` slice, so one column map and one hook
// serve both tables.
export const ROLE_FILTER_COLUMNS = {
  department: {
    label: "Department",
    getId: (role) => role.department?.id ?? "",
    getLabel: (role) => role.department?.name ?? "",
  },
  branch: {
    label: "Branch",
    getId: (role) => role.branch?.id ?? "",
    getLabel: (role) => role.branch?.name ?? "",
  },
};

const selectRoleFilters = (state) => state.role.filters;

const useRoleFilters = () =>
  useColumnFilters({
    columns: ROLE_FILTER_COLUMNS,
    emptyFilters: EMPTY_ROLE_FILTERS,
    selectFilters: selectRoleFilters,
    setFilterAction: setRoleFilter,
    clearFilterAction: clearRoleFilter,
    clearAllAction: clearRoleFilters,
  });

export default useRoleFilters;
