import { toast } from "sonner";
import UpdateBankStatusAPI from "@/features/branchAdmin/services/bank/updateBankStatus";

const useUpdateBankStatus = () => {
  const UpdateStatus = async (payload) => {
    try {
      const response = await UpdateBankStatusAPI(payload);
      toast.success(response?.message, { duration: 700 });
      return response;
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.errors?.[0]?.message ||
          err?.message ||
          "Failed to update bank status",
        { duration: 700 },
      );
      return err;
    }
  };

  return { UpdateStatus };
};

export default useUpdateBankStatus;
