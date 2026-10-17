import { useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import AllRoleAPI from "@/features/superAdmin/services/role/allRole";
import { roleStart, roleFailure, setRole } from "@/store/slice/role/roleSlice";
import { extractErrorMessage } from "@/utils/extractErrorMessage";
import {
  buildCacheKey,
  useResourceCache,
} from "@/hooks/cache/useResourceCache";

const useAllRole = () => {
  const dispatch = useDispatch();
  const latestRequest = useRef(0);
  const { isFresh, markFetched, getRows } = useResourceCache("role");

  const {
    roleData,
    roleFirstId,
    roleLastId,
    hasNextPage,
    hasPreviousPage,
    roleLength,
    dataLimit,
    direction,
    searchQuery,
    loading,
    error,
    totalCount,
    totalActiveCount,
    success,
  } = useSelector((state) => state.role);

  // Page size is fixed server-side (DATA_LIMIT). Older callers still pass a
  // `dataLimit` argument; it is accepted and ignored.
  const allRole = useCallback(
    async ({
      direction = "next",
      cursorId = "",
      search = "",
      force = false,
    } = {}) => {
      const term = String(search ?? "").trim();
      const cacheKey = buildCacheKey({ direction, cursorId, search: term });
      // Same query, still fresh: the store already holds these rows.
      if (!force && isFresh(cacheKey)) return getRows("role", "roleData");

      const requestId = ++latestRequest.current;

      dispatch(roleStart());
      try {
        const params = { direction, cursorId };
        if (term) params.search = term;

        const response = await AllRoleAPI(params);
        // Rows are stored exactly as the API sends them: id, name, is_active,
        // department_id, branch_id, department { id, name }, branch { id, name }.
        const roles = response.data || [];

        // A newer call from this hook instance started while we were waiting
        // (e.g. the user kept typing, or paged again). Let that one own the
        // slice instead of clobbering it with this stale response.
        if (requestId !== latestRequest.current) return roles;

        dispatch(
          setRole({
            data: roles,
            roleFirstId: response.roleFirstId,
            roleLastId: response.roleLastId,
            hasNextPage: response.hasNextPage,
            hasPreviousPage: response.hasPreviousPage,
            dataLimit: response.dataLimit,
            roleLength: response.roleLength,
            totalCount: response.totalCount,
            totalActiveCount: response.totalActiveCount,
            direction,
            searchQuery: term,
          }),
        );

        markFetched(cacheKey);

        return roles;
      } catch (err) {
        if (requestId !== latestRequest.current) return [];
        dispatch(roleFailure(extractErrorMessage(err, "Failed to load roles")));
        return [];
      }
    },
    [dispatch, isFresh, markFetched, getRows],
  );

  return {
    allRole,
    roleData,
    roleFirstId,
    roleLastId,
    hasNextPage,
    hasPreviousPage,
    roleLength,
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

export default useAllRole;
