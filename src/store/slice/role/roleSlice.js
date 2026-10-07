import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Rows on the current page, exactly as the API sends them.
  roleData: [],

  // Cursor pagination, as returned by the list API.
  roleFirstId: null,
  roleLastId: null,
  hasNextPage: false,
  hasPreviousPage: false,
  roleLength: 0,
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

const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    roleStart: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },

    roleFailure: (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    },

    setRole: (state, action) => {
      const payload = action.payload || {};
      const data = Array.isArray(payload) ? payload : payload.data || [];

      state.roleData = data;
      state.roleFirstId = payload.roleFirstId || null;
      state.roleLastId = payload.roleLastId || null;
      state.hasNextPage = payload.hasNextPage || false;
      state.hasPreviousPage = payload.hasPreviousPage || false;
      state.roleLength = payload.roleLength || data.length;
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

    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },

    setPageDirection: (state, action) => {
      state.direction = action.payload;
    },
  },
});

export const {
  roleStart,
  roleFailure,
  setRole,
  setSearchQuery,
  setPageDirection,
} = roleSlice.actions;

export default roleSlice.reducer;
