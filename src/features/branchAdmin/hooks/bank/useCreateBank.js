import { toast } from "sonner";
import CreateBankAPI from "@/features/branchAdmin/services/bank/createBank";

const useCreateBank = () => {
  const Create = async (payload) => {
    try {
      const response = await CreateBankAPI(payload);
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
