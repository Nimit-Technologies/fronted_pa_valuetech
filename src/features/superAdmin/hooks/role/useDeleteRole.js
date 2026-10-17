import DeleteRoleAPI from "@/features/superAdmin/services/role/deleteRole";
import { toast } from "sonner";
import { useResourceCache } from "@/hooks/cache/useResourceCache";

const useDeleteRole = () => {
  // Drops the cached role list so the next read refetches.
  const { invalidate } = useResourceCache("role");
  const Delete = async (payload) => {
    try {
      const response = await DeleteRoleAPI(payload);
      invalidate();
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
