import { useCallback, useEffect, useRef, useState } from "react";
import { apiConfig } from "@/constants/apiConfig";
import { extractErrorMessage } from "@/utils/extractErrorMessage";
import api from "@/utils/axiosInstance";

const useGetAllStatus = () => {
  const [statuses, setStatuses] = useState([]);
  const [statusLength, setStatusLength] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [totalActiveCount, setTotalActiveCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const latestRequest = useRef(0);

  const getAllStatus = useCallback(async () => {
    const requestId = ++latestRequest.current;
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(apiConfig.status.getAllStatuses);
      if (requestId !== latestRequest.current) return [];

      const payload = response.data;
      if (!Array.isArray(payload?.data)) {
        throw new Error("The status list response is invalid.");
      }

      setStatuses(payload.data);
      setStatusLength(payload.statusLength ?? payload.data.length);
      setTotalCount(payload.totalCount ?? payload.data.length);
      setTotalActiveCount(payload.totalActiveCount ?? 0);
      return payload.data;
    } catch (requestError) {
      if (requestId !== latestRequest.current) return [];

      setError(extractErrorMessage(requestError, "Failed to load statuses."));
      setStatuses([]);
      setStatusLength(0);
      setTotalCount(0);
      setTotalActiveCount(0);
      return [];
    } finally {
      if (requestId === latestRequest.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void (async () => {
      await getAllStatus();
    })();
    return () => {
      latestRequest.current += 1;
    };
  }, [getAllStatus]);

  return {
    getAllStatus,
    statuses,
    statusLength,
    totalCount,
    totalActiveCount,
    loading,
    error,
  };
};

export default useGetAllStatus;
