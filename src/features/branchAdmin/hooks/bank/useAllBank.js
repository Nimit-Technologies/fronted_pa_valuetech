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

const useAllBank = () => {
  const dispatch = useDispatch();
  const latestRequest = useRef(0);

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
    async ({ direction = "next", cursorId = "" } = {}) => {
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

        return banks;
      } catch (err) {
        if (requestId !== latestRequest.current) return [];
        dispatch(bankFailure(extractErrorMessage(err, "Failed to load banks")));
        return [];
      }
    },
    [dispatch],
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
