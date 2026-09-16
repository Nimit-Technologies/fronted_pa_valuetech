import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { login as loginRequest } from "@/features/auth/services";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "@/features/auth/slice/authSlice";
import useSession from "@/features/auth/hooks/useSession";
import { extractErrorMessage } from "@/utils/extractErrorMessage";

export const useLogin = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSession();

  const login = async (payload) => {
    dispatch(loginStart());

    try {
      const response = await loginRequest(payload);
      const user = response.data;

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
