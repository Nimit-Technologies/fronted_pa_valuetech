import DeleteDepartmentAPI from "@/features/superAdmin/services/department/deleteDepartment";
import { toast } from "sonner";
import { useResourceCache } from "@/hooks/cache/useResourceCache";

const useDeleteDepartment = () => {
  // Drops the cached department list so the next read refetches.
  const { invalidate } = useResourceCache("department");
  const Delete = async (payload) => {
    try {
      const response = await DeleteDepartmentAPI(payload);
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
          "Failed to delete department",
        { duration: 700 },
      );
      return err;
    }
  };
  return { Delete };
};

export default useDeleteDepartment;
