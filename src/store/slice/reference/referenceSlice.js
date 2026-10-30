import { createSlice } from "@reduxjs/toolkit";
import { logout } from "@/features/auth/slice/authSlice";

/**
 * Read-only lookup lists that several screens share: statuses, engineers, the
 * branch's banks, business types.
 *
 * One generic slice rather than one slice per lookup, because none of them is
 * screen state. They are reference data a form or a dropdown reads, they are
 * never edited through the UI, and they all want the same three things:
 * fetched once, shared by every component that asks, and forgotten on logout.
 * A slice each would be the same reducer written four times.
 *
 * The list slices (branch, user, case, …) stay as they are: those own paging,
 * filters and search for a whole screen, which is a different job.
 *
 * Shape: { [resource]: { rows, meta, loading, error, loaded } }
 */
const initialState = {};

const EMPTY_ENTRY = { rows: [], meta: {}, loading: false, error: null };

const referenceSlice = createSlice({
  name: "reference",
  initialState,
  reducers: {
    referenceStart: (state, action) => {
      const { resource } = action.payload || {};
      if (!resource) return;
      const current = state[resource] ?? EMPTY_ENTRY;
      // Rows are kept while refetching, so a dropdown reopened after its TTL
      // shows the list it had rather than blanking and refilling.
      state[resource] = { ...current, loading: true, error: null };
    },

    referenceSuccess: (state, action) => {
      const { resource, rows, meta } = action.payload || {};
      if (!resource) return;
      state[resource] = {
        rows: rows ?? [],
        meta: meta ?? {},
        loading: false,
        error: null,
        loaded: true,
      };
    },

    referenceFailure: (state, action) => {
      const { resource, error } = action.payload || {};
      if (!resource) return;
      state[resource] = {
        ...(state[resource] ?? EMPTY_ENTRY),
        rows: [],
        loading: false,
        error: error ?? "Request failed",
        loaded: true,
      };
    },
  },

  // Engineers, banks and business types are all scoped to the signed-in
  // user's branch by the API, so keeping them across a logout would show one
  // branch's reference data to the next user (see cacheSlice).
  extraReducers: (builder) => {
    builder.addCase(logout, () => initialState);
  },
});

export const { referenceStart, referenceSuccess, referenceFailure } =
  referenceSlice.actions;

export const selectReference = (resource) => (state) =>
  state.reference?.[resource];

export default referenceSlice.reducer;
