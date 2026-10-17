import { useCallback } from "react";
import { allDepartments as GetAllDepartments } from "@/features/superAdmin";

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
