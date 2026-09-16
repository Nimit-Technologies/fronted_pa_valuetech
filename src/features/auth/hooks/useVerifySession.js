import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { session as sessionRequest } from "@/features/auth/services";
import {
  loginSuccess,
  logout as logoutAction,
} from "@/features/auth/slice/authSlice";
import { useSession } from "./useSession";

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
        dispatch(loginSuccess({ user: response.data }));
      } catch (err) {
        if (cancelled) return;

        const status = axios.isAxiosError(err) ? err.response?.status : null;
        if (status === 401 || status === 403) {
          dispatch(logoutAction());
        }
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
