import RestoreDepartmentAPI from "@/features/superAdmin/services/department/restoreDepartment";
import { toast } from "sonner";
import { useResourceCache } from "@/hooks/cache/useResourceCache";

const useRestoreDepartment = () => {
  // Drops the cached department list so the next read refetches.
  const { invalidate } = useResourceCache("department");
  const Restore = async (payload) => {
    try {
      const response = await RestoreDepartmentAPI(payload);
      invalidate();
      toast.success(response?.message, {
        duration: 700,
      });
      return response;
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.errors?.[0]?.message ||
          err?.message ||
          "Failed to restore department",
        { duration: 700 },
      );
      return err;
    }
  };
  return { Restore };
};

export default useRestoreDepartment;
