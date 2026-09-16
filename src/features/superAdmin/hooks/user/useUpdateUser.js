import UpdateUserAPI from "@/features/superAdmin/services/user/updateUser";
import { toast } from "sonner";

const useUpdateUser = () => {
  const update = async (payload) => {
    try {
      const response = await UpdateUserAPI(payload);
      toast.success(response?.message || "User updated successfully", {
        duration: 700,
      });
      return response;
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0]?.message ||
        err?.message ||
        "Failed to update user";

      toast.error(message, {
        duration: 700,
      });
      throw err;
    }
  };

  return { update };
};

export default useUpdateUser;
