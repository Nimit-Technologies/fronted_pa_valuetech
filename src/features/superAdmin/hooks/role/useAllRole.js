import { useDispatch } from "react-redux";
import allRole from "../../services/role/allRole";
import { setRole, roleStart, roleFailure } from "../../slice/role/roleSlice";
import { normalizeRoles } from "../../services/role/normalizeRole";

const useAllRole = () => {
  const dispatch = useDispatch();

  const allRoles = async ({
    direction = "next",
    cursorId = "",
    dataLimit = 5,
  } = {}) => {
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
  };

  return { allRole: allRoles };
};

export default useAllRole;
