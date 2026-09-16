import UpdateBranchStatusAPI from "@/features/superAdmin/services/branch/updateBranchStatus";
import { toast } from "sonner";

const useUpdateBranchStatus = () => {
  const UpdateStatus = async (payload) => {
    try {
      const response = await UpdateBranchStatusAPI(payload);
      toast.success(response?.message, {
        duration: 700,
      });
      return response;
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.errors?.[0]?.message ||
          err?.message ||
          "Failed to update branch status",
        { duration: 700 },
      );
      return err;
    }
  };
  return { UpdateStatus };
};

export default useUpdateBranchStatus;
