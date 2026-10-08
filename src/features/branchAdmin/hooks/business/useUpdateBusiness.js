import { toast } from "sonner";
import UpdateBusinessAPI from "@/features/branchAdmin/services/business/updateBusiness";

const useUpdateBusiness = () => {
  const Update = async (payload) => {
    try {
      const response = await UpdateBusinessAPI(payload);
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
