import { createSlice } from "@reduxjs/toolkit";

// Excel-style column filters applied client-side to the loaded rows. `null`
// means the column is unfiltered; an array lists the relation ids to keep.
// Kept in the slice so they survive a remount of the list page.
export const EMPTY_BUSINESS_FILTERS = Object.freeze({
  branch: null,
});

const initialState = {
  businessData: [],

  filters: { ...EMPTY_BUSINESS_FILTERS },

  businessFirstId: null,
  businessLastId: null,
  hasNextPage: false,
  hasPreviousPage: false,
  businessLength: 0,
  dataLimit: null,
  direction: "next",

  totalCount: 0,
  totalActiveCount: 0,

  loading: false,
  error: null,
  success: null,
};

const businessSlice = createSlice({
  name: "business",
  initialState,
  reducers: {
    businessStart: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },

    businessFailure: (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    },

    businessSuccess: (state, action) => {
      const payload = action.payload || {};
      const data = Array.isArray(payload) ? payload : payload.data || [];

      state.businessData = data;
      state.businessFirstId = payload.businessFirstId || null;
      state.businessLastId = payload.businessLastId || null;
      state.hasNextPage = payload.hasNextPage || false;
      state.hasPreviousPage = payload.hasPreviousPage || false;
      state.businessLength = payload.businessLength || data.length;
      state.dataLimit = payload.dataLimit || state.dataLimit;
      state.direction = payload.direction || "next";

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

    // payload: { column, values } — values is an array of ids, or null to
    // remove the filter on that column.
    setBusinessFilter: (state, action) => {
      const { column, values } = action.payload || {};
      if (!(column in EMPTY_BUSINESS_FILTERS)) return;
      state.filters[column] = Array.isArray(values) ? values : null;
    },

    clearBusinessFilter: (state, action) => {
      const column = action.payload;
      if (column in EMPTY_BUSINESS_FILTERS) state.filters[column] = null;
    },

    clearBusinessFilters: (state) => {
      state.filters = { ...EMPTY_BUSINESS_FILTERS };
    },
  },
});

export const {
  businessStart,
  businessFailure,
  businessSuccess,
  setBusinessFilter,
  clearBusinessFilter,
  clearBusinessFilters,
} = businessSlice.actions;

export default businessSlice.reducer;
