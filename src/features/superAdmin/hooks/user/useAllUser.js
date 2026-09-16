import { useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import AllUserAPI from "@/features/superAdmin/services/user/allUser";
import {
  userStart,
  userFailure,
  setUser,
} from "@/features/superAdmin/slice/user/userSlice";
import { extractErrorMessage } from "@/utils/extractErrorMessage";

const useAllUser = () => {
  const dispatch = useDispatch();
  const latestRequest = useRef(0);

  const {
    userData,
    userFirstId,
    userLastId,
    hasNextPage,
    hasPreviousPage,
    userLength,
    dataLimit,
    direction,
    searchQuery,
    loading,
    error,
    totalCount,
    totalActiveCount,
    success,
  } = useSelector((state) => state.user);

  // Page size is fixed server-side (DATA_LIMIT). Older callers still pass a
  // `dataLimit` argument; it is accepted and ignored.
  const allUser = useCallback(
    async ({ direction = "next", cursorId = "", search = "" } = {}) => {
      const term = String(search ?? "").trim();
      const requestId = ++latestRequest.current;

      dispatch(userStart());
      try {
        const params = { direction, cursorId };
        if (term) params.search = term;

        const response = await AllUserAPI(params);

        // Rows are stored exactly as the API sends them: id, employee_id,
        // first_name, last_name, email, phone, aadhaar_number (masked),
        // is_active, is_deleted, address, branch/department/role { id, name }.
        const users = response.data || [];

        // A newer call from this hook instance started while we were waiting
        // (e.g. the user kept typing, or paged again). Let that one own the
        // slice instead of clobbering it with this stale response.
        if (requestId !== latestRequest.current) return users;

        dispatch(
          setUser({
            data: users,
            userFirstId: response.userFirstId,
            userLastId: response.userLastId,
            hasNextPage: response.hasNextPage,
            hasPreviousPage: response.hasPreviousPage,
            dataLimit: response.dataLimit,
            userLength: response.userLength,
            totalCount: response.totalCount,
            totalActiveCount: response.totalActiveCount,
            direction,
            searchQuery: term,
          }),
        );

        return users;
      } catch (err) {
        if (requestId !== latestRequest.current) return [];
        dispatch(userFailure(extractErrorMessage(err, "Failed to load users")));
        return [];
      }
    },
    [dispatch],
  );

  return {
    allUser,
    userData,
    userFirstId,
    userLastId,
    hasNextPage,
    hasPreviousPage,
    userLength,
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

export default useAllUser;
