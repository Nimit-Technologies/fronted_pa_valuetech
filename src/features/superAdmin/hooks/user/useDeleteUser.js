import DeleteUserAPI from "@/features/superAdmin/services/user/deleteUser";
import { toast } from "sonner";

const useDeleteUser = () => {
  const Delete = async (payload) => {
    try {
      const response = await DeleteUserAPI(payload);
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
