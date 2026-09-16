import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Rows on the current page.
  branchData: [],

  // Cursor pagination, as returned by the list API.
  branchFirstId: null,
  branchLastId: null,
  hasNextPage: false,
  hasPreviousPage: false,
  branchLength: 0,
  dataLimit: null,
  direction: "next",

  // The server-side search the current page was fetched with.
  searchQuery: "",

  // Table-wide totals (independent of paging).
  totalCount: 0,
  totalActiveCount: 0,

  // Request state.
  loading: false,
  error: null,
  success: null,
};

const branchSlice = createSlice({
  name: "branch",
  initialState,
  reducers: {
    branchStart: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },

    branchFailure: (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    },

    branchSuccess: (state, action) => {
      const payload = action.payload || {};
      const data = Array.isArray(payload) ? payload : payload.data || [];

      state.branchData = data;
      state.branchFirstId = payload.branchFirstId || null;
      state.branchLastId = payload.branchLastId || null;
      state.hasNextPage = payload.hasNextPage || false;
      state.hasPreviousPage = payload.hasPreviousPage || false;
      state.branchLength = payload.branchLength || data.length;
      state.dataLimit = payload.dataLimit || state.dataLimit;
      state.direction = payload.direction || "next";
      state.searchQuery = payload.searchQuery ?? "";

      // Only a fresh view (first page) carries the totals; cursor pages send
      // null, so keep the last known values while the user pages around.
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
  },
});

export const { branchStart, branchFailure, branchSuccess } =
  branchSlice.actions;

export default branchSlice.reducer;
