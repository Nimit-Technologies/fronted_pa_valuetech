import { useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
// import GetAllDepartments from "@/features/superAdmin/services/department/allDepartments";
import GetAllDepartments from "../../services/department/allDepartment";
import {
  departmentStart,
  departmentFailure,
  setDepartment,
} from "@/store/slice/department/departmentSlice";
import { extractErrorMessage } from "@/utils/extractErrorMessage";
import {
  buildCacheKey,
  useResourceCache,
} from "@/hooks/cache/useResourceCache";

const useAllDepartment = () => {
  const dispatch = useDispatch();
  const latestRequest = useRef(0);
  const { isFresh, markFetched, getRows } = useResourceCache("department");

  const {
    departmentData,
    departmentFirstId,
    departmentLastId,
    hasNextPage,
    hasPreviousPage,
    departmentLength,
    dataLimit,
    loading,
    error,
    totalCount,
    totalActiveCount,
    success,
  } = useSelector((state) => state.department);

  const allDepartment = useCallback(
    async ({
      direction = "next",
      cursorId = "",
      search = "",
      force = false,
    } = {}) => {
      const cacheKeyTerm = String(search ?? "").trim();
      const cacheKey = buildCacheKey({
        direction,
        cursorId,
        search: cacheKeyTerm,
      });
      // Same query, still fresh: the store already holds these rows.
      if (!force && isFresh(cacheKey))
        return getRows("department", "departmentData");

      const term = String(search ?? "").trim();
      const requestId = ++latestRequest.current;

      dispatch(departmentStart());
      try {
        const params = { direction, cursorId };
        if (term) params.search = term;

        const response = await GetAllDepartments(params);

        // Rows are stored exactly as the API sends them: id, name, is_active,
        // is_deleted, branch_id and branch { id, name }.
        const departments = response.data || [];

        // A newer call from this hook instance started while we were waiting
        // (e.g. the user kept typing, or paged again). Let that one own the
        // slice instead of clobbering it with this stale response.
        if (requestId !== latestRequest.current) return departments;

        dispatch(
          setDepartment({
            data: departments,
            departmentFirstId: response.departmentFirstId,
            departmentLastId: response.departmentLastId,
            hasNextPage: response.hasNextPage,
            hasPreviousPage: response.hasPreviousPage,
            dataLimit: response.dataLimit,
            departmentLength: response.departmentLength,
            totalCount: response.totalCount,
            totalActiveCount: response.totalActiveCount,
          }),
        );

        markFetched(cacheKey);

        return departments;
      } catch (err) {
        if (requestId !== latestRequest.current) return [];
        dispatch(
          departmentFailure(
            extractErrorMessage(err, "Failed to load departments"),
          ),
        );
        return [];
      }
    },
    [dispatch, isFresh, markFetched, getRows],
  );

  return {
    allDepartment,
    departmentData,
    departmentFirstId,
    departmentLastId,
    hasNextPage,
    hasPreviousPage,
    departmentLength,
    dataLimit,
    loading,
    error,
    totalCount,
    totalActiveCount,
    success,
  };
};

export default useAllDepartment;
