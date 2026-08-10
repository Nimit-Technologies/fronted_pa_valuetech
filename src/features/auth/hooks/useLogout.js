import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { logout as logoutRequest } from "@/features/auth/services";
import { logout as logoutAction } from "@/features/auth/slice/authSlice";
import { extractErrorMessage } from "@/utils/extractErrorMessage";

/**
 * Mutation-shaped hook wrapping POST /auth/logout.
 *
 * Clears local auth state even if the server call itself fails — an
 * already-expired/invalid cookie shouldn't strand the user in a "logged in"
 * UI just because the logout request couldn't reach a valid session either.
 */
export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    setLoading(true);

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
      dispatch(logoutAction());
      setLoading(false);
      navigate("/login", { replace: true });
    }
  };

  return { logout, loading };
};

export default useLogout;
