import RestoreUserAPI from "@/features/superAdmin/services/user/restoreUser";
import { toast } from "sonner";

const useRestoreUser = () => {
  const Restore = async (payload) => {
    try {
      const response = await RestoreUserAPI(payload);
      toast.success(response?.message || "User restored successfully", {
        duration: 700,
      });
      return response;
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.errors?.[0]?.message ||
          err?.message ||
          "Failed to restore user",
        { duration: 700 },
      );
      return err;
    }
  };
  return { Restore };
};

export default useRestoreUser;
