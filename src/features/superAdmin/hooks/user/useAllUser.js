import { useDispatch } from "react-redux";
import {
  setUser,
  userStart,
  userFailure,
} from "@/features/superAdmin/slice/user/userSlice";
import { normalizeUsers } from "@/features/superAdmin/services/user/normalizeUser";
import AllUserAPI from "@/features/superAdmin/services/user/allUser";

const useAllUser = () => {
  const dispatch = useDispatch();

  const allUser = async ({
    direction = "next",
    cursorId = "",
    dataLimit = 5,
  } = {}) => {
    try {
      dispatch(userStart());
      const response = await AllUserAPI({ direction, cursorId, dataLimit });
      const clearUser = normalizeUsers(response.data || response.users || []);
      console.log("clearUser", clearUser);
      dispatch(
        setUser({
          data: clearUser,
          hasNextPage: response.hasNextPage,
          hasPreviousPage: response.hasPreviousPage,
          userFirstId: response.userFirstId,
          userLastId: response.userLastId,
          dataLimit: response.dataLimit || dataLimit,
          userLength: response.userLength,
        }),
      );

      return clearUser;
    } catch (err) {
      const message = err?.message || "Failed to load users";
      dispatch(userFailure(message));
    }
  };

  return { allUser };
};

export default useAllUser;
