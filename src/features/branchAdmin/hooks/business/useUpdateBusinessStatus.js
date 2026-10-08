import { toast } from "sonner";
import UpdateBusinessStatusAPI from "@/features/branchAdmin/services/business/updateBusinessStatus";

const useUpdateBusinessStatus = () => {
  const UpdateStatus = async (payload) => {
    try {
      const response = await UpdateBusinessStatusAPI(payload);
      toast.success(response?.message, { duration: 700 });
      return response;
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.errors?.[0]?.message ||
          err?.message ||
          "Failed to update business status",
        { duration: 700 },
      );
      return err;
    }
  };

  return { UpdateStatus };
};

export default useUpdateBusinessStatus;
