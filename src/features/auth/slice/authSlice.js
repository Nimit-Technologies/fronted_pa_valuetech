import { createSlice } from "@reduxjs/toolkit";

// No `token` field: auth is httpOnly-cookie-only (see backend
// auth.login.js) — the JWT is never returned in the JSON body, so a client
// -side token field would always be null and implies a bearer-token flow
// that doesn't exist. Session state lives in the cookie; this slice only
// mirrors the *identity* the server told us about, for UI purposes.
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

    // action.payload.user is expected to already be normalized (see
    // features/auth/services/normalizeUser.js) — this slice never touches
    // the raw {success, message, data} envelope or backend field-naming
    // quirks directly.
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

    clearError: (state) => {
      state.error = null;
    },

    // Returning initialState (rather than resetting fields one by one) keeps
    // this in sync automatically if new fields are ever added above.
    logout: () => initialState,
  },
});

export const { loginStart, loginSuccess, loginFailure, clearError, logout } =
  authSlice.actions;

export default authSlice.reducer;
