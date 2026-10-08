import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  businessData: [],

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
  },
});

export const { businessStart, businessFailure, businessSuccess } =
  businessSlice.actions;

export default businessSlice.reducer;
