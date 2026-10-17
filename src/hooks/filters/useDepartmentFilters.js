import useColumnFilters from "@/hooks/filters/useColumnFilters";
import {
  EMPTY_DEPARTMENT_FILTERS,
  setDepartmentFilter,
  clearDepartmentFilter,
  clearDepartmentFilters,
} from "@/store/slice/department/departmentSlice";

// Which columns of a department table can be filtered and how to read them
// off a raw department row. `label` must match the header text in that
// feature's DepartmentTableHeader so the table can place the control in the
// right column. The list API includes `branch: { id, name }` on every row.
//
// Shared rather than feature-local: the superAdmin and branchAdmin
// department lists read the same `state.department` slice, so one column map
// and one hook serve both tables.
export const DEPARTMENT_FILTER_COLUMNS = {
  branch: {
    label: "Branch",
    getId: (department) => department.branch?.id ?? "",
    getLabel: (department) => department.branch?.name ?? "",
  },
};

const selectDepartmentFilters = (state) => state.department.filters;

const useDepartmentFilters = () =>
  useColumnFilters({
    columns: DEPARTMENT_FILTER_COLUMNS,
    emptyFilters: EMPTY_DEPARTMENT_FILTERS,
    selectFilters: selectDepartmentFilters,
    setFilterAction: setDepartmentFilter,
    clearFilterAction: clearDepartmentFilter,
    clearAllAction: clearDepartmentFilters,
  });

export default useDepartmentFilters;
