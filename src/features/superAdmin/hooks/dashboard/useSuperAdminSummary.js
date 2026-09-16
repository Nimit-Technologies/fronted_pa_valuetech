import { useCallback, useEffect, useRef, useState } from "react";
import SuperAdminSummaryAPI from "@/features/superAdmin/services/dashboard/superAdminSummary";
import { extractErrorMessage } from "@/utils/extractErrorMessage";

const EMPTY_COUNTS = { total: null, active: null };

export const EMPTY_SUMMARY = {
  branches: EMPTY_COUNTS,
  departments: EMPTY_COUNTS,
  roles: EMPTY_COUNTS,
  users: EMPTY_COUNTS,
};

const useSuperAdminSummary = () => {
  const [summary, setSummary] = useState(EMPTY_SUMMARY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const latestRequest = useRef(0);

  const refresh = useCallback(async () => {
    const requestId = ++latestRequest.current;
    setLoading(true);
    setError(null);
    try {
      const response = await SuperAdminSummaryAPI();
      if (requestId !== latestRequest.current) return;
      setSummary({ ...EMPTY_SUMMARY, ...(response?.data ?? {}) });
    } catch (err) {
      if (requestId !== latestRequest.current) return;
      setError(extractErrorMessage(err, "Failed to load dashboard summary"));
    } finally {
      if (requestId === latestRequest.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    const loadSummary = async () => {
      const requestId = ++latestRequest.current;
      setLoading(true);
      setError(null);
      try {
        const response = await SuperAdminSummaryAPI();
        if (!active || requestId !== latestRequest.current) return;
        setSummary({ ...EMPTY_SUMMARY, ...(response?.data ?? {}) });
      } catch (err) {
        if (!active || requestId !== latestRequest.current) return;
        setError(extractErrorMessage(err, "Failed to load dashboard summary"));
      } finally {
        if (active && requestId === latestRequest.current) setLoading(false);
      }
    };
    loadSummary();
    // Invalidate in-flight requests on unmount so they can't set state.
    return () => {
      active = false;
      latestRequest.current += 1;
    };
  }, []);

  return { summary, loading, error, refresh };
};

export default useSuperAdminSummary;
