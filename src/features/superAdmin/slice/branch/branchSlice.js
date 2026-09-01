// import React, { act } from 'react'
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  branchData: [],
  branchFirstId: null,
  branchLastId: null,
  hashNextPage: false,
  hashPreviousPage: false,
  dataLimit: 10,
  direction: "next",
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

    setBranch: (state, action) => {
      const payload = action.payload || [];
      const data = Array.isArray(payload) ? payload : payload.data || [];

      state.branchData = data;
      state.branchFirstId = payload.branchFirstId || null;
      state.branchLastId = payload.branchLastId || null;
      state.hashNextPage = payload.hasNextPage || false;
      state.hashPreviousPage = payload.hasPreviousPage || false;
      state.dataLimit = payload.dataLimit || state.dataLimit;
      state.branchLength = payload.branchLength || data.length;

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
  setBranch,
  setSearchQuery,
  setPageDirection,
} = branchSlice.actions;

export default branchSlice.reducer;
