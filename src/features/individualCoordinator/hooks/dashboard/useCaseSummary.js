import { useCallback, useEffect, useRef, useState } from "react";
import AllCaseAPI from "@/features/individualCoordinator/services/case/allCases";
import { extractErrorMessage } from "@/utils/extractErrorMessage";

export const EMPTY_SUMMARY = { total: null, active: null, finished: null };

// Case counts for the coordinator's landing page.
//
// There is no coordinator dashboard endpoint (only super-admin and
// branch-admin), so this reads the counts the case list already returns for
// the caller's scope: totalCount over every case, and totalActiveCount over
// the ones not in a terminal status. `include_finished` is on because the
// point of the page is the whole picture, not the live queue.
//
// Deliberately not the `case` redux slice: that holds one page of rows plus
// its cursor for the list screen, and a summary fetch has no business
// resetting it.
const useCaseSummary = () => {
  const [summary, setSummary] = useState(EMPTY_SUMMARY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const latestRequest = useRef(0);

  const refresh = useCallback(async () => {
    const requestId = ++latestRequest.current;
    setLoading(true);
    setError(null);
    try {
      const response = await AllCaseAPI({ include_finished: "true" });
      if (requestId !== latestRequest.current) return;

      const total = response?.totalCount ?? null;
      const active = response?.totalActiveCount ?? null;

      setSummary({
        total,
        active,
        // Terminal cases — close and cancelled. The endpoint reports the two
        // totals it counted, so the difference is exact rather than a guess.
        finished:
          typeof total === "number" && typeof active === "number"
            ? total - active
            : null,
      });
    } catch (err) {
      if (requestId !== latestRequest.current) return;
      setError(extractErrorMessage(err, "Failed to load case summary"));
    } finally {
      if (requestId === latestRequest.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
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

export default useCaseSummary;
