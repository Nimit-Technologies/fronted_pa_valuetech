import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  branchData: [],
  branchFirstId: null,
  branchLastId: null,
  hasNextPage: false,
  hasPreviousPage: false,
  branchLength: 0,
  totalCount: 0,
  totalActiveCount: 0,
  dataLimit: null,
  direction: null,
  searchQuery: "",
  loading: false,
  error: null,
  success: null,
};

const branchSlice = createSlice({
  name: "branch",
  initialState,
  reducers: {
    branchStart: (state) => {
      ((state.loading = true), (state.error = null), (state.success = false));
    },

    branchFailure: (state, action) => {
      ((state.loading = false),
        (state.success = false),
        (state.error = action.payload));
    },

    branchSuccess: (state, action) => {
      const payload = action.payload || [];
      const data = Array.isArray(payload) ? payload : payload.data || [];

      state.branchData = data;
      state.branchFirstId = payload.branchFirstId || null;
      state.branchLastId = payload.branchLastId || null;
      state.hasNextPage = payload.hasNextPage || false;
      state.hasPreviousPage = payload.hasPreviousPage || false;
      state.dataLimit = payload.dataLimit || state.dataLimit;
      state.branchLength = payload.branchLength || data.length;
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

    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },

    setPageDirection: (state, action) => {
      state.direction = action.payload;
    },
  },
});

export const {
  branchStart,
  branchFailure,
  branchSuccess,
  setSearchQuery,
  setPageDirection,
} = branchSlice.actions;

export default branchSlice.reducer;
