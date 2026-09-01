import React from "react";
import { useDispatch } from "react-redux";
import AllBranchesAPI from "../../services/branch/allBranches";
import {
  setBranch,
  branchStart,
  branchFailure,
} from "../../slice/branch/branchSlice";
import { normalizeBranches } from "../../services/branch/normalizeBranch";

const useAllBranch = () => {
  const dispatch = useDispatch();
  const allBranch = async ({
    direction = "next",
    cursorId = "",
    dataLimit = 2,
  } = {}) => {
    try {
      dispatch(branchStart());
      const response = await AllBranchesAPI({ direction, cursorId, dataLimit });
      const clearBranch = normalizeBranches(
        response.data || response.branches || [],
      );

      dispatch(
        setBranch({
          data: clearBranch,
          hasNextPage: response.hasNextPage,
          hasPreviousPage: response.hasPreviousPage,
          branchFirstId: response.branchFirstId,
          branchLastId: response.branchLastId,
          dataLimit: response.dataLimit || dataLimit,
          branchLength: response.branchLength,
        }),
      );

      return clearBranch;
    } catch (err) {
      const message = err.message;
      dispatch(branchFailure(message));
    }
  };
  return { allBranch };
};

export default useAllBranch;
