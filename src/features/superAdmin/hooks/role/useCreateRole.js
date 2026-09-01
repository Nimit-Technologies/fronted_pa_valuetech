import { toast } from "sonner";
import createRoleAPI from "../../services/role/createRole";

const useCreateRole = () => {
  const Create = async (payload) => {
    try {
      const response = await createRoleAPI(payload);
      toast.success("Role Created Successfully!", {
        duration: 700,
      });
      return response;
    } catch (err) {
      toast.error(err.message || "Failed to create role", {
        duration: 700,
      });
      return err;
    }
  };

  return { Create };
};

export default useCreateRole;
