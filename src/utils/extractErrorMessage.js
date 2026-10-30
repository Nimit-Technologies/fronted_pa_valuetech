/**
 * The one place a caught error becomes something a user can read.
 *
 * Duck-typed rather than gated on `axios.isAxiosError`: the same shape reaches
 * here from a rethrow, from a hook that already handled and re-raised it, and
 * from a test double that is not a real AxiosError — and all of them carry
 * exactly the fields worth reading. Checking the class instead meant those
 * cases silently fell through to the fallback.
 *
 * Order matters:
 *   data.message            the API's own sentence, written for a user
 *   data.errors[0].message  a failed zod parse answers with issues and no
 *                           top-level message, so the first issue is the only
 *                           readable thing in the payload
 *   transport wording       the request never reached a server, so there is no
 *                           API message to use — say so in words a user can
 *                           act on ("check your connection"), never in axios's
 *                           own ("timeout of 30000ms exceeded", "Network
 *                           Error", "ERR_BAD_RESPONSE")
 *   status wording          a response with no readable body: the status is
 *                           then the only thing that says what happened
 *   fallback                nothing usable, so the caller's wording wins
 */

// Reached only when the API said nothing readable. Each one is the plain-words
// version of a status this app actually produces.
const STATUS_MESSAGES = {
  // The backend answers 404 — not 403 — for a record in another branch, so
  // this wording has to cover both "gone" and "not yours" without implying the
  // record exists somewhere.
  404: "We couldn't find that record. It may have been removed, or it may belong to another branch.",
  // Deliberately not a logout: a 403 means this account may not do this one
  // thing, and the session is still perfectly good.
  403: "You don't have permission to do this. Contact your administrator if you need access.",
  401: "Your session has ended. Please log in again.",
  409: "Someone else changed this record first. Reload the page and try again.",
  413: "That file is too large to upload.",
  422: "Some of the details entered aren't valid. Check the highlighted fields.",
  // The one case where retrying is exactly the wrong advice, so the message
  // says to wait instead. The API usually sends its own sentence here; this is
  // the backstop for the proxy returning a bare 429.
  429: "Too many attempts. Please wait a minute and try again.",
};

const SERVER_ERROR =
  "The server ran into a problem. Please try again in a moment.";

const TIMEOUT =
  "The server took too long to respond. Check your connection and try again.";

const UNREACHABLE =
  "Can't reach the server. Check your internet connection and try again.";

const OFFLINE = "You appear to be offline. Reconnect and try again.";

// Axios reports a timeout as ECONNABORTED (and ETIMEDOUT behind some proxies),
// with the duration in the message. Matched on the message too because a
// rethrown or re-wrapped error sometimes keeps only that.
const isTimeout = (err) =>
  err?.code === "ECONNABORTED" ||
  err?.code === "ETIMEDOUT" ||
  /timeout/i.test(err?.message ?? "");

// A request that produced no response at all: the browser is offline, DNS or
// TLS failed, CORS rejected it before it was readable, or it was aborted.
// `isAxiosError` is not required — several call sites and tests raise a plain
// Error("Network Error") to mean exactly this.
const isTransportFailure = (err) =>
  Boolean(err?.code) ||
  err?.isAxiosError === true ||
  /network error/i.test(err?.message ?? "");

const isOffline = () =>
  typeof navigator !== "undefined" && navigator.onLine === false;

export function extractErrorMessage(err, fallback) {
  const data = err?.response?.data;

  if (data) {
    const apiMessage = data.message ?? data.errors?.[0]?.message;
    if (typeof apiMessage === "string" && apiMessage.trim()) return apiMessage;
  }

  const status = err?.response?.status;

  if (status === undefined) {
    // A cancelled request is not a failure the user caused or needs to see —
    // it is a screen that moved on. The caller's wording decides whether it
    // says anything at all.
    if (err?.code === "ERR_CANCELED") return fallback;

    if (isTimeout(err)) return TIMEOUT;
    if (isOffline()) return OFFLINE;
    if (isTransportFailure(err)) return UNREACHABLE;

    // Not a transport failure: a plain Error thrown by app code, whose message
    // was written for this screen. Kept, as it was before.
    if (typeof err?.message === "string" && err.message.trim()) {
      return err.message;
    }

    return fallback;
  }

  if (STATUS_MESSAGES[status]) return STATUS_MESSAGES[status];
  if (status >= 500) return SERVER_ERROR;

  // A 4xx this app does not produce. The caller knows what it was asking for,
  // so its wording beats "Request failed with status code 418".
  return fallback;
}

export default extractErrorMessage;
