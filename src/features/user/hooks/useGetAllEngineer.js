import { useCallback, useEffect, useRef, useState } from "react";
import { apiConfig } from "@/constants/apiConfig";
import { extractErrorMessage } from "@/utils/extractErrorMessage";
import api from "@/utils/axiosInstance";

const EMPTY_PAGE = {
  firstId: null,
  lastId: null,
  hasNextPage: false,
  hasPreviousPage: false,
};

const useGetAllEngineer = () => {
  const [engineers, setEngineers] = useState([]);
  const [page, setPage] = useState(EMPTY_PAGE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const latestRequest = useRef(0);

  const getAllEngineer = useCallback(
    async ({ direction = "next", cursorId = "", search = "" } = {}) => {
      const requestId = ++latestRequest.current;
      const term = String(search ?? "").trim();
      const params = { direction, cursorId };
      if (term) params.search = term;

      setLoading(true);
      setError(null);

      try {
        const response = await api.get(apiConfig.user.getAllEngineer, {
          params,
        });
        if (requestId !== latestRequest.current) return [];

        const payload = response.data;
        if (!Array.isArray(payload?.data)) {
          throw new Error("The engineer list response is invalid.");
        }

        setEngineers(payload.data);
        setPage({
          firstId: payload.userFirstId ?? null,
          lastId: payload.userLastId ?? null,
          hasNextPage: Boolean(payload.hasNextPage),
          hasPreviousPage: Boolean(payload.hasPreviousPage),
        });
        return payload.data;
      } catch (err) {
        if (requestId !== latestRequest.current) return [];
        setError(extractErrorMessage(err, "Failed to load engineers"));
        setEngineers([]);
        setPage(EMPTY_PAGE);
        return [];
      } finally {
        if (requestId === latestRequest.current) setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    void (async () => {
      await getAllEngineer();
    })();
    return () => {
      latestRequest.current += 1;
    };
  }, [getAllEngineer]);

  return {
    getAllEngineer,
    engineers,
    engineerFirstId: page.firstId,
    engineerLastId: page.lastId,
    hasNextPage: page.hasNextPage,
    hasPreviousPage: page.hasPreviousPage,
    loading,
    error,
  };
};

export default useGetAllEngineer;
