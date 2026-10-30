/**
 * Where to send a user back to once they have logged in.
 *
 * A user who opens a link to /cordinator/case/view/42 without a live session
 * has to log in first, and sending them to their dashboard afterwards loses the
 * thing they actually wanted. This remembers the path across that detour.
 *
 * sessionStorage rather than router state, because the two ways a user arrives
 * at the login screen do not share a router:
 *
 *   - ProtectedRoute redirects inside the SPA (router state would work), and
 *   - the 401 interceptor in axiosInstance does `window.location.href = "/"`,
 *     a full document load that discards everything in memory.
 *
 * sessionStorage survives the second and is scoped to the one tab, so a path
 * remembered in one tab never hijacks the login happening in another. It is
 * read exactly once (`takeReturnTo`) so a path cannot be replayed on a later
 * login, and logout clears it so one user's destination is never handed to the
 * next person to sign in on the same machine.
 */

const KEY = "pa:returnTo";

// The login screen itself lives at "/" (see App.jsx). Remembering either of
// these would send the user back to login after logging in.
const PUBLIC_PATHS = new Set(["/", "/login"]);

// Only in-app paths. A value starting "//" or "/\" is read by the browser as a
// protocol-relative URL, so storing one would turn this into an open redirect:
// a crafted link could bounce a freshly authenticated user to another host.
const isSafeAppPath = (path) =>
  typeof path === "string" &&
  path.startsWith("/") &&
  !path.startsWith("//") &&
  !path.startsWith("/\\") &&
  !PUBLIC_PATHS.has(path);

// Private browsing and blocked site data make sessionStorage throw on access
// rather than return null, and losing the return path is never worth taking
// the login screen down with it.
const safely = (operation, fallback = null) => {
  try {
    return operation();
  } catch {
    return fallback;
  }
};

/**
 * Remember a path to return to after login. Ignores anything that is not an
 * in-app path, and anything that would just send the user back to login.
 *
 * @param {string} path pathname, optionally with search and hash
 */
export const rememberReturnTo = (path) => {
  if (!isSafeAppPath(path)) return;
  safely(() => window.sessionStorage.setItem(KEY, path));
};

/** Remember the path the browser is on right now, if it is worth returning to. */
export const rememberCurrentPath = () => {
  const { pathname, search, hash } = window.location;
  rememberReturnTo(`${pathname}${search}${hash}`);
};

/**
 * Read and forget the remembered path.
 *
 * @returns {string | null} the path, or null if there is none to return to
 */
export const takeReturnTo = () => {
  const stored = safely(() => window.sessionStorage.getItem(KEY));
  if (stored) safely(() => window.sessionStorage.removeItem(KEY));

  // Re-checked on the way out: the value could have been edited by hand, or
  // written by an older build with different rules.
  return isSafeAppPath(stored) ? stored : null;
};

/** Forget any remembered path, e.g. on logout. */
export const clearReturnTo = () => {
  safely(() => window.sessionStorage.removeItem(KEY));
};
