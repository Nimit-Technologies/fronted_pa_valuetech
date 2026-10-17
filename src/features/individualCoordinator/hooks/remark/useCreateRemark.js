import { useCallback } from "react";
import { toast } from "sonner";
import CreateRemarkAPI from "@/features/individualCoordinator/services/remark/createRemark";
import { extractErrorMessage } from "@/utils/extractErrorMessage";
import { useResourceCache } from "@/hooks/cache/useResourceCache";

const useCreateRemark = () => {
  // A remark is rendered as part of its case, so adding one makes the cached
  // case data stale. There is no success toast here to hang this off, so it
  // runs straight after the awaited call.
  const { invalidate } = useResourceCache("case");

  // Memoised so callers can hold it in a useCallback dependency list.
  const create = useCallback(
    async (caseId, content) => {
      try {
        const response = await CreateRemarkAPI(caseId, content);
        invalidate();
        return response?.data;
      } catch (err) {
        // The backend has several refusals worth reading rather than
        // flattening: 404 for a case outside the branch, 409 for a deleted
        // case or one frozen by a terminal status, 400 for content that failed
        // the 1–2000 character rule.
        toast.error(extractErrorMessage(err, "Failed to add remark"), {
          duration: 2000,
        });
        // Rethrow so the compose box keeps what was typed.
        throw err;
      }
    },
    [invalidate],
  );

  return { create };
};

export default useCreateRemark;
