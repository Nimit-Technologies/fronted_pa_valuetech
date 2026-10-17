import useColumnFilters from "@/hooks/filters/useColumnFilters";
import {
  EMPTY_USER_FILTERS,
  setUserFilter,
  clearUserFilter,
  clearUserFilters,
} from "@/store/slice/user/userSlice";

// Which columns of the user table can be filtered and how to read them off a
// raw user row. `label` must match the header text in userTableHeader so the
// table can place the control in the right column.
export const USER_FILTER_COLUMNS = {
  branch: {
    label: "Branch",
    getId: (user) => user.branch?.id ?? "",
    getLabel: (user) => user.branch?.name ?? "",
  },
  department: {
    label: "Department",
    getId: (user) => user.department?.id ?? "",
    getLabel: (user) => user.department?.name ?? "",
  },
  role: {
    label: "Role",
    getId: (user) => user.role?.id ?? "",
    getLabel: (user) => user.role?.name ?? "",
  },
};

const selectUserFilters = (state) => state.user.filters;

const useUserFilters = () =>
  useColumnFilters({
    columns: USER_FILTER_COLUMNS,
    emptyFilters: EMPTY_USER_FILTERS,
    selectFilters: selectUserFilters,
    setFilterAction: setUserFilter,
    clearFilterAction: clearUserFilter,
    clearAllAction: clearUserFilters,
  });

export default useUserFilters;
