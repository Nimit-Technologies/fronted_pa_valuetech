import { useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import GetAllBusiness from "@/features/superAdmin/services/business/allBusiness";
import { normalizeBusinesses } from "@/features/superAdmin/services/business/normalizeBusiness";
import {
  businessStart,
  businessSuccess,
  businessFailure,
} from "@/features/superAdmin/slice/business/businessSlice";
import {
  selectBusinessActiveCount,
  selectBusinessData,
  selectBusinessError,
  selectBusinessLoading,
  selectBusinessPagination,
  selectBusinessSuccess,
  selectBusinessTotalCount,
} from "@/features/superAdmin/slice/business/businessSelectors";
import { extractErrorMessage } from "@/utils/extractErrorMessage";
import {
  buildCacheKey,
  useResourceCache,
} from "@/hooks/cache/useResourceCache";

const useAllBusiness = () => {
  const dispatch = useDispatch();
  const latestRequest = useRef(0);
  const { isFresh, markFetched, getRows } = useResourceCache("business");

  // Read through selectors rather than destructuring the whole slice, so the
  // slice's shape stays behind businessSelectors and the two counts keep their
  // "fall back to the loaded page" rule in one place.
  const businessData = useSelector(selectBusinessData);
  const loading = useSelector(selectBusinessLoading);
  const error = useSelector(selectBusinessError);
  const totalCount = useSelector(selectBusinessTotalCount);
  const totalActiveCount = useSelector(selectBusinessActiveCount);
  const success = useSelector(selectBusinessSuccess);
  const {
    businessFirstId,
    businessLastId,
    hasNextPage,
    hasPreviousPage,
    businessLength,
    dataLimit,
    direction,
  } = useSelector(selectBusinessPagination);

  const allBusiness = useCallback(
    async ({
      direction = "next",
      cursorId = "",
      branchId = "",
      force = false,
    } = {}) => {
      // branchId is part of the query, so switching branch in a dropdown is a
      // different cache entry rather than a false hit on the previous branch.
      const cacheKey = buildCacheKey({ direction, cursorId, branchId });
      if (!force && isFresh(cacheKey))
        return getRows("business", "businessData");

      const requestId = ++latestRequest.current;

      dispatch(businessStart());
      try {
        // branchId is omitted unless set: the endpoint treats an empty value
        // as "no branch filter", and only a super admin may narrow the list.
        const response = await GetAllBusiness({
          direction,
          cursorId,
          ...(branchId && { branchId }),
        });
        const businesses = normalizeBusinesses(response.data || []);

        if (requestId !== latestRequest.current) return businesses;

        dispatch(
          businessSuccess({
            data: businesses,
            businessFirstId: response.businessTypeFirstId,
            businessLastId: response.businessTypeLastId,
            hasNextPage: response.hasNextPage,
            hasPreviousPage: response.hasPreviousPage,
            dataLimit: response.dataLimit,
            businessLength: response.businessTypeLength,
            totalCount: response.totalCount,
            totalActiveCount: response.totalActiveCount,
            direction,
          }),
        );

        markFetched(cacheKey);
        return businesses;
      } catch (err) {
        if (requestId !== latestRequest.current) return [];
        dispatch(
          businessFailure(
            extractErrorMessage(err, "Failed to load businesses"),
          ),
        );
        return [];
      }
    },
    [dispatch, isFresh, markFetched, getRows],
  );

  return {
    allBusiness,
    businessData,
    businessFirstId,
    businessLastId,
    hasNextPage,
    hasPreviousPage,
    businessLength,
    dataLimit,
    direction,
    loading,
    error,
    totalCount,
    totalActiveCount,
    success,
  };
};

export default useAllBusiness;
