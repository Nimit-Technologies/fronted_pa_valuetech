import React from "react";
import { toast } from "sonner";
import CreateDepartmentAPI from "../../services/department/createDepartment";
const useCreateDepartment = () => {
  const Create = async (payload) => {
    try {
      const response = await CreateDepartmentAPI(payload);
      toast.success("Create department successful!", {
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
  return { Create };
};

export default useCreateDepartment;
