import UpdateBranchAPI from "@/features/superAdmin/services/branch/updateBranch";
import { toast } from "sonner";

const useUpdateBranch = () => {
  const Update = async (payload) => {
    try {
      const response = await UpdateBranchAPI(payload);
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
