import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  referenceFailure,
  referenceStart,
  referenceSuccess,
} from "@/store/slice/reference/referenceSlice";
import {
  buildCacheKey,
  useResourceCache,
} from "@/hooks/cache/useResourceCache";
import { extractErrorMessage } from "@/utils/extractErrorMessage";

/**
 * One lookup list, fetched once and shared by everything that asks for it.
 *
 * This is the useAllBranch pattern (freshness gate, newest-request-wins,
 * `force` after a mutation) applied to the reference data that dropdowns and
 * forms read — the difference being that those components mount in numbers,
 * and often all at once:
 *
 *   - the engineer's case table renders a StatusDropdown per row, so a
 *     ten-row page fired ten identical GET /status/all-status calls, then ten
 *     more on the next page turn;
 *   - the bank picker, engineer picker and business-type lookup each refetched
 *     on every mount of the case form, including a reopen seconds later.
 *
 * Two gates fix that, and both are needed. `isFresh` answers "we already have
 * this" for calls that are far apart; `dedupe` answers "someone is already
 * asking" for calls in the same tick, which is the per-row case — none of
 * those ten had recorded a fetch yet when the next one started.
 *
 * Reference data changes rarely, so the default TTL is minutes rather than the
 * 30 seconds the list screens use. A mutation that invalidates the resource
 * still forces the next read to go to the network.
 *
 * @param {object} options
 * @param {string} options.resource cache key namespace, e.g. "status"
 * @param {(params: object) => Promise<{rows: unknown[], meta?: object}>}
 *   options.fetcher performs the request and normalizes the payload
 * @param {object} [options.params] query arguments, part of the cache key
 * @param {number} [options.ttlMs]
 * @param {boolean} [options.auto] fetch on mount (default true)
 * @param {string} [options.errorMessage] fallback wording for a failure
 */

export const REFERENCE_TTL_MS = 5 * 60_000;

const EMPTY_ROWS = [];
const EMPTY_PARAMS = {};
// Module-level so an unfetched resource always selects the same object and
// does not re-render every consumer on unrelated store updates.
const EMPTY_ENTRY = {
  rows: EMPTY_ROWS,
  meta: EMPTY_PARAMS,
  loading: false,
  error: null,
  loaded: false,
};

export const useReferenceList = ({
  resource,
  fetcher,
  params = EMPTY_PARAMS,
  ttlMs = REFERENCE_TTL_MS,
  auto = true,
  errorMessage = "Failed to load data",
}) => {
  const dispatch = useDispatch();
  const { isFresh, markFetched, invalidate, dedupe } = useResourceCache(
    resource,
    ttlMs,
  );

  const entry = useSelector(
    (state) => state.reference?.[resource] ?? EMPTY_ENTRY,
  );

  // The caller usually passes an inline arrow for `fetcher` and an object
  // literal for `params`, both new on every render. Holding them in refs and
  // keying the callbacks off the serialized params keeps `load` stable, so the
  // mount effect below runs once instead of on every render.
  const fetcherRef = useRef(fetcher);
  const paramsRef = useRef(params);

  useEffect(() => {
    fetcherRef.current = fetcher;
    paramsRef.current = params;
  });

  const paramsKey = buildCacheKey(params);

  const load = useCallback(
    async ({ force = false, ...overrides } = {}) => {
      const args = { ...paramsRef.current, ...overrides };
      const key = buildCacheKey(args);

      if (!force && isFresh(key)) return undefined;

      return dedupe(key, async () => {
        dispatch(referenceStart({ resource }));

        try {
          const { rows = [], meta = {} } =
            (await fetcherRef.current(args)) ?? {};

          dispatch(referenceSuccess({ resource, rows, meta }));
          markFetched(key);
          return rows;
        } catch (err) {
          dispatch(
            referenceFailure({
              resource,
              error: extractErrorMessage(err, errorMessage),
            }),
          );
          return EMPTY_ROWS;
        }
      });
    },
    // paramsKey, not params: a new object with the same values must not
    // rebuild this callback and retrigger the effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, resource, errorMessage, isFresh, markFetched, dedupe, paramsKey],
  );

  useEffect(() => {
    if (!auto) return;
    void load();
  }, [auto, load]);

  return {
    rows: entry.rows ?? EMPTY_ROWS,
    meta: entry.meta ?? EMPTY_PARAMS,
    // An entry that has never loaded reads as loading while the mount fetch is
    // on its way, so a dropdown shows a spinner rather than "nothing found"
    // for the first frame.
    loading: Boolean(entry.loading) || (auto && !entry.loaded),
    error: entry.error ?? null,
    loaded: Boolean(entry.loaded),
    /** Fetch, honouring the cache. Pass query overrides to change the page. */
    load,
    /** Fetch regardless of freshness — for a retry button, or after a change. */
    reload: useCallback(
      (overrides) => load({ ...overrides, force: true }),
      [load],
    ),
    /** Drop the freshness entry so the next read refetches. */
    invalidate,
  };
};

export default useReferenceList;
