import { toast } from "sonner";
import RestoreBankAPI from "@/features/branchAdmin/services/bank/restoreBank";
import { useResourceCache } from "@/hooks/cache/useResourceCache";

const useRestoreBank = () => {
  // Drops the cached bank list so the next read refetches.
  const { invalidate } = useResourceCache("bank");
  const Restore = async (payload) => {
    try {
      const response = await RestoreBankAPI(payload);
      invalidate();
      toast.success(response?.message, { duration: 700 });
      return response;
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.errors?.[0]?.message ||
          err?.message ||
          "Failed to restore bank",
        { duration: 700 },
      );
      return err;
    }
  };

  return { Restore };
};

export default useRestoreBank;
