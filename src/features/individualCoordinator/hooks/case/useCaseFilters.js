import useColumnFilters from "@/hooks/filters/useColumnFilters";
import {
  EMPTY_CASE_FILTERS,
  setCaseFilter,
  clearCaseFilter,
  clearCaseFilters,
} from "@/store/slice/case/caseSlice";

// Which columns of the case table can be filtered and how to read them off a
// raw case row. `label` must match the header text in caseTableHeader so the
// table can place the control in the right column.
//
// Bank is a relation, so it filters on bank.id and shows the display name the
// bank column renders (two branches of the same bank are different banks here,
// which is exactly what display_name spells out). Case type is a plain string
// column on the case, so the value *is* the id — cases with no case type have
// no value to group under and drop out of the options, the same way a user
// with no branch does.
export const CASE_FILTER_COLUMNS = {
  bank: {
    label: "bank",
    getId: (caseItem) => caseItem.bank?.id ?? "",
    getLabel: (caseItem) =>
      caseItem.bank?.display_name || caseItem.bank?.name || "",
  },
  caseType: {
    label: "case type",
    getId: (caseItem) => caseItem.case_type ?? "",
    getLabel: (caseItem) => caseItem.case_type ?? "",
  },
};

const selectCaseFilters = (state) => state.case.filters;

const useCaseFilters = () =>
  useColumnFilters({
    columns: CASE_FILTER_COLUMNS,
    emptyFilters: EMPTY_CASE_FILTERS,
    selectFilters: selectCaseFilters,
    setFilterAction: setCaseFilter,
    clearFilterAction: clearCaseFilter,
    clearAllAction: clearCaseFilters,
  });

export default useCaseFilters;
