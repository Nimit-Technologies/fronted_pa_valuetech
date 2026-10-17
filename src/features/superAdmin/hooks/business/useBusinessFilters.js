import useColumnFilters from "@/hooks/filters/useColumnFilters";
import {
  EMPTY_BUSINESS_FILTERS,
  setBusinessFilter,
  clearBusinessFilter,
  clearBusinessFilters,
} from "@/features/superAdmin/slice/business/businessSlice";
import { selectBusinessFilters } from "@/features/superAdmin/slice/business/businessSelectors";

// Which columns of the business table can be filtered and how to read them
// off a row. `label` must match the header text in businessTableHeader so
// the table can place the control in the right column.
//
// Rows here are the normalized shape from normalizeBusiness, which keeps
// `branchId` separately because the branch include can be absent — so the id
// falls back to it and only the displayed name comes from the relation.
//
// Feature-local rather than in @/hooks/filters: business types are a
// superAdmin-only list, so no second feature reads this slice.
export const BUSINESS_FILTER_COLUMNS = {
  branch: {
    label: "Branch",
    getId: (business) => business.branch?.id ?? business.branchId ?? "",
    getLabel: (business) => business.branch?.name ?? "",
  },
};

const useBusinessFilters = () =>
  useColumnFilters({
    columns: BUSINESS_FILTER_COLUMNS,
    emptyFilters: EMPTY_BUSINESS_FILTERS,
    selectFilters: selectBusinessFilters,
    setFilterAction: setBusinessFilter,
    clearFilterAction: clearBusinessFilter,
    clearAllAction: clearBusinessFilters,
  });

export default useBusinessFilters;
