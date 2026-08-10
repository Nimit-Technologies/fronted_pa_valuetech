import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  session as sessionRequest,
  normalizeUser,
} from "@/features/auth/services";
import {
  loginSuccess,
  logout as logoutAction,
} from "@/features/auth/slice/authSlice";
import { useSession } from "./useSession";

/**
 * Confirms a persisted "logged in" Redux state (rehydrated by redux-persist
 * from localStorage) is still backed by a valid session cookie, by calling
 * GET /auth/session once when the app boots.
 *
 * Without this, reopening a tab after the backend's 24h cookie has expired
 * would render as logged-in — using stale, persisted Redux state — right up
 * until the first real API call comes back 401. This closes that gap
 * authoritatively instead of waiting on it.
 *
 * Only fires the network call if the persisted state already claims to be
 * authenticated; a fresh/unauthenticated visitor has nothing to verify.
 *
 * Returns { checking } so App.jsx can hold off rendering protected routes
 * until the one-time check resolves — avoiding a flash of authenticated UI
 * that then gets yanked away a moment later.
 */
export const useVerifySession = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSession();
  const [checking, setChecking] = useState(isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) return;

    let cancelled = false;

    (async () => {
      try {
        const response = await sessionRequest();
        if (cancelled) return;
        dispatch(loginSuccess({ user: normalizeUser(response.data) }));
      } catch {
        // Any failure (401 in practice) means the cookie is no longer
        // valid. The shared axios interceptor already handles redirecting
        // away from protected routes on 401 — this just makes sure Redux's
        // copy of "am I logged in" agrees with reality.
        if (!cancelled) dispatch(logoutAction());
      } finally {
        if (!cancelled) setChecking(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // Intentionally a one-time boot check, not re-run on every isAuthenticated
    // flip (logging in/out already updates state through their own hooks).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { checking };
};

export default useVerifySession;
