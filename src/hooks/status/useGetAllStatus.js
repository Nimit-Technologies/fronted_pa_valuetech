import { useCallback } from "react";
import { apiConfig } from "@/constants/apiConfig";
import api from "@/utils/axiosInstance";
import useReferenceList from "@/hooks/reference/useReferenceList";

const RESOURCE = "status";

// The status list is the closest thing this app has to static data: rows are
// seeded, the UI never edits them, and every screen filters the same list down
// to the codes its role may pick. It is read by a dropdown that renders once
// per table row, so it is fetched through the shared reference cache — one
// request for the whole page instead of one per row.
const fetchStatuses = async () => {
  const response = await api.get(apiConfig.status.getAllStatuses);
  const payload = response.data;

  if (!Array.isArray(payload?.data)) {
    throw new Error("The status list response is invalid.");
  }

  return {
    rows: payload.data,
    meta: {
      statusLength: payload.statusLength ?? payload.data.length,
      totalCount: payload.totalCount ?? payload.data.length,
      totalActiveCount: payload.totalActiveCount ?? 0,
    },
  };
};

const useGetAllStatus = () => {
  const { rows, meta, loading, error, reload } = useReferenceList({
    resource: RESOURCE,
    fetcher: fetchStatuses,
    errorMessage: "Failed to load statuses.",
  });

  // Kept as a promise-returning function so existing callers can await a
  // refresh. Forced, because a caller asking again means it wants the server's
  // answer, not the one already on screen.
  const getAllStatus = useCallback(() => reload(), [reload]);

  return {
    getAllStatus,
    statuses: rows,
    statusLength: meta.statusLength ?? 0,
    totalCount: meta.totalCount ?? 0,
    totalActiveCount: meta.totalActiveCount ?? 0,
    loading,
    error,
  };
};

export default useGetAllStatus;
