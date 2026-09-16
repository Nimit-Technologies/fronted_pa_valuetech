import CreateUserAPI from "@/features/superAdmin/services/user/createUser";
import { toast } from "sonner";

const useCreateUser = () => {
  const create = async (payload) => {
    try {
      const response = await CreateUserAPI(payload);
      toast.success(response?.message || "User created successfully", {
        duration: 700,
      });
      return response?.data;
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.errors?.[0]?.message ||
          err?.message ||
          "Failed to create user",
        { duration: 700 },
      );
      // Rethrow so the caller can keep the form open with the user's input.
      throw err;
    }
  };
  return { create };
};

export default useCreateUser;
