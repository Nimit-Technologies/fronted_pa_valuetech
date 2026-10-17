import DeleteBranchAPI from "@/features/superAdmin/services/branch/deleteBranch";
import { toast } from "sonner";
import { useResourceCache } from "@/hooks/cache/useResourceCache";

const useDeleteBranch = () => {
  // Drops the cached branch list so the next read refetches.
  const { invalidate } = useResourceCache("branch");
  const Delete = async (payload) => {
    try {
      const response = await DeleteBranchAPI(payload);
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
          "Failed to delete branch",
        { duration: 700 },
      );
      return err;
    }
  };
  return { Delete };
};

export default useDeleteBranch;
