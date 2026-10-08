import { toast } from "sonner";
import CreateBusinessAPI from "@/features/branchAdmin/services/business/createBusiness";

const useCreateBusiness = () => {
  const Create = async (payload) => {
    try {
      const response = await CreateBusinessAPI(payload);
      toast.success(response?.message || "Business created successfully", {
        duration: 700,
      });
      return response?.data;
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.errors?.[0]?.message ||
          err?.message ||
          "Failed to create business",
        { duration: 700 },
      );
      throw err;
    }
  };

  return { Create };
};

export default useCreateBusiness;
