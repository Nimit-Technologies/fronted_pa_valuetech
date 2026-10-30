import { useCallback } from "react";
import { apiConfig } from "@/constants/apiConfig";
import api from "@/utils/axiosInstance";
import useReferenceList from "@/hooks/reference/useReferenceList";

const RESOURCE = "engineer";

// The assignable engineers for the signed-in user's branch, read by the
// engineer picker on the case form. Reference data, not screen state: it is
// shared through the reference cache so reopening the form — or mounting two
// pickers on one screen — does not refetch it.
const fetchEngineers = async ({
  direction = "next",
  cursorId = "",
  search = "",
} = {}) => {
  const params = { direction, cursorId };
  const term = String(search ?? "").trim();
  if (term) params.search = term;

  const response = await api.get(apiConfig.user.getAllEngineer, { params });
  const payload = response.data;

  if (!Array.isArray(payload?.data)) {
    throw new Error("The engineer list response is invalid.");
  }

  return {
    rows: payload.data,
    meta: {
      firstId: payload.userFirstId ?? null,
      lastId: payload.userLastId ?? null,
      hasNextPage: Boolean(payload.hasNextPage),
      hasPreviousPage: Boolean(payload.hasPreviousPage),
    },
  };
};

const useGetAllEngineer = () => {
  const { rows, meta, loading, error, load } = useReferenceList({
    resource: RESOURCE,
    fetcher: fetchEngineers,
    errorMessage: "Failed to load engineers",
  });

  // Paging and searching are queries in their own right, so they go through
  // `load` and get their own cache entry: paging back to a page just visited,
  // or retyping a search term, is answered from the store.
  const getAllEngineer = useCallback(
    ({ direction = "next", cursorId = "", search = "" } = {}) =>
      load({ direction, cursorId, search }),
    [load],
  );

  return {
    getAllEngineer,
    engineers: rows,
    engineerFirstId: meta.firstId ?? null,
    engineerLastId: meta.lastId ?? null,
    hasNextPage: Boolean(meta.hasNextPage),
    hasPreviousPage: Boolean(meta.hasPreviousPage),
    loading,
    error,
  };
};

export default useGetAllEngineer;
