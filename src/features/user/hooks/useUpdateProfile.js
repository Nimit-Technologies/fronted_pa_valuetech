import { useDispatch } from "react-redux";
import { toast } from "sonner";
import UpdateProfileAPI from "@/features/user/services/updateProfile";
import { loginSuccess } from "@/features/auth/slice/authSlice";

const useUpdateProfile = () => {
  const dispatch = useDispatch();

  const update = async (form) => {
    try {
      const response = await UpdateProfileAPI(form);

      // The response carries the fresh record (or none, on a no-op submit);
      // sync it into the session so the navbar/avatar reflect the edit
      // immediately instead of waiting for the next session re-verify.
      if (response?.data) {
        dispatch(loginSuccess({ user: response.data }));
      }

      toast.success(response?.message || "Profile updated successfully", {
        duration: 700,
      });
      return response;
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0]?.message ||
        err?.message ||
        "Failed to update profile";

      toast.error(message, { duration: 700 });
      throw err;
    }
  };

  return { update };
};

export default useUpdateProfile;
