import { useCallback, useEffect, useRef, useState } from "react";
import getMyTasks from "@/features/individualEngineer/services/myTasks";
import { extractErrorMessage } from "@/utils/extractErrorMessage";

export const EMPTY_SUMMARY = { total: null, active: null, completed: null };

// Task counts for the engineer's landing page.
//
// Reads the counts the task list already returns for the caller
// (`totalCount` over every allocation, `totalActiveCount` over the ones
// whose case status is not terminal) rather than re-deriving them, and
// rather than the `engineerTask` redux slice: that slice holds one page of
// rows plus its cursor for the list screen, and a summary fetch has no
// business resetting it.
const useTaskSummary = () => {
  const [summary, setSummary] = useState(EMPTY_SUMMARY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const latestRequest = useRef(0);

  const refresh = useCallback(async () => {
    const requestId = ++latestRequest.current;
    setLoading(true);
    setError(null);
    try {
      const response = await getMyTasks();
      if (requestId !== latestRequest.current) return;

      const total = response?.totalCount ?? null;
      const active = response?.totalActiveCount ?? null;

      setSummary({
        total,
        active,
        // The endpoint reports both totals it counted, so the difference is
        // exact rather than a guess at which statuses count as "done".
        completed:
          typeof total === "number" && typeof active === "number"
            ? total - active
            : null,
      });
    } catch (err) {
      if (requestId !== latestRequest.current) return;
      setError(extractErrorMessage(err, "Failed to load task summary"));
    } finally {
      if (requestId === latestRequest.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void (async () => {
      await refresh();
    })();

    return () => {
      latestRequest.current += 1;
    };
  }, [refresh]);

  return { summary, loading, error, refresh };
};

export default useTaskSummary;
