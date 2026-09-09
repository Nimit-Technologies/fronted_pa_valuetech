import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userData: [],
  userFirstId: null,
  userLastId: null,
  hasNextPage: false,
  hasPreviousPage: false,
  dataLimit: 10,
  direction: "next",
  searchQuery: "",
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
      state.hasNextPage = payload.hasNextPage ?? payload.hashNextPage ?? false;
      state.hasPreviousPage =
        payload.hasPreviousPage ?? payload.hashPreviousPage ?? false;
      state.dataLimit = payload.dataLimit || state.dataLimit;
      state.userLength = payload.userLength || data.length;
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
  },
});

export const { userStart, userFailure, setUser, setQuery, setDirection } =
  userSlice.actions;

export default userSlice.reducer;
