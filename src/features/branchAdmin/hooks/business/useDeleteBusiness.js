import { toast } from "sonner";
import DeleteBusinessAPI from "@/features/branchAdmin/services/business/deleteBusiness";

const useDeleteBusiness = () => {
  const Delete = async (payload) => {
    try {
      const businessId =
        typeof payload === "object"
          ? (payload.businessId ?? payload.id)
          : payload;
      const response = await DeleteBusinessAPI(businessId);
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
