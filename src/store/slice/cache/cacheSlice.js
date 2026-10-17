import { createSlice } from "@reduxjs/toolkit";

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
});

export const { recordFetch, invalidateResource, invalidateAll } =
  cacheSlice.actions;

export const selectCacheEntry = (resource) => (state) =>
  state.cache?.[resource];

export default cacheSlice.reducer;
