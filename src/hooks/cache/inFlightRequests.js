/**
 * One in-flight request per identical query, shared by every caller.
 *
 * The TTL gate in useResourceCache only stops a *repeat* of a request that has
 * already finished. It cannot stop requests that start together, because none
 * of them has recorded a fetch yet — and starting together is the common case
 * here, not the rare one: the engineer's case table renders a status dropdown
 * per row, so a ten-row page used to fire ten identical GET /status/all-status
 * calls in the same tick. Dropdowns on a form do the same thing whenever two
 * of them read the same lookup list.
 *
 * So the two mechanisms are complementary, and both are needed:
 *   - isFresh      — "this finished recently, don't ask again"
 *   - dedupeRequest — "this is already in the air, wait for it"
 *
 * A module-level Map rather than redux state: promises are not serializable
 * and must never be persisted or time-travelled. The entry is dropped as soon
 * as the request settles, so nothing accumulates, and a failure is shared with
 * everyone waiting on it rather than being swallowed for all but the first
 * caller.
 */

const inFlight = new Map();

/**
 * @param {string} key identity of the request (resource + serialized args)
 * @param {() => Promise<unknown>} run performs the request
 * @returns {Promise<unknown>} the shared promise for this key
 */
export const dedupeRequest = (key, run) => {
  const pending = inFlight.get(key);
  if (pending) return pending;

  // Promise.resolve().then(run) rather than run() directly, so a `run` that
  // throws synchronously becomes a rejected promise like any other failure
  // instead of escaping past the bookkeeping below.
  const promise = Promise.resolve()
    .then(run)
    .finally(() => {
      // Only if it is still ours: a later call for the same key may have
      // registered its own promise after this one settled.
      if (inFlight.get(key) === promise) inFlight.delete(key);
    });

  inFlight.set(key, promise);
  return promise;
};

/** Whether a request for this key is currently in the air. */
export const hasInFlightRequest = (key) => inFlight.has(key);

/** Test seam, and the reset on logout. */
export const clearInFlightRequests = () => inFlight.clear();

export default dedupeRequest;
