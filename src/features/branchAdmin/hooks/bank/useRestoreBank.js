import { toast } from "sonner";
import RestoreBankAPI from "@/features/branchAdmin/services/bank/restoreBank";

const useRestoreBank = () => {
  const Restore = async (payload) => {
    try {
      const response = await RestoreBankAPI(payload);
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
