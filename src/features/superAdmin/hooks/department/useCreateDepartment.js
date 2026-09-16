import CreateDepartmentAPI from "@/features/superAdmin/services/department/createDepartment";
import { toast } from "sonner";

const useCreateDepartment = () => {
  const Create = async (payload) => {
    try {
      const response = await CreateDepartmentAPI(payload);
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
