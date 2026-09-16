import RestoreBranchAPI from "@/features/superAdmin/services/branch/restoreBranch";
import { toast } from "sonner";

const useRestoreBranch = () => {
  const Restore = async (payload) => {
    try {
      const response = await RestoreBranchAPI(payload);
      toast.success(response?.message, {
        duration: 700,
      });
      return response;
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.errors?.[0]?.message ||
          err?.message ||
          "Failed to restore branch",
        { duration: 700 },
      );
      return err;
    }
  };
  return { Restore };
};

export default useRestoreBranch;
