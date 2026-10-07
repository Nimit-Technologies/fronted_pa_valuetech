import { createSlice } from "@reduxjs/toolkit";

// Excel-style column filters applied client-side to the loaded rows. `null`
// means the column is unfiltered; an array lists the relation ids to keep.
// Kept in the store so they survive a trip to the view/update pages.
export const EMPTY_USER_FILTERS = Object.freeze({
  branch: null,
  department: null,
  role: null,
});

const initialState = {
  // Rows on the current page, exactly as the API sends them.
  userData: [],

  filters: { ...EMPTY_USER_FILTERS },

  // Cursor pagination, as returned by the list API.
  userFirstId: null,
  userLastId: null,
  hasNextPage: false,
  hasPreviousPage: false,
  userLength: 0,
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

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userStart: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },

    userFailure: (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    },

    setUser: (state, action) => {
      const payload = action.payload || {};
      const data = Array.isArray(payload) ? payload : payload.data || [];

      state.userData = data;
      state.userFirstId = payload.userFirstId || null;
      state.userLastId = payload.userLastId || null;
      state.hasNextPage = payload.hasNextPage || false;
      state.hasPreviousPage = payload.hasPreviousPage || false;
      state.userLength = payload.userLength || data.length;
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

    setQuery: (state, action) => {
      state.searchQuery = action.payload;
    },

    setDirection: (state, action) => {
      state.direction = action.payload;
    },

    // payload: { column, values } — values is an array of ids, or null to
    // remove the filter on that column.
    setUserFilter: (state, action) => {
      const { column, values } = action.payload || {};
      if (!(column in EMPTY_USER_FILTERS)) return;
      state.filters[column] = Array.isArray(values) ? values : null;
    },

    clearUserFilter: (state, action) => {
      const column = action.payload;
      if (column in EMPTY_USER_FILTERS) state.filters[column] = null;
    },

    clearUserFilters: (state) => {
      state.filters = { ...EMPTY_USER_FILTERS };
    },
  },
});

export const {
  userStart,
  userFailure,
  setUser,
  setQuery,
  setDirection,
  setUserFilter,
  clearUserFilter,
  clearUserFilters,
} = userSlice.actions;

export default userSlice.reducer;
