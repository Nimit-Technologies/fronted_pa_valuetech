import CreateBranchAPI from "@/features/superAdmin/services/branch/createBranch";
import { toast } from "sonner";
import { useResourceCache } from "@/hooks/cache/useResourceCache";

const useCreateBranch = () => {
  // Drops the cached branch list so the next read refetches.
  const { invalidate } = useResourceCache("branch");
  const Create = async (payload) => {
    try {
      const response = await CreateBranchAPI(payload);
      invalidate();
      toast.success(response?.message, {
        duration: 700,
      });
      return response?.data;
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.errors?.[0]?.message ||
          err?.message ||
          "Failed to create branch",
        { duration: 700 },
      );
      // Rethrow so the caller can keep the form open with the user's input.
      throw err;
    }
  };
  return { Create };
};

export default useCreateBranch;
