import { toast } from "sonner";
import CreateBankAPI from "@/features/branchAdmin/services/bank/createBank";
import { useResourceCache } from "@/hooks/cache/useResourceCache";

const useCreateBank = () => {
  // Drops the cached bank list so the next read refetches.
  const { invalidate } = useResourceCache("bank");
  const Create = async (payload) => {
    try {
      const response = await CreateBankAPI(payload);
      invalidate();
      toast.success(response?.message || "Bank created successfully", {
        duration: 700,
      });
      return response?.data;
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.errors?.[0]?.message ||
          err?.message ||
          "Failed to create bank",
        { duration: 700 },
      );
      throw err;
    }
  };

  return { Create };
};

export default useCreateBank;
