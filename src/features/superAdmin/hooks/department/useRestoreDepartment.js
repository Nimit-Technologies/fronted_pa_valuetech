import RestoreDepartmentAPI from "@/features/superAdmin/services/department/restoreDepartment";
import { toast } from "sonner";

const useRestoreDepartment = () => {
  const Restore = async (payload) => {
    try {
      const response = await RestoreDepartmentAPI(payload);
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
