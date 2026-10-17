import { createSelector } from "@reduxjs/toolkit";

// Selectors own the slice's shape, so screens and hooks never reach into
// `state.business.*` directly. Derived values live here rather than in the
// components that happen to display them.
const selectBusinessState = (state) => state.business;

export const selectBusinessData = (state) => state.business.businessData;
export const selectBusinessFilters = (state) => state.business.filters;
export const selectBusinessLoading = (state) => state.business.loading;
export const selectBusinessError = (state) => state.business.error;
export const selectBusinessSuccess = (state) => state.business.success;

// Pagination cursors, as one memoized object so a consumer can destructure
// them without subscribing to the whole slice.
export const selectBusinessPagination = createSelector(
  [selectBusinessState],
  (business) => ({
    businessFirstId: business.businessFirstId,
    businessLastId: business.businessLastId,
    hasNextPage: business.hasNextPage,
    hasPreviousPage: business.hasPreviousPage,
    businessLength: business.businessLength,
    dataLimit: business.dataLimit,
    direction: business.direction,
  }),
);

// The list endpoint sends no table-wide totals, so both counts fall back to the
// loaded page. Keeping the fallback here means every screen reports the same
// number instead of each one re-deriving it.
export const selectBusinessTotalCount = createSelector(
  [selectBusinessState],
  (business) => business.totalCount || business.businessData.length,
);

export const selectBusinessActiveCount = createSelector(
  [selectBusinessState],
  (business) =>
    business.totalActiveCount ||
    business.businessData.filter((item) => item.isActive && !item.isDeleted)
      .length,
);
