import { useCallback, useEffect, useRef, useState } from "react";
import BranchAdminSummaryAPI from "@/features/branchAdmin/services/dashboard/branchAdminSummary";
import { extractErrorMessage } from "@/utils/extractErrorMessage";

const EMPTY_COUNTS = { total: null, active: null };

export const EMPTY_SUMMARY = {
  banks: EMPTY_COUNTS,
  departments: EMPTY_COUNTS,
  roles: EMPTY_COUNTS,
  users: EMPTY_COUNTS,
};

const useBranchAdminSummary = () => {
  const [summary, setSummary] = useState(EMPTY_SUMMARY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const latestRequest = useRef(0);

  const refresh = useCallback(async () => {
    const requestId = ++latestRequest.current;
    setLoading(true);
    setError(null);
    try {
      const response = await BranchAdminSummaryAPI();
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
    // Was its own second copy of the body of `refresh` above, kept in step by
    // hand since whoever added `refresh` for the Retry button never folded the
    // mount fetch back into it. The two had already drifted apart — this one
    // alone tracked an `active` flag — so a future edit to one had nothing to
    // stop it silently not reaching the other.
    //
    // Awaited inside an async wrapper rather than called straight from the
    // effect body, which would be a synchronous setState on mount.
    void (async () => {
      await refresh();
    })();

    // Invalidate the in-flight request on unmount so it can't set state.
    return () => {
      latestRequest.current += 1;
    };
  }, [refresh]);

  return { summary, loading, error, refresh };
};

export default useBranchAdminSummary;
