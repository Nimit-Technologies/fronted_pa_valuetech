import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { logout as logoutRequest } from "@/features/auth/services";
import {
  logoutStart,
  logout as logoutAction,
} from "@/features/auth/slice/authSlice";
import useSession from "@/features/auth/hooks/useSession";
import { extractErrorMessage } from "@/utils/extractErrorMessage";
import { clearReturnTo } from "@/features/auth/returnTo";

export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSession();

  const logout = async () => {
    dispatch(logoutStart());

    try {
      await logoutRequest();
    } catch (err) {
      toast.error(
        extractErrorMessage(
          err,
          "Logout request failed, session cleared locally.",
        ),
      );
    } finally {
      // Before the state reset, so the next person to sign in on this machine
      // is never dropped onto the page this user was last looking at.
      clearReturnTo();
      dispatch(logoutAction());
      navigate("/", { replace: true });
    }
  };

  return { logout, loading, error };
};

export default useLogout;
