import UpdateUserStatusAPI from "@/features/superAdmin/services/user/updateUserStatus";
import { toast } from "sonner";

const useUpdateUserStatus = () => {
  const UpdateStatus = async (payload) => {
    try {
      const response = await UpdateUserStatusAPI(payload);
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
