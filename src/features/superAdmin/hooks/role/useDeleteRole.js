import DeleteRoleAPI from "@/features/superAdmin/services/role/deleteRole";
import { toast } from "sonner";

const useDeleteRole = () => {
  const Delete = async (payload) => {
    try {
      const response = await DeleteRoleAPI(payload);
      toast.success(response?.message || "Role deleted successfully", {
        duration: 700,
      });
      return response;
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.errors?.[0]?.message ||
          err?.message ||
          "Failed to delete role",
        { duration: 700 },
      );
      return err;
    }
  };
  return { Delete };
};

export default useDeleteRole;
