import UpdateDepartmentAPI from "@/features/superAdmin/services/department/updateDepartment";
import { toast } from "sonner";
import { useResourceCache } from "@/hooks/cache/useResourceCache";

const useUpdateDepartment = () => {
  // Drops the cached department list so the next read refetches.
  const { invalidate } = useResourceCache("department");
  const Update = async (payload) => {
    try {
      const response = await UpdateDepartmentAPI(payload);
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
          "Failed to update department",
        { duration: 700 },
      );
      // Rethrow so the caller can keep the form open with the user's input.
      throw err;
    }
  };
  return { Update };
};

export default useUpdateDepartment;
