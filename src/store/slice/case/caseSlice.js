import { createSlice } from "@reduxjs/toolkit";

// Mirrors the user slice: one page of rows plus the cursor metadata the list
// API returns. Lives in the shared store rather than under a role feature
// because every role lists cases through the same endpoint — the backend
// scopes the rows (branch / business type / own assignments), not the client.

// Excel-style column filters applied client-side to the loaded rows. `null`
// means the column is unfiltered; an array lists the values to keep — bank ids
// for the bank column, the case_type string itself for case type, since a case
// type is a plain column on the case and not a relation.
// Kept in the store so they survive a trip to the view/update pages.
export const EMPTY_CASE_FILTERS = Object.freeze({
  bank: null,
  caseType: null,
});

const initialState = {
  // Rows on the current page, exactly as the API sends them.
  caseData: [],

  filters: { ...EMPTY_CASE_FILTERS },

  // Cursor pagination, as returned by the list API.
  caseFirstId: null,
  caseLastId: null,
  hasNextPage: false,
  hasPreviousPage: false,
  caseLength: 0,
  dataLimit: null,
  direction: "next",

  // The server-side search the current page was fetched with.
  searchQuery: "",

  // Table-wide totals (independent of paging). `totalActiveCount` counts the
  // non-terminal cases — close and cancelled are what "finished" means now,
  // there is no is_active flag on a case.
  totalCount: 0,
  totalActiveCount: 0,

  // Request state.
  loading: false,
  error: null,
  success: null,
};

const caseSlice = createSlice({
  name: "case",
  initialState,
  reducers: {
    caseStart: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },

    caseFailure: (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    },

    setCase: (state, action) => {
      const payload = action.payload || {};
      const data = Array.isArray(payload) ? payload : payload.data || [];

      state.caseData = data;
      state.caseFirstId = payload.caseFirstId || null;
      state.caseLastId = payload.caseLastId || null;
      state.hasNextPage = payload.hasNextPage || false;
      state.hasPreviousPage = payload.hasPreviousPage || false;
      state.caseLength = payload.caseLength || data.length;
      state.dataLimit = payload.dataLimit || state.dataLimit;
      state.direction = payload.direction || "next";
      state.searchQuery = payload.searchQuery ?? "";

      // Every list response carries the totals for the filter it ran under, so
      // unlike the user slice there is nothing to hold over between pages.
      if (typeof payload.totalCount === "number") {
        state.totalCount = payload.totalCount;
      }
      if (typeof payload.totalActiveCount === "number") {
        state.totalActiveCount = payload.totalActiveCount;
      }

      state.loading = false;
      state.error = null;
      state.success = true;
    },

    // One row, replaced where it already sits. A successful update otherwise
    // leaves this page holding the pre-edit values until the list is next
    // fetched, which is long enough for the user to navigate back and see the
    // change missing.
    //
    // A row that is not on the loaded page is ignored rather than appended:
    // this slice holds one page in the server's order, and adding to it would
    // put a row where the cursor says it does not belong.
    updateCaseInList: (state, action) => {
      const updated = action.payload;
      if (!updated?.id) return;

      const index = state.caseData.findIndex((row) => row.id === updated.id);
      if (index === -1) return;

      // Merged, not swapped: a write response carries the case itself but not
      // the thread of remarks the detail view adds, and the row only needs the
      // fields it renders.
      state.caseData[index] = { ...state.caseData[index], ...updated };
    },

    setQuery: (state, action) => {
      state.searchQuery = action.payload;
    },

    setDirection: (state, action) => {
      state.direction = action.payload;
    },

    // payload: { column, values } — values is an array of ids, or null to
    // remove the filter on that column.
    setCaseFilter: (state, action) => {
      const { column, values } = action.payload || {};
      if (!(column in EMPTY_CASE_FILTERS)) return;
      state.filters[column] = Array.isArray(values) ? values : null;
    },

    clearCaseFilter: (state, action) => {
      const column = action.payload;
      if (column in EMPTY_CASE_FILTERS) state.filters[column] = null;
    },

    clearCaseFilters: (state) => {
      state.filters = { ...EMPTY_CASE_FILTERS };
    },
  },
});

export const {
  caseStart,
  caseFailure,
  setCase,
  updateCaseInList,
  setQuery,
  setDirection,
  setCaseFilter,
  clearCaseFilter,
  clearCaseFilters,
} = caseSlice.actions;

export default caseSlice.reducer;
