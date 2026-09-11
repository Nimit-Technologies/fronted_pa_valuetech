import { useCallback } from "react";
import { useDispatch } from "react-redux";
import allRole from "../../services/role/allRole";
import { setRole, roleStart, roleFailure } from "../../slice/role/roleSlice";
import { normalizeRoles } from "../../services/role/normalizeRole";

const useAllRole = () => {
  const dispatch = useDispatch();

  // Memoized so callers can safely put it in a useEffect dependency array
  // without triggering a refetch on every render.
  const allRoles = useCallback(
    async ({ direction = "next", cursorId = "", dataLimit = 5 } = {}) => {
      try {
        dispatch(roleStart());
        const response = await allRole({ direction, cursorId, dataLimit });
        const clearRole = normalizeRoles(response.data || response.roles || []);

        dispatch(
          setRole({
            data: clearRole,
            hasNextPage: response.hasNextPage,
            hasPreviousPage: response.hasPreviousPage,
            roleFirstId: response.roleFirstId,
            roleLastId: response.roleLastId,
            dataLimit: response.dataLimit || dataLimit,
            roleLength: response.roleLength,
          }),
        );

        return clearRole;
      } catch (err) {
        const message = err.message;
        dispatch(roleFailure(message));
      }
    },
    [dispatch],
  );

  return { allRole: allRoles };
};

export default useAllRole;
