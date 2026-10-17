import { useCallback } from "react";
import { useDispatch, useStore } from "react-redux";
import {
  invalidateResource,
  recordFetch,
} from "@/store/slice/cache/cacheSlice";

// How long a list stays usable without refetching. Short enough that another
// user's change shows up on the next navigation, long enough that reopening a
// dropdown or bouncing between screens costs nothing.
export const DEFAULT_TTL_MS = 30_000;

// Stable key for a set of query arguments. Sorted so argument order cannot
// produce two keys for the same query; empty values are dropped so an explicit
// `search: ""` and an omitted `search` are the same query.
export const buildCacheKey = (args = {}) =>
  JSON.stringify(
    Object.keys(args)
      .filter((k) => args[k] !== undefined && args[k] !== "")
      .sort()
      .map((k) => [k, args[k]]),
  );

/**
 * Freshness gate for one server-backed list resource.
 *
 * Reads through `store.getState()` rather than `useSelector`, for two reasons:
 * the returned callbacks stay stable (a selector value in their dependency
 * arrays would rebuild them after every fetch and defeat the `useCallback`s in
 * the hooks that consume this), and the component never subscribes to cache
 * metadata, so recording a fetch does not re-render anything.
 */
export const useResourceCache = (resource, ttlMs = DEFAULT_TTL_MS) => {
  const dispatch = useDispatch();
  const store = useStore();

  const isFresh = useCallback(
    (key) => {
      const entry = store.getState().cache?.[resource];
      if (!entry || entry.key !== key) return false;
      return Date.now() - entry.fetchedAt < ttlMs;
    },
    [store, resource, ttlMs],
  );

  const markFetched = useCallback(
    (key) => dispatch(recordFetch({ resource, key })),
    [dispatch, resource],
  );

  const invalidate = useCallback(
    () => dispatch(invalidateResource(resource)),
    [dispatch, resource],
  );

  // Rows already in the store for a cached hit, read at call time so no ref is
  // written during render.
  const getRows = useCallback(
    (slice, field) => store.getState()[slice]?.[field] ?? [],
    [store],
  );

  return { isFresh, markFetched, invalidate, getRows };
};

export default useResourceCache;
