import UpdateBranchAPI from "@/features/superAdmin/services/branch/updateBranch";
import { toast } from "sonner";
import { useResourceCache } from "@/hooks/cache/useResourceCache";

const useUpdateBranch = () => {
  // Drops the cached branch list so the next read refetches.
  const { invalidate } = useResourceCache("branch");
  const Update = async (payload) => {
    try {
      const response = await UpdateBranchAPI(payload);
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
          "Failed to update branch",
        { duration: 700 },
      );
      // Rethrow so the caller can keep the form open with the user's input.
      throw err;
    }
  };
  return { Update };
};

export default useUpdateBranch;
