import { setErrorReporter } from "@/utils/logger";

/**
 * Connects logger.warn/logger.error to something outside the browser.
 *
 * Deliberately dependency-free. logger.js stays vendor-neutral, and this is
 * the one place that decides where reports go, so adopting Sentry later means
 * replacing the body of installErrorReporter with its init plus:
 *
 *   setErrorReporter(({ level, message, data }) =>
 *     Sentry.captureMessage(message, { level, extra: data }),
 *   );
 *
 * and nothing else in the app changes.
 *
 * Until VITE_ERROR_REPORT_URL is set this installs nothing, so the default is
 * the same silence as before — but the wiring now exists and is switched on by
 * configuration rather than by a code change.
 *
 * The endpoint contract is a POST of
 *   { level, message, data, timestamp, path, userAgent, release }
 * with credentials omitted.
 */

const ENDPOINT = import.meta.env.VITE_ERROR_REPORT_URL;
const RELEASE = import.meta.env.VITE_APP_VERSION ?? "unknown";

// A render loop that throws can call this on every frame. Reports are capped
// per page load so a broken deploy cannot turn every browser into a traffic
// generator against the logging endpoint.
const MAX_REPORTS_PER_PAGE_LOAD = 20;
let sent = 0;

const post = (body) => {
  // sendBeacon is queued by the browser and survives the page unload that
  // often follows a crash — a plain fetch is cancelled mid-flight.
  if (typeof navigator !== "undefined" && navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    if (navigator.sendBeacon(ENDPOINT, blob)) return;
  }

  // keepalive gives the fallback the same survive-unload property.
  // credentials are omitted on purpose: the session cookie has no business
  // being sent to a logging endpoint, which may well be a third party.
  fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
    credentials: "omit",
  }).catch(() => {
    // Swallowed, and never routed back through logger.error — reporting a
    // failed report would recurse.
  });
};

/**
 * @returns {boolean} whether a reporter was installed.
 */
export const installErrorReporter = () => {
  if (!ENDPOINT) return false;

  setErrorReporter((report) => {
    if (sent >= MAX_REPORTS_PER_PAGE_LOAD) return;
    sent += 1;

    try {
      post(
        JSON.stringify({
          ...report,
          // Which screen it happened on. logger.js has already scrubbed
          // `data`; the path carries record ids but no personal fields.
          path: window.location.pathname,
          userAgent: navigator.userAgent,
          release: RELEASE,
        }),
      );
    } catch {
      // A payload that will not serialize must not take the app down.
    }
  });

  return true;
};

export default installErrorReporter;
