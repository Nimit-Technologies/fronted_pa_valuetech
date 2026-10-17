import useColumnFilters from "@/hooks/filters/useColumnFilters";
import {
  EMPTY_BANK_FILTERS,
  setBankFilter,
  clearBankFilter,
  clearBankFilters,
} from "@/features/branchAdmin/slice/bank/bankSlice";

// Which columns of the bank table can be filtered. Unlike the department and
// role tables, the filtered column is not a relation: a bank's name is its
// own value, so the name doubles as the filter id. That is also what the
// column means here — the same bank appears once per bank branch, and
// picking a name keeps every one of its rows.
//
// `header` is the header text in bankTableHeader, which is lowercase and
// title-cased by CSS; `label` is what the popover and the filter chips show.
export const BANK_FILTER_COLUMNS = {
  name: {
    label: "Bank Name",
    header: "bank name",
    getId: (bank) => bank.name ?? "",
    getLabel: (bank) => bank.name ?? "",
  },
};

const selectBankFilters = (state) => state.bank.filters;

const useBankFilters = () =>
  useColumnFilters({
    columns: BANK_FILTER_COLUMNS,
    emptyFilters: EMPTY_BANK_FILTERS,
    selectFilters: selectBankFilters,
    setFilterAction: setBankFilter,
    clearFilterAction: clearBankFilter,
    clearAllAction: clearBankFilters,
  });

export default useBankFilters;
