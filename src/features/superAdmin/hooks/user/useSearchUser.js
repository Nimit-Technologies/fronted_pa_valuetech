import { useCallback } from "react";
import AllUserAPI from "@/features/superAdmin/services/user/allUser";

const useSearchUser = () => {
  // Must return the same raw row shape as useAllUser, because useTableSearch
  // swaps these rows in for the loaded page. The backend matches the term
  // against first name, last name, employee id and email.
  const searchUser = useCallback(async (term) => {
    const response = await AllUserAPI({ search: term });
    return response.data || [];
  }, []);

  return { searchUser };
};

export default useSearchUser;
