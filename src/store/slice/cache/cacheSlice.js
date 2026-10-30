import { createSlice } from "@reduxjs/toolkit";
import { logout } from "@/features/auth/slice/authSlice";
import { clearInFlightRequests } from "@/hooks/cache/inFlightRequests";

// Freshness bookkeeping for the server-backed list slices, so a list is not
// refetched when the store already holds the answer to the exact same query.
//
// Shape: { [resource]: { key, fetchedAt } }
//
// `key` is the serialized query arguments (direction, cursorId, search, …).
// It must match for a cached read to count, because each list slice holds only
// ONE page at a time — treating a different page or search term as "fresh"
// would leave the screen showing the wrong rows.
//
// This is deliberately small. It is not a replacement for RTK Query, which
// would own caching, deduplication and tag invalidation properly; it is the
// minimum needed to stop the repeat calls while the project stays on
// hand-rolled thunk-style hooks.
const initialState = {};

const cacheSlice = createSlice({
  name: "cache",
  initialState,
  reducers: {
    // Called after a successful fetch, with the key that was fetched.
    recordFetch: (state, action) => {
      const { resource, key } = action.payload || {};
      if (!resource) return;
      state[resource] = { key, fetchedAt: Date.now() };
    },

    // Drops a resource's entry so the next read refetches. Mutations use this.
    invalidateResource: (state, action) => {
      const resource = action.payload;
      if (resource) delete state[resource];
    },

    // Logout and other "forget everything" transitions.
    invalidateAll: () => initialState,
  },

  extraReducers: (builder) => {
    // Freshness must not outlive the rows it describes.
    //
    // The list slices reset on logout, but this one used to survive it, and
    // nothing ever dispatched invalidateAll. Within the TTL that left two
    // failures on the same code path: a slice that had been reset still
    // counted as "fresh", so the next user's dashboard rendered the empty
    // array and never fetched; and a slice that does not reset (branch, role,
    // department, …) handed the next user to sign in on that machine the
    // previous user's rows, with no request made.
    builder.addCase(logout, () => {
      // Requests started by the signed-out user are abandoned here too, so a
      // reply that lands after the switch cannot be adopted by the new
      // session.
      clearInFlightRequests();
      return initialState;
    });
  },
});

export const { recordFetch, invalidateResource, invalidateAll } =
  cacheSlice.actions;

export const selectCacheEntry = (resource) => (state) =>
  state.cache?.[resource];

export default cacheSlice.reducer;
