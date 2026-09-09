import React from "react";
import UpdateBranchAPI from "../../services/branch/updateBranch";
import { toast } from "sonner";
const useUpdateBranch = () => {
  const Update = async (payload) => {
    try {
      const response = await UpdateBranchAPI(payload);
      console.log(response);
      toast.success("Department updated successfully!", {
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

export default useUpdateBranch;
