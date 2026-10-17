import { useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import GetAllBanks from "@/features/branchAdmin/services/bank/allBanks";
import { normalizeBanks } from "@/features/branchAdmin/services/bank/normalizeBank";
import {
  bankStart,
  bankSuccess,
  bankFailure,
} from "@/features/branchAdmin/slice/bank/bankSlice";
import { extractErrorMessage } from "@/utils/extractErrorMessage";
import {
  buildCacheKey,
  useResourceCache,
} from "@/hooks/cache/useResourceCache";

const useAllBank = () => {
  const dispatch = useDispatch();
  const latestRequest = useRef(0);
  const { isFresh, markFetched, getRows } = useResourceCache("bank");

  const {
    bankData,
    bankFirstId,
    bankLastId,
    hasNextPage,
    hasPreviousPage,
    bankLength,
    dataLimit,
    direction,
    loading,
    error,
    totalCount,
    totalActiveCount,
    success,
  } = useSelector((state) => state.bank);

  const allBank = useCallback(
    async ({ direction = "next", cursorId = "", force = false } = {}) => {
      // The bank list takes no search parameter, so the page and cursor are
      // the whole query.
      const cacheKey = buildCacheKey({ direction, cursorId });
      // Same query, still fresh: the store already holds these rows.
      if (!force && isFresh(cacheKey)) return getRows("bank", "bankData");

      const requestId = ++latestRequest.current;

      dispatch(bankStart());
      try {
        const response = await GetAllBanks({ direction, cursorId });
        const banks = normalizeBanks(response.data || []);

        if (requestId !== latestRequest.current) return banks;

        dispatch(
          bankSuccess({
            data: banks,
            bankFirstId: response.bankFirstId,
            bankLastId: response.bankLastId,
            hasNextPage: response.hasNextPage,
            hasPreviousPage: response.hasPreviousPage,
            dataLimit: response.dataLimit,
            bankLength: response.bankLength,
            totalCount: response.totalCount,
            totalActiveCount: response.totalActiveCount,
            direction,
          }),
        );

        markFetched(cacheKey);

        return banks;
      } catch (err) {
        if (requestId !== latestRequest.current) return [];
        dispatch(bankFailure(extractErrorMessage(err, "Failed to load banks")));
        return [];
      }
    },
    [dispatch, isFresh, markFetched, getRows],
  );

  return {
    allBank,
    bankData,
    bankFirstId,
    bankLastId,
    hasNextPage,
    hasPreviousPage,
    bankLength,
    dataLimit,
    direction,
    loading,
    error,
    totalCount,
    totalActiveCount,
    success,
  };
};

export default useAllBank;
