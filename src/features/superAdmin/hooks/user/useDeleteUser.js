import DeleteUserAPI from "@/features/superAdmin/services/user/deleteUser";
import { toast } from "sonner";
import { useResourceCache } from "@/hooks/cache/useResourceCache";

const useDeleteUser = () => {
  // Drops the cached user list so the next read refetches.
  const { invalidate } = useResourceCache("user");
  const Delete = async (payload) => {
    try {
      const response = await DeleteUserAPI(payload);
      invalidate();
      toast.success(response?.message || "User deleted successfully", {
        duration: 700,
      });
      return response;
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.errors?.[0]?.message ||
          err?.message ||
          "Failed to delete user",
        { duration: 700 },
      );
      return err;
    }
  };
  return { Delete };
};

export default useDeleteUser;
