import { useCallback } from "react";
import { toast } from "sonner";
import getBankByIdAPI from "@/features/branchAdmin/services/bank/getBankById";
import { normalizeBank } from "@/features/branchAdmin/services/bank/normalizeBank";
import logger from "@/utils/logger";

const useGetBankById = () => {
  const getBankById = useCallback(async (id) => {
    try {
      const response = await getBankByIdAPI(id);
      return normalizeBank(response.data);
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.errors?.[0]?.message ||
          err?.message ||
          "Failed to fetch bank",
        { duration: 700 },
      );
      logger.error("Failed to fetch bank", err);
      return undefined;
    }
  }, []);

  return { getBankById };
};

export default useGetBankById;
