import { useCallback, useEffect, useRef, useState } from "react";
import AllBanksAPI from "@/features/individualCoordinator/services/bank/allBanks";
import { extractErrorMessage } from "@/utils/extractErrorMessage";

// One page of the branch's banks, for the case form's bank picker. Local
// state rather than a redux slice: this is reference data for one form, not a
// screen's worth of list state, and the branchAdmin bank slice belongs to the
// bank management pages.
const useAllBanks = () => {
  const [banks, setBanks] = useState([]);
  const [page, setPage] = useState({
    firstId: null,
    lastId: null,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const latestRequest = useRef(0);

  const load = useCallback(
    async ({ direction = "next", cursorId = "" } = {}) => {
      const requestId = ++latestRequest.current;
      setLoading(true);
      setError(null);
      try {
        const response = await AllBanksAPI({ direction, cursorId });
        if (requestId !== latestRequest.current) return;

        setBanks(response?.data || []);
        setPage({
          firstId: response?.bankFirstId ?? null,
          lastId: response?.bankLastId ?? null,
          hasNextPage: Boolean(response?.hasNextPage),
          hasPreviousPage: Boolean(response?.hasPreviousPage),
        });
      } catch (err) {
        if (requestId !== latestRequest.current) return;
        setError(extractErrorMessage(err, "Failed to load banks"));
        setBanks([]);
      } finally {
        if (requestId === latestRequest.current) setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    // Awaited inside an async wrapper rather than called straight from the
    // effect body, which would be a synchronous setState on mount.
    void (async () => {
      await load();
    })();

    return () => {
      latestRequest.current += 1;
    };
  }, [load]);

  const next = useCallback(() => {
    if (page.hasNextPage) load({ direction: "next", cursorId: page.lastId });
  }, [load, page.hasNextPage, page.lastId]);

  const previous = useCallback(() => {
    if (page.hasPreviousPage)
      load({ direction: "previous", cursorId: page.firstId });
  }, [load, page.hasPreviousPage, page.firstId]);

  return {
    banks,
    loading,
    error,
    hasNextPage: page.hasNextPage,
    hasPreviousPage: page.hasPreviousPage,
    next,
    previous,
    reload: load,
  };
};

export default useAllBanks;
