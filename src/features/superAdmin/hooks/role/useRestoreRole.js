import RestoreRoleAPI from "@/features/superAdmin/services/role/restoreRole";
import { toast } from "sonner";

const useRestoreRole = () => {
  const Restore = async (payload) => {
    try {
      const response = await RestoreRoleAPI(payload);
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
