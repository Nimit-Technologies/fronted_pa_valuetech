import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  roleData: [],
  roleFirstId: null,
  roleLastId: null,
  hasNextPage: false,
  hasPreviousPage: false,
  dataLimit: 10,
  direction: "next",
  searchQuery: "",
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
      const payload = action.payload || [];
      const data = Array.isArray(payload) ? payload : payload.data || [];

      state.roleData = data;
      state.roleFirstId = payload.roleFirstId || null;
      state.roleLastId = payload.roleLastId || null;
      state.hasNextPage = payload.hasNextPage || false;
      state.hasPreviousPage = payload.hasPreviousPage || false;
      state.dataLimit = payload.dataLimit || state.dataLimit;
      state.roleLength = payload.roleLength || data.length;

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
