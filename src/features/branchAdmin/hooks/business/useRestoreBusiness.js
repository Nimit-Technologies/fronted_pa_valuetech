import { toast } from "sonner";
import RestoreBusinessAPI from "@/features/branchAdmin/services/business/restoreBusiness";

const useRestoreBusiness = () => {
  const Restore = async (payload) => {
    try {
      const businessId =
        typeof payload === "object"
          ? (payload.businessId ?? payload.id)
          : payload;
      const response = await RestoreBusinessAPI(businessId);
      toast.success(response?.message, { duration: 700 });
      return response;
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.errors?.[0]?.message ||
          err?.message ||
          "Failed to restore business",
        { duration: 700 },
      );
      return err;
    }
  };

  return { Restore };
};

export default useRestoreBusiness;
