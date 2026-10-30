import { useCallback } from "react";
import AllBanksAPI from "@/features/individualCoordinator/services/bank/allBanks";
import useReferenceList from "@/hooks/reference/useReferenceList";

const RESOURCE = "coordinator-bank";

// One page of the branch's banks, for the case form's bank picker.
//
// Reference data rather than screen state, so it goes through the shared
// reference cache instead of local component state: opening the create-case
// form, cancelling, and opening it again used to refetch every time, and the
// update form mounting a second picker doubled it. The branchAdmin bank slice
// stays separate — that one backs the bank management screen, which pages,
// filters and mutates.
const fetchBanks = async ({ direction = "next", cursorId = "" } = {}) => {
  const response = await AllBanksAPI({ direction, cursorId });

  return {
    rows: response?.data ?? [],
    meta: {
      firstId: response?.bankFirstId ?? null,
      lastId: response?.bankLastId ?? null,
      hasNextPage: Boolean(response?.hasNextPage),
      hasPreviousPage: Boolean(response?.hasPreviousPage),
    },
  };
};

const useAllBanks = () => {
  const { rows, meta, loading, error, load, reload } = useReferenceList({
    resource: RESOURCE,
    fetcher: fetchBanks,
    errorMessage: "Failed to load banks",
  });

  const next = useCallback(() => {
    if (meta.hasNextPage) load({ direction: "next", cursorId: meta.lastId });
  }, [load, meta.hasNextPage, meta.lastId]);

  const previous = useCallback(() => {
    if (meta.hasPreviousPage)
      load({ direction: "previous", cursorId: meta.firstId });
  }, [load, meta.hasPreviousPage, meta.firstId]);

  return {
    banks: rows,
    loading,
    error,
    hasNextPage: Boolean(meta.hasNextPage),
    hasPreviousPage: Boolean(meta.hasPreviousPage),
    next,
    previous,
    reload,
  };
};

export default useAllBanks;
