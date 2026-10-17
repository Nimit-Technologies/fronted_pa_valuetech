import { useCallback } from "react";
import { toast } from "sonner";
import getCaseByIdAPI from "@/features/individualCoordinator/services/case/getCaseById";
import { extractErrorMessage } from "@/utils/extractErrorMessage";
import logger from "@/utils/logger";

const useGetCaseById = () => {
  // Memoised so callers can safely list it in a `useEffect` dependency array
  // without triggering a re-fetch loop on every render.
  const getCaseById = useCallback(async (id) => {
    try {
      const response = await getCaseByIdAPI(id);
      return response;
    } catch (err) {
      // A 404 is an ordinary outcome here — a stale link, or a case that has
      // moved outside the caller's scope (the backend reports both as "not
      // found" rather than confirming the case exists). The view renders that
      // in place, so a red toast on top of it would only be noise.
      const status = err?.response?.status;
      if (status !== 404) {
        toast.error(extractErrorMessage(err, "Failed to fetch case"), {
          duration: 700,
        });
      }
      logger.error("Failed to fetch case", err);
      return undefined;
    }
  }, []);

  return { getCaseById };
};

export default useGetCaseById;
