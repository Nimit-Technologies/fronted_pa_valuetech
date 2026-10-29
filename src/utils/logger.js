/**
 * Production-ready logging utility with environment-aware levels
 */

const LOG_LEVELS = {
  development: 0,
  staging: 1,
  production: 2,
};

const LOG_LEVEL = LOG_LEVELS[import.meta.env.MODE] || LOG_LEVELS.production;

// Keys whose values never leave the browser: credentials, the session cookie,
// and the personal fields the backend itself masks on the way out. Matched as
// substrings, case-insensitively, so `aadhaar_number`, `aadhaarNumber` and
// `Authorization` are all covered. Deliberately narrow enough not to catch
// `isAuthenticated`.
//
// `adhar` is listed alongside `aadhaar` on purpose, and is the one place the
// old misspelling survives: it is a safety net, not a naming choice. Every
// field in this codebase is spelled `aadhaar`, to match the backend, but a
// redactor that only recognises the correct spelling would quietly leak an
// Aadhaar number the day someone reintroduces the typo.
const SENSITIVE_KEY =
  /password|passwd|secret|token|cookie|authorization|aadhaar|adhar|otp|email|phone|mobile/i;

const REDACTED = "[redacted]";

// Deep enough for an error payload, shallow enough that a cyclic or huge
// object can't stall the reporter.
const MAX_DEPTH = 4;

const scrub = (value, depth = 0) => {
  if (value === null || typeof value !== "object") return value;
  if (depth >= MAX_DEPTH) return "[truncated]";
  if (Array.isArray(value)) return value.map((item) => scrub(item, depth + 1));

  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [
      key,
      SENSITIVE_KEY.test(key) ? REDACTED : scrub(item, depth + 1),
    ]),
  );
};

// Axios hangs the whole request off the error as `config`, and `config.data`
// on the login call is the plaintext password. So an Error is reduced to the
// fields that say *which* call failed and nothing more — no request body, no
// response body, both of which routinely carry credentials or Aadhaar.
const serializeError = (error) => {
  if (!(error instanceof Error)) return scrub(error);

  const serialized = {
    name: error.name,
    message: error.message,
    stack: error.stack,
  };

  if (error.config) {
    serialized.request = {
      method: error.config.method,
      url: error.config.url,
    };
  }

  if (error.response) {
    serialized.status = error.response.status;
  }

  return serialized;
};

// The transport, registered at startup by whoever owns the error-tracking
// vendor (see setErrorReporter). Left unset, warn/error stay local to the
// console and nothing is sent anywhere.
let errorReporter = null;

/**
 * Register the sink that warnings and errors are forwarded to.
 *
 * Kept vendor-neutral on purpose: this module has no Sentry dependency, so
 * choosing a tracker is a one-line change at the call site rather than an edit
 * here. Wiring Sentry, for example, is its own `init` plus:
 *
 *   setErrorReporter(({ level, message, data }) =>
 *     Sentry.captureMessage(message, { level, extra: data }),
 *   );
 *
 * Gate the registration itself on environment (and on VITE_SENTRY_DSN being
 * set) so local development stays quiet.
 *
 * @param {((report: { level: string, message: string, data: unknown,
 *   timestamp: string }) => void) | null} reporter
 */
export const setErrorReporter = (reporter) => {
  errorReporter = reporter;
};

class Logger {
  log(message, data = null) {
    if (LOG_LEVEL <= 0) {
      console.log(`[LOG] ${message}`, data || "");
    }
  }

  debug(message, data = null) {
    if (LOG_LEVEL <= 0) {
      console.debug(`[DEBUG] ${message}`, data || "");
    }
  }

  info(message, data = null) {
    if (LOG_LEVEL <= 0) {
      console.info(`[INFO] ${message}`, data || "");
    }
  }

  warn(message, data = null) {
    if (LOG_LEVEL <= 1) {
      console.warn(`[WARN] ${message}`, data || "");
    }
    this.reportToService("warning", message, data);
  }

  error(message, error = null) {
    // Stripped from production bundles by terser's drop_console, which is why
    // reportToService below is the only path that survives a release build.
    console.error(`[ERROR] ${message}`, error || "");
    this.reportToService("error", message, error);
  }

  /**
   * Forward a warning or error to the registered tracker, with credentials and
   * personal data removed first.
   */
  reportToService(level, message, data) {
    if (!errorReporter) return;

    try {
      errorReporter({
        level,
        message,
        data: serializeError(data),
        timestamp: new Date().toISOString(),
      });
    } catch {
      // A broken reporter must never escalate into an app crash, and must not
      // recurse back through this.error() either.
    }
  }
}

export default new Logger();
