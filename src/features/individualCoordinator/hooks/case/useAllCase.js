import { useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import AllCaseAPI from "@/features/individualCoordinator/services/case/allCases";
import { caseStart, caseFailure, setCase } from "@/store/slice/case/caseSlice";
import { extractErrorMessage } from "@/utils/extractErrorMessage";
import {
  buildCacheKey,
  useResourceCache,
} from "@/hooks/cache/useResourceCache";

const useAllCase = () => {
  const dispatch = useDispatch();
  const latestRequest = useRef(0);
  const { isFresh, markFetched, getRows } = useResourceCache("case");

  const {
    caseData,
    caseFirstId,
    caseLastId,
    hasNextPage,
    hasPreviousPage,
    caseLength,
    dataLimit,
    direction,
    searchQuery,
    loading,
    error,
    totalCount,
    totalActiveCount,
    success,
  } = useSelector((state) => state.case);

  // Page size is fixed server-side (DATA_LIMIT), same as every other list.
  //
  // `status` narrows the list to one lifecycle code (e.g. "visit_schedule");
  // `includeFinished` lets closed and cancelled cases back in — the endpoint
  // hides them by default so a day-to-day queue is not buried under finished
  // work.
  const allCase = useCallback(
    async ({
      direction = "next",
      cursorId = "",
      search = "",
      status = "",
      includeFinished = false,
      // Mutations pass force; mount effects and filter changes do not.
      force = false,
    } = {}) => {
      const term = String(search ?? "").trim();
      // status and includeFinished change which rows come back, so they are
      // part of the key — otherwise switching a filter would read the previous
      // filter's page out of the store.
      const cacheKey = buildCacheKey({
        direction,
        cursorId,
        search: term,
        status,
        includeFinished: includeFinished ? "1" : "",
      });
      if (!force && isFresh(cacheKey)) return getRows("case", "caseData");

      const requestId = ++latestRequest.current;

      dispatch(caseStart());
      try {
        const params = { direction, cursorId };
        if (term) params.search = term;
        if (status) params.status = status;
        // The controller compares against the string "true", so only send the
        // flag when it is on.
        if (includeFinished) params.include_finished = "true";

        const response = await AllCaseAPI(params);

        // Rows are stored exactly as the API sends them: id, file_number,
        // customer_name, customer_contact_number, banker_name, case_type,
        // bank { id, name, display_name, bank_branch, bank_branch_code },
        // branch/business_type { id, name }, status { id, code, name,
        // is_terminal }, employee { id, first_name, last_name, employee_id },
        // created_by / updated_by / deleted_by snapshots, is_deleted and the
        // formatted timestamps. The list payload carries no address or
        // update_history — both come back on getById.
        const cases = response.data || [];

        // A newer call from this hook instance started while we were waiting
        // (e.g. the user kept typing, or paged again). Let that one own the
        // slice instead of clobbering it with this stale response.
        if (requestId !== latestRequest.current) return cases;

        dispatch(
          setCase({
            data: cases,
            caseFirstId: response.caseFirstId,
            caseLastId: response.caseLastId,
            hasNextPage: response.hasNextPage,
            hasPreviousPage: response.hasPreviousPage,
            dataLimit: response.dataLimit,
            caseLength: response.caseLength,
            totalCount: response.totalCount,
            totalActiveCount: response.totalActiveCount,
            direction,
            searchQuery: term,
          }),
        );

        markFetched(cacheKey);
        return cases;
      } catch (err) {
        if (requestId !== latestRequest.current) return [];
        dispatch(caseFailure(extractErrorMessage(err, "Failed to load cases")));
        return [];
      }
    },
    [dispatch, isFresh, markFetched, getRows],
  );

  return {
    allCase,
    caseData,
    caseFirstId,
    caseLastId,
    hasNextPage,
    hasPreviousPage,
    caseLength,
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

export default useAllCase;
