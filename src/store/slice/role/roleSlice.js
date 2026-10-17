import { createSlice } from "@reduxjs/toolkit";

// Excel-style column filters applied client-side to the loaded rows. `null`
// means the column is unfiltered; an array lists the relation ids to keep.
// Kept in the store so they survive a remount of the list page.
export const EMPTY_ROLE_FILTERS = Object.freeze({
  department: null,
  branch: null,
});

const initialState = {
  // Rows on the current page, exactly as the API sends them.
  roleData: [],

  filters: { ...EMPTY_ROLE_FILTERS },

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

    // payload: { column, values } — values is an array of ids, or null to
    // remove the filter on that column.
    setRoleFilter: (state, action) => {
      const { column, values } = action.payload || {};
      if (!(column in EMPTY_ROLE_FILTERS)) return;
      state.filters[column] = Array.isArray(values) ? values : null;
    },

    clearRoleFilter: (state, action) => {
      const column = action.payload;
      if (column in EMPTY_ROLE_FILTERS) state.filters[column] = null;
    },

    clearRoleFilters: (state) => {
      state.filters = { ...EMPTY_ROLE_FILTERS };
    },
  },
});

export const {
  roleStart,
  roleFailure,
  setRole,
  setSearchQuery,
  setPageDirection,
  setRoleFilter,
  clearRoleFilter,
  clearRoleFilters,
} = roleSlice.actions;

export default roleSlice.reducer;
