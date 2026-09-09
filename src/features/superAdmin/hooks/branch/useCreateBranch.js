import React from "react";
import CreateBranchAPI from "../../services/branch/createBranch";
// import { ReducerType } from '@reduxjs/toolkit';
import { toast } from "sonner";

const useCreateBranch = () => {
  const Create = async (payload) => {
    try {
      console.log("hook :  ", payload);
      const response = await CreateBranchAPI(payload);
      console.log("hook res: ", response);
      toast.success("Branch Created Successfully!", {
        duration: 700,
      });
      return response.data;
    } catch (err) {
      toast.error(err.message, {
        duration: 700,
      });
      return err;
    }
  };
  return { Create };
};

export default useCreateBranch;
