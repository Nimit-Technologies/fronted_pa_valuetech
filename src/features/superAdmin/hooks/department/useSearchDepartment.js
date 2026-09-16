import { useCallback } from "react";
import GetAllDepartments from "@/features/superAdmin/services/department/allDepartments";

const useSearchDepartment = () => {
  // Must return the same raw row shape as useAllDepartment, because
  // useTableSearch swaps these rows in for the loaded page.
  const searchDepartment = useCallback(async (term) => {
    const response = await GetAllDepartments({ search: term });
    return response.data || response.departments || [];
  }, []);

  return { searchDepartment };
};

export default useSearchDepartment;
