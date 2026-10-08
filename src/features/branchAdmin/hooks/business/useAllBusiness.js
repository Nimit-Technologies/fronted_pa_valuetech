import { useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import GetAllBusiness from "@/features/branchAdmin/services/business/allBusiness";
import { normalizeBusinesses } from "@/features/branchAdmin/services/business/normalizeBusiness";
import {
  businessStart,
  businessSuccess,
  businessFailure,
} from "@/features/branchAdmin/slice/business/businessSlice";
import { extractErrorMessage } from "@/utils/extractErrorMessage";

const useAllBusiness = () => {
  const dispatch = useDispatch();
  const latestRequest = useRef(0);

  const {
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
  } = useSelector((state) => state.business);

  const allBusiness = useCallback(
    async ({ direction = "next", cursorId = "" } = {}) => {
      const requestId = ++latestRequest.current;

      dispatch(businessStart());
      try {
        const response = await GetAllBusiness({ direction, cursorId });
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
    [dispatch],
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
