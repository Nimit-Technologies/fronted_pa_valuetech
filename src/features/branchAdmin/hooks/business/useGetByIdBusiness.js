import { useCallback } from "react";
import { toast } from "sonner";
import getBusinessByIdAPI from "@/features/branchAdmin/services/business/getBusinessById";
import { normalizeBusiness } from "@/features/branchAdmin/services/business/normalizeBusiness";
import logger from "@/utils/logger";

const useGetByIdBusiness = () => {
  const getBusinessById = useCallback(async (id) => {
    try {
      const response = await getBusinessByIdAPI(id);
      return normalizeBusiness(response.data);
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.errors?.[0]?.message ||
          err?.message ||
          "Failed to fetch business",
        { duration: 700 },
      );
      logger.error("Failed to fetch business", err);
      return undefined;
    }
  }, []);

  return { getBusinessById };
};

export default useGetByIdBusiness;
