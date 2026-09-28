import { toast } from "sonner";
import DeleteBankAPI from "@/features/branchAdmin/services/bank/deleteBank";

const useDeleteBank = () => {
  const Delete = async (payload) => {
    try {
      const response = await DeleteBankAPI(payload);
      toast.success(response?.message, { duration: 700 });
      return response;
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.errors?.[0]?.message ||
          err?.message ||
          "Failed to delete bank",
        { duration: 700 },
      );
      return err;
    }
  };

  return { Delete };
};

export default useDeleteBank;
