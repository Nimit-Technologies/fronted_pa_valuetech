import React from "react";
import UpdateRoleAPI from "../../services/role/updateRole";
import { toast } from "sonner";

const useUpdateRole = () => {
  const Update = async (payload) => {
    try {
      const response = await UpdateRoleAPI(payload);
      console.log(response);
      toast.success("Role updated successfully!", {
        duration: 700,
      });
      return response;
    } catch (err) {
      console.log(err.message);
      toast.error(err.message, {
        duration: 700,
      });
      return err;
    }
  };

  return { Update };
};

export default useUpdateRole;
