import UpdateDepartmentAPI from "@/features/superAdmin/services/department/updateDepartment";
import { toast } from "sonner";

const useUpdateDepartment = () => {
  const Update = async (payload) => {
    try {
      const response = await UpdateDepartmentAPI(payload);
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
