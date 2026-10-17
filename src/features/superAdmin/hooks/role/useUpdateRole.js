import UpdateRoleAPI from "@/features/superAdmin/services/role/updateRole";
import { toast } from "sonner";
import { useResourceCache } from "@/hooks/cache/useResourceCache";

const useUpdateRole = () => {
  // Drops the cached role list so the next read refetches.
  const { invalidate } = useResourceCache("role");
  const Update = async (payload) => {
    try {
      const response = await UpdateRoleAPI(payload);
      // The update route returns { success, data } without a message.
      invalidate();
      toast.success(response?.message || "Role updated successfully", {
        duration: 700,
      });
      return response;
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.errors?.[0]?.message ||
          err?.message ||
          "Failed to update role",
        { duration: 700 },
      );
      // Rethrow so the caller can keep the form open with the user's input.
      throw err;
    }
  };
  return { Update };
};

export default useUpdateRole;
