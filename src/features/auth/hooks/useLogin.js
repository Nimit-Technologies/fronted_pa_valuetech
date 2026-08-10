import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { login as loginRequest, normalizeUser } from "@/features/auth/services";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "@/features/auth/slice/authSlice";
import useSession from "@/features/auth/hooks/useSession";
import { extractErrorMessage } from "@/utils/extractErrorMessage";

/**
 * Mutation-shaped hook wrapping POST /auth/login.
 *
 * `loading`/`error` are read via useSession() rather than local state —
 * login is one of the few cases where the hook's job *is* to drive global
 * identity state, so there's nothing local left to track separately.
 *
 * `login(payload)` resolves with the normalized user object on success (so
 * the caller can decide where to redirect) and rejects on failure — the
 * failure has already been dispatched to Redux and toasted by the time it
 * rejects, so callers only need to stop their own submit-in-progress state.
 */
export const useLogin = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSession();

  const login = async (payload) => {
    dispatch(loginStart());

    try {
      const response = await loginRequest(payload);
      const user = normalizeUser(response.data);

      dispatch(loginSuccess({ user }));
      return user;
    } catch (err) {
      const message = extractErrorMessage(
        err,
        "Unable to log in. Please try again.",
      );

      dispatch(loginFailure(message));
      toast.error(message);
      throw err;
    }
  };

  return { login, loading, error };
};

export default useLogin;
