import UpdateUserStatusAPI from "@/features/superAdmin/services/user/updateUserStatus";
import { toast } from "sonner";
import { useResourceCache } from "@/hooks/cache/useResourceCache";

const useUpdateUserStatus = () => {
  // Drops the cached user list so the next read refetches.
  const { invalidate } = useResourceCache("user");
  const UpdateStatus = async (payload) => {
    try {
      const response = await UpdateUserStatusAPI(payload);
      invalidate();
      toast.success(response?.message || "User status updated", {
        duration: 700,
      });
      return response;
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.errors?.[0]?.message ||
          err?.message ||
          "Failed to update user status",
        { duration: 700 },
      );
      return err;
    }
  };
  return { UpdateStatus };
};

export default useUpdateUserStatus;
