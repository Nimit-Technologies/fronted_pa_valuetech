import { createSlice } from "@reduxjs/toolkit";

// Excel-style column filters applied client-side to the loaded rows. `null`
// means the column is unfiltered; an array lists the relation ids to keep.
// Kept in the store so they survive a remount of the list page.
export const EMPTY_DEPARTMENT_FILTERS = Object.freeze({
  branch: null,
});

const initialState = {
  departmentData: [],

  filters: { ...EMPTY_DEPARTMENT_FILTERS },

  departmentFirstId: null,
  departmentLastId: null,
  hasNextPage: false,
  hasPreviousPage: false,
  departmentLength: 0,
  totalCount: 0,
  totalActiveCount: 0,
  dataLimit: null,
  direction: null,
  searchQuery: "",
  loading: false,
  error: null,
  success: null,
};

const departmentSlice = createSlice({
  name: "department",
  initialState,
  reducers: {
    departmentStart: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },

    departmentFailure: (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    },

    setDepartment: (state, action) => {
      const payload = action.payload || [];
      const data = Array.isArray(payload) ? payload : payload.data || [];

      state.departmentData = data;
      state.departmentFirstId = payload.departmentFirstId || null;
      state.departmentLastId = payload.departmentLastId || null;
      state.hasNextPage = payload.hasNextPage || false;
      state.hasPreviousPage = payload.hasPreviousPage || false;
      state.dataLimit = payload.dataLimit || state.dataLimit;
      state.departmentLength = payload.departmentLength || data.length;
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
    setDepartmentFilter: (state, action) => {
      const { column, values } = action.payload || {};
      if (!(column in EMPTY_DEPARTMENT_FILTERS)) return;
      state.filters[column] = Array.isArray(values) ? values : null;
    },

    clearDepartmentFilter: (state, action) => {
      const column = action.payload;
      if (column in EMPTY_DEPARTMENT_FILTERS) state.filters[column] = null;
    },

    clearDepartmentFilters: (state) => {
      state.filters = { ...EMPTY_DEPARTMENT_FILTERS };
    },
  },
});

export const {
  departmentStart,
  departmentFailure,
  setDepartment,
  setSearchQuery,
  setPageDirection,
  setDepartmentFilter,
  clearDepartmentFilter,
  clearDepartmentFilters,
} = departmentSlice.actions;

export default departmentSlice.reducer;
