import DeleteBranchAPI from "@/features/superAdmin/services/branch/deleteBranch";
import { toast } from "sonner";

const useDeleteBranch = () => {
  const Delete = async (payload) => {
    try {
      const response = await DeleteBranchAPI(payload);
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
