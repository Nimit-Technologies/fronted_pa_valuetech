import CreateDepartmentAPI from "@/features/superAdmin/services/department/createDepartment";
import { toast } from "sonner";
import { useResourceCache } from "@/hooks/cache/useResourceCache";

const useCreateDepartment = () => {
  // Drops the cached department list so the next read refetches.
  const { invalidate } = useResourceCache("department");
  const Create = async (payload) => {
    try {
      const response = await CreateDepartmentAPI(payload);
      invalidate();
      toast.success(response?.message, {
        duration: 700,
      });
      return response?.data;
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.errors?.[0]?.message ||
          err?.message ||
          "Failed to create department",
        { duration: 700 },
      );
      // Rethrow so the caller can keep the form open with the user's input.
      throw err;
    }
  };
  return { Create };
};

export default useCreateDepartment;
