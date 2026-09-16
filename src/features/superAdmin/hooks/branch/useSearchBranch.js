import { useCallback } from "react";
import GetAllBranches from "@/features/superAdmin/services/branch/allBranches";
import { normalizeBranches } from "@/features/superAdmin/services/branch/normalizeBranch";

const useSearchBranch = () => {
  const searchBranch = useCallback(async (term) => {
    const response = await GetAllBranches({ search: term });
    return normalizeBranches(response.data || response.branches || []);
  }, []);

  return { searchBranch };
};

export default useSearchBranch;
