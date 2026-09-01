import React from "react";
import DeleteBranchAPI from "../../services/branch/deleteBranch";
import { toast } from "sonner";
const useDeleteBranch = () => {
  const Delete = async (payload) => {
    try {
      const response = await DeleteBranchAPI(payload);
      toast.success("Branch delete successful!", {
        duration: 700,
      });
      return response;
    } catch (err) {
      toast.error(err.message, {
        duration: 700,
      });
      return err;
    }
  };
  return { Delete };
};

export default useDeleteBranch;
