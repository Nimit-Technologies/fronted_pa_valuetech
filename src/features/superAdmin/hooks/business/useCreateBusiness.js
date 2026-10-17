import { toast } from "sonner";
import CreateBusinessAPI from "@/features/superAdmin/services/business/createBusiness";
import { useResourceCache } from "@/hooks/cache/useResourceCache";

const useCreateBusiness = () => {
  // Drops the cached business list so the next read refetches.
  const { invalidate } = useResourceCache("business");
  const Create = async (payload) => {
    try {
      const response = await CreateBusinessAPI(payload);
      invalidate();
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
