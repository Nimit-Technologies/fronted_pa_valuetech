import CreateBranchAPI from "@/features/superAdmin/services/branch/createBranch";
import { toast } from "sonner";

const useCreateBranch = () => {
  const Create = async (payload) => {
    try {
      const response = await CreateBranchAPI(payload);
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
