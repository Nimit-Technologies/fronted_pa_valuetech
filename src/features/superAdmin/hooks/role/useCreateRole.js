import CreateRoleAPI from "@/features/superAdmin/services/role/createRole";
import { toast } from "sonner";

const useCreateRole = () => {
  const Create = async (payload) => {
    try {
      const response = await CreateRoleAPI(payload);
      // The create route returns { success, data } without a message.
      toast.success(response?.message || "Role created successfully", {
        duration: 700,
      });
      return response?.data;
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.errors?.[0]?.message ||
          err?.message ||
          "Failed to create role",
        { duration: 700 },
      );
      // Rethrow so the caller can keep the form open with the user's input.
      throw err;
    }
  };
  return { Create };
};

export default useCreateRole;
