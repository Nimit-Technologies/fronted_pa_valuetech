import { useCallback, useRef } from "react";
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
  const latestRequest = useRef(0);

  const {
    branchData,
    branchFirstId,
    branchLastId,
    hasNextPage,
    hasPreviousPage,
    branchLength,
    dataLimit,
    direction,
    searchQuery,
    loading,
    error,
    totalCount,
    totalActiveCount,
    success,
  } = useSelector((state) => state.branch);

  const allBranch = useCallback(
    async ({ direction = "next", cursorId = "", search = "" } = {}) => {
      const searchQuery = String(search ?? "").trim();
      const requestId = ++latestRequest.current;

      dispatch(branchStart());
      try {
        const params = { direction, cursorId };
        if (searchQuery) params.search = searchQuery;

        const response = await GetAllBranches(params);
        const branches = normalizeBranches(
          response.data || response.branches || [],
        );

        // A newer call from this hook instance started while we were waiting
        // (e.g. the user kept typing). Let that one own the slice.
        if (requestId !== latestRequest.current) return branches;

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
            direction,
            searchQuery,
          }),
        );

        return branches;
      } catch (err) {
        if (requestId !== latestRequest.current) return [];
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
    direction,
    searchQuery,
    loading,
    error,
    totalCount,
    totalActiveCount,
    success,
  };
};

export default useAllBranch;
