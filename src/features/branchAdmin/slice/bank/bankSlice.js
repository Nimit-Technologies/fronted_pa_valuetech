import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bankData: [],

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
  },
});

export const { bankStart, bankFailure, bankSuccess } = bankSlice.actions;

export default bankSlice.reducer;
