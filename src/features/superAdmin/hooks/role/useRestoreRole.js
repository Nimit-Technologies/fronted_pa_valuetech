import RestoreRoleAPI from "@/features/superAdmin/services/role/restoreRole";
import { toast } from "sonner";
import { useResourceCache } from "@/hooks/cache/useResourceCache";

const useRestoreRole = () => {
  // Drops the cached role list so the next read refetches.
  const { invalidate } = useResourceCache("role");
  const Restore = async (payload) => {
    try {
      const response = await RestoreRoleAPI(payload);
      invalidate();
      toast.success(response?.message || "Role restored successfully", {
        duration: 700,
      });
      return response;
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.errors?.[0]?.message ||
          err?.message ||
          "Failed to restore role",
        { duration: 700 },
      );
      return err;
    }
  };

  return { Restore };
};

export default useRestoreRole;
