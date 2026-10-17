import RestoreBranchAPI from "@/features/superAdmin/services/branch/restoreBranch";
import { toast } from "sonner";
import { useResourceCache } from "@/hooks/cache/useResourceCache";

const useRestoreBranch = () => {
  // Drops the cached branch list so the next read refetches.
  const { invalidate } = useResourceCache("branch");
  const Restore = async (payload) => {
    try {
      const response = await RestoreBranchAPI(payload);
      invalidate();
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
