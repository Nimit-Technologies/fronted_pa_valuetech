import React from "react";
import updateDepartmentAPI from "../../services/department/updateDepartment";
import { toast } from "sonner";
import { useState } from "react";
const useUpdateDepartment = () => {
  const [setLoading] = useState(false);

  const update = async (payload) => {
    setLoading(true);
    try {
      const response = await updateDepartmentAPI(payload);
      console.log(response);
      toast.success("Department updated successfully!", {
        duration: 700,
      });
      return response;
    } catch (err) {
      console.log(err);
      toast.error(err.message, {
        duration: 700,
      });
      return err;
    }
  };
  return { update };
};

export default useUpdateDepartment;
