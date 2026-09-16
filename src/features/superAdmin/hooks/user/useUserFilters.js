import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  EMPTY_USER_FILTERS,
  setUserFilter,
  clearUserFilter,
  clearUserFilters,
} from "@/features/superAdmin/slice/user/userSlice";

// Which columns can be filtered and how to read them off a raw user row.
// `label` must match the header text in userTableHeader so the table can
// place the control in the right column.
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

// Distinct values of one column across `rows`, ready for ColumnFilter.
export const buildFilterOptions = (rows, column) => {
  const { getId, getLabel } = USER_FILTER_COLUMNS[column];
  const seen = new Map();
  for (const row of rows) {
    const id = getId(row);
    if (!id || seen.has(id)) continue;
    seen.set(id, { value: id, label: getLabel(row) || "N/A" });
  }
  return [...seen.values()].sort((a, b) => a.label.localeCompare(b.label));
};

// Keeps a row only if every filtered column includes the row's value.
export const applyUserFilters = (rows, filters = EMPTY_USER_FILTERS) =>
  rows.filter((row) =>
    Object.entries(USER_FILTER_COLUMNS).every(([column, { getId }]) => {
      const selected = filters?.[column];
      return selected == null || selected.includes(getId(row));
    }),
  );

const useUserFilters = () => {
  const dispatch = useDispatch();
  const filters = useSelector(
    (state) => state.user.filters ?? EMPTY_USER_FILTERS,
  );

  const setFilter = useCallback(
    (column, values) => dispatch(setUserFilter({ column, values })),
    [dispatch],
  );
  const clearFilter = useCallback(
    (column) => dispatch(clearUserFilter(column)),
    [dispatch],
  );
  const clearAll = useCallback(() => dispatch(clearUserFilters()), [dispatch]);

  const activeColumns = useMemo(
    () =>
      Object.keys(USER_FILTER_COLUMNS).filter((column) =>
        Array.isArray(filters[column]),
      ),
    [filters],
  );

  return {
    filters,
    setFilter,
    clearFilter,
    clearAll,
    activeColumns,
    isFiltered: activeColumns.length > 0,
  };
};

export default useUserFilters;
