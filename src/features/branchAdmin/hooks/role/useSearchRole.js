import React from "react";
import { useCallback } from "react";
// import AllRoleAPI from '@/features/superAdmin/services/role/allRole'
import AllRoleAPI from "../../services/role/allRole";
const useSearchRole = () => {
  const searchRole = useCallback(async (term) => {
    const response = await AllRoleAPI({ search: term });
    return response.data || [];
  }, []);

  return { searchRole };
};

export default useSearchRole;
