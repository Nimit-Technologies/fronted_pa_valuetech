import UpdateRoleStatusAPI from "@/features/superAdmin/services/role/updateRoleStatus";
import { toast } from "sonner";
import { useResourceCache } from "@/hooks/cache/useResourceCache";

const useUpdateRoleStatus = () => {
  // Drops the cached role list so the next read refetches.
  const { invalidate } = useResourceCache("role");
  const UpdateStatus = async (payload) => {
    try {
      const response = await UpdateRoleStatusAPI(payload);
      invalidate();
      toast.success(response?.message || "Role status updated", {
        duration: 700,
      });
      return response;
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.errors?.[0]?.message ||
          err?.message ||
          "Failed to update role status",
        { duration: 700 },
      );
      return err;
    }
  };
  return { UpdateStatus };
};

export default useUpdateRoleStatus;
