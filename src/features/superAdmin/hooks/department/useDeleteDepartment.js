import DeleteDepartmentAPI from "@/features/superAdmin/services/department/deleteDepartment";
import { toast } from "sonner";

const useDeleteDepartment = () => {
  const Delete = async (payload) => {
    try {
      const response = await DeleteDepartmentAPI(payload);
      toast.success(response?.message, {
        duration: 700,
      });
      return response;
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.errors?.[0]?.message ||
          err?.message ||
          "Failed to delete department",
        { duration: 700 },
      );
      return err;
    }
  };
  return { Delete };
};

export default useDeleteDepartment;
