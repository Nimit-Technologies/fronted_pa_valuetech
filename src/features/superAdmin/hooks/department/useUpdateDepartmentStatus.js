import UpdateDepartmentStatusAPI from "@/features/superAdmin/services/department/updateDepartmentStatus";
import { toast } from "sonner";

const useUpdateDepartmentStatus = () => {
  const UpdateStatus = async (payload) => {
    try {
      const response = await UpdateDepartmentStatusAPI(payload);
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
