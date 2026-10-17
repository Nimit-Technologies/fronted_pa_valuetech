import { toast } from "sonner";
import UpdateBankStatusAPI from "@/features/branchAdmin/services/bank/updateBankStatus";
import { useResourceCache } from "@/hooks/cache/useResourceCache";

const useUpdateBankStatus = () => {
  // Drops the cached bank list so the next read refetches.
  const { invalidate } = useResourceCache("bank");
  const UpdateStatus = async (payload) => {
    try {
      const response = await UpdateBankStatusAPI(payload);
      invalidate();
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
