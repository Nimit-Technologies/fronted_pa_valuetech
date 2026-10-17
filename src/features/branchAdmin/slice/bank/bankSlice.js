import { createSlice } from "@reduxjs/toolkit";

// Excel-style column filters applied client-side to the loaded rows. `null`
// means the column is unfiltered; an array lists the values to keep. Kept in
// the store so they survive a remount of the list page.
export const EMPTY_BANK_FILTERS = Object.freeze({
  name: null,
});

const initialState = {
  bankData: [],

  filters: { ...EMPTY_BANK_FILTERS },

  bankFirstId: null,
  bankLastId: null,
  hasNextPage: false,
  hasPreviousPage: false,
  bankLength: 0,
  dataLimit: null,
  direction: "next",

  totalCount: 0,
  totalActiveCount: 0,

  loading: false,
  error: null,
  success: null,
};

const bankSlice = createSlice({
  name: "bank",
  initialState,
  reducers: {
    bankStart: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },

    bankFailure: (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    },

    bankSuccess: (state, action) => {
      const payload = action.payload || {};
      const data = Array.isArray(payload) ? payload : payload.data || [];

      state.bankData = data;
      state.bankFirstId = payload.bankFirstId || null;
      state.bankLastId = payload.bankLastId || null;
      state.hasNextPage = payload.hasNextPage || false;
      state.hasPreviousPage = payload.hasPreviousPage || false;
      state.bankLength = payload.bankLength || data.length;
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

    // payload: { column, values } — values is an array of values, or null to
    // remove the filter on that column.
    setBankFilter: (state, action) => {
      const { column, values } = action.payload || {};
      if (!(column in EMPTY_BANK_FILTERS)) return;
      state.filters[column] = Array.isArray(values) ? values : null;
    },

    clearBankFilter: (state, action) => {
      const column = action.payload;
      if (column in EMPTY_BANK_FILTERS) state.filters[column] = null;
    },

    clearBankFilters: (state) => {
      state.filters = { ...EMPTY_BANK_FILTERS };
    },
  },
});

export const {
  bankStart,
  bankFailure,
  bankSuccess,
  setBankFilter,
  clearBankFilter,
  clearBankFilters,
} = bankSlice.actions;

export default bankSlice.reducer;
