import { toast } from "sonner";
import UpdateBusinessStatusAPI from "@/features/superAdmin/services/business/updateBusinessStatus";
import { useResourceCache } from "@/hooks/cache/useResourceCache";

const useUpdateBusinessStatus = () => {
  // Drops the cached business list so the next read refetches.
  const { invalidate } = useResourceCache("business");
  const UpdateStatus = async (payload) => {
    try {
      const response = await UpdateBusinessStatusAPI(payload);
      invalidate();
      toast.success(response?.message, { duration: 700 });
      return response;
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.errors?.[0]?.message ||
          err?.message ||
          "Failed to update business status",
        { duration: 700 },
      );
      return err;
    }
  };

  return { UpdateStatus };
};

export default useUpdateBusinessStatus;
