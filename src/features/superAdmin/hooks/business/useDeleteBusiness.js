import { toast } from "sonner";
import DeleteBusinessAPI from "@/features/superAdmin/services/business/deleteBusiness";
import { useResourceCache } from "@/hooks/cache/useResourceCache";

const useDeleteBusiness = () => {
  // Drops the cached business list so the next read refetches.
  const { invalidate } = useResourceCache("business");
  const Delete = async (payload) => {
    try {
      const businessId =
        typeof payload === "object"
          ? (payload.businessId ?? payload.id)
          : payload;
      const response = await DeleteBusinessAPI(businessId);
      invalidate();
      toast.success(response?.message, { duration: 700 });
      return response;
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.errors?.[0]?.message ||
          err?.message ||
          "Failed to delete business",
        { duration: 700 },
      );
      throw err;
    }
  };

  return { Delete };
};

export default useDeleteBusiness;
