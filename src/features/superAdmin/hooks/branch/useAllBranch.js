import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import GetAllBranches from "@/features/superAdmin/services/branch/allBranches";
import { normalizeBranches } from "@/features/superAdmin/services/branch/normalizeBranch";
import {
  branchStart,
  branchSuccess,
  branchFailure,
} from "@/features/superAdmin/slice/branch/branchSlice";
import { extractErrorMessage } from "@/utils/extractErrorMessage";

const useAllBranch = () => {
  const dispatch = useDispatch();

  const {
    branchData,
    branchFirstId,
    branchLastId,
    hasNextPage,
    hasPreviousPage,
    branchLength,
    dataLimit,
    loading,
    error,
    totalCount,
    totalActiveCount,
    success,
  } = useSelector((state) => state.branch);

  const allBranch = useCallback(
    async ({ direction = "next", cursorId = "" } = {}) => {
      dispatch(branchStart());
      try {
        const response = await GetAllBranches({ direction, cursorId });
        const branches = normalizeBranches(
          response.data || response.branches || [],
        );

        dispatch(
          branchSuccess({
            data: branches,
            branchFirstId: response.branchFirstId,
            branchLastId: response.branchLastId,
            hasNextPage: response.hasNextPage,
            hasPreviousPage: response.hasPreviousPage,
            dataLimit: response.dataLimit,
            branchLength: response.branchLength,
            totalCount: response.totalCount,
            totalActiveCount: response.totalActiveCount,
          }),
        );

        return branches;
      } catch (err) {
        dispatch(
          branchFailure(extractErrorMessage(err, "Failed to load branches")),
        );
        return [];
      }
    },
    [dispatch],
  );

  return {
    allBranch,
    branchData,
    branchFirstId,
    branchLastId,
    hasNextPage,
    hasPreviousPage,
    branchLength,
    dataLimit,
    loading,
    error,
    totalCount,
    totalActiveCount,
    success,
  };
};

export default useAllBranch;
