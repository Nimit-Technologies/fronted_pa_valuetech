import { toast } from "sonner";
import RestoreBusinessAPI from "@/features/superAdmin/services/business/restoreBusiness";
import { useResourceCache } from "@/hooks/cache/useResourceCache";

const useRestoreBusiness = () => {
  // Drops the cached business list so the next read refetches.
  const { invalidate } = useResourceCache("business");
  const Restore = async (payload) => {
    try {
      const businessId =
        typeof payload === "object"
          ? (payload.businessId ?? payload.id)
          : payload;
      const response = await RestoreBusinessAPI(businessId);
      invalidate();
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
