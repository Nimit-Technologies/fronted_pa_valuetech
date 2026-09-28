import { toast } from "sonner";
import UpdateBankAPI from "@/features/branchAdmin/services/bank/updateBank";

const useUpdateBank = () => {
  const Update = async (payload) => {
    try {
      const response = await UpdateBankAPI(payload);
      toast.success(response?.message || "Bank updated successfully", {
        duration: 700,
      });
      return response;
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.errors?.[0]?.message ||
          err?.message ||
          "Failed to update bank",
        { duration: 700 },
      );
      throw err;
    }
  };

  return { Update };
};

export default useUpdateBank;
