import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },

    loginFailure: (state, action) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = action.payload;
    },

    logoutStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    clearError: (state) => {
      state.error = null;
    },

    logout: () => initialState,
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logoutStart,
  clearError,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
