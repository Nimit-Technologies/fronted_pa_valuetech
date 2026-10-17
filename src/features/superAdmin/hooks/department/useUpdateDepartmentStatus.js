import UpdateDepartmentStatusAPI from "@/features/superAdmin/services/department/updateDepartmentStatus";
import { toast } from "sonner";
import { useResourceCache } from "@/hooks/cache/useResourceCache";

const useUpdateDepartmentStatus = () => {
  // Drops the cached department list so the next read refetches.
  const { invalidate } = useResourceCache("department");
  const UpdateStatus = async (payload) => {
    try {
      const response = await UpdateDepartmentStatusAPI(payload);
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
          "Failed to update department status",
        { duration: 700 },
      );
      return err;
    }
  };
  return { UpdateStatus };
};

export default useUpdateDepartmentStatus;
