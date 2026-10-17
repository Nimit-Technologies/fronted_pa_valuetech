import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  applyColumnFilters,
  buildColumnFilterProps,
} from "@/utils/table/columnFilters";

// Binds one feature's column-filter state in the store to the Excel-style
// ColumnFilter controls in its table. Each feature wraps this in its own
// `use<Feature>Filters` hook that supplies the column map and that slice's
// filter actions — see useUserFilters, useDepartmentFilters, useRoleFilters.
//
// `columns`, `emptyFilters`, `selectFilters` and the three action creators
// must be module constants: the callbacks returned here are memoised on
// them, and the list pages feed those callbacks into their own useMemo.
const useColumnFilters = ({
  columns,
  emptyFilters,
  selectFilters,
  setFilterAction,
  clearFilterAction,
  clearAllAction,
}) => {
  const dispatch = useDispatch();
  const filters = useSelector(selectFilters) ?? emptyFilters;

  const setFilter = useCallback(
    (column, values) => dispatch(setFilterAction({ column, values })),
    [dispatch, setFilterAction],
  );

  const clearFilter = useCallback(
    (column) => dispatch(clearFilterAction(column)),
    [dispatch, clearFilterAction],
  );

  const clearAll = useCallback(
    () => dispatch(clearAllAction()),
    [dispatch, clearAllAction],
  );

  // Both of these walk every loaded row, so the pages memoise the result on
  // the row array and on these callbacks rather than calling them inline.
  const apply = useCallback(
    (rows) => applyColumnFilters(rows, filters, columns),
    [filters, columns],
  );

  const buildProps = useCallback(
    (rows) =>
      buildColumnFilterProps({ rows, filters, columns, onChange: setFilter }),
    [filters, columns, setFilter],
  );

  const activeColumns = useMemo(
    () =>
      Object.keys(columns).filter((column) => Array.isArray(filters[column])),
    [columns, filters],
  );

  return {
    columns,
    filters,
    setFilter,
    clearFilter,
    clearAll,
    apply,
    buildProps,
    activeColumns,
    isFiltered: activeColumns.length > 0,
  };
};

export default useColumnFilters;
