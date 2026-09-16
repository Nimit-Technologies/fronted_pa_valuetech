import { useCallback } from "react";
import AllRoleAPI from "@/features/superAdmin/services/role/allRole";

const useSearchRole = () => {
  // Must return the same raw row shape as useAllRole, because useTableSearch
  // swaps these rows in for the loaded page.
  const searchRole = useCallback(async (term) => {
    const response = await AllRoleAPI({ search: term });
    return response.data || [];
  }, []);

  return { searchRole };
};

export default useSearchRole;
