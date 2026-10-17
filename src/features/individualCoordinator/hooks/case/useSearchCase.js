import { useCallback } from "react";
import AllCaseAPI from "@/features/individualCoordinator/services/case/allCases";

const useSearchCase = () => {
  // Must return the same raw row shape as useAllCase, because useTableSearch
  // swaps these rows in for the loaded page. The backend matches the term
  // against file number, customer name, banker name, case type and customer
  // contact number.
  //
  // `includeFinished` is passed through so a search sees the same slice of the
  // lifecycle the table is currently showing — searching while finished cases
  // are hidden must not surface a closed case.
  const searchCase = useCallback(
    async (term, { status = "", includeFinished = false } = {}) => {
      const params = { search: term };
      if (status) params.status = status;
      if (includeFinished) params.include_finished = "true";

      const response = await AllCaseAPI(params);
      return response.data || [];
    },
    [],
  );

  return { searchCase };
};

export default useSearchCase;
