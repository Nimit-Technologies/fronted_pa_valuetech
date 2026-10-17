import { toast } from "sonner";
import UpdateBusinessAPI from "@/features/superAdmin/services/business/updateBusiness";
import { useResourceCache } from "@/hooks/cache/useResourceCache";

const useUpdateBusiness = () => {
  // Drops the cached business list so the next read refetches.
  const { invalidate } = useResourceCache("business");
  const Update = async (payload) => {
    try {
      const response = await UpdateBusinessAPI(payload);
      invalidate();
      toast.success(response?.message || "Business updated successfully", {
        duration: 700,
      });
      return response;
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.errors?.[0]?.message ||
          err?.message ||
          "Failed to update business",
        { duration: 700 },
      );
      throw err;
    }
  };

  return { Update };
};

export default useUpdateBusiness;
