import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import UpdateCaseAPI from "@/features/individualCoordinator/services/case/updateCase";
import { updateCaseInList } from "@/store/slice/case/caseSlice";
import { extractErrorMessage } from "@/utils/extractErrorMessage";
import { useResourceCache } from "@/hooks/cache/useResourceCache";

const useUpdateCase = () => {
  // Drops the cached case list so the next read refetches.
  const { invalidate } = useResourceCache("case");
  const dispatch = useDispatch();
  // Resolves to { status: "updated", data } or { status: "unchanged" }. The
  // backend answers a PUT that would change nothing with a plain
  // `{ success: true, message: "No changes are found" }` and no `data`: a
  // successful no-op rather than a save, which the caller should not report as
  // one. Every other failure is toasted and rethrown, so the form keeps its
  // input — including the 409s this endpoint raises on a duplicate file number
  // and on a closed or cancelled case.
  const update = useCallback(
    async (id, payload) => {
      try {
        const response = await UpdateCaseAPI(id, payload);

        if (!response?.data) {
          toast(response?.message || "No changes are found", {
            duration: 2000,
          });
          return { status: "unchanged", message: response?.message };
        }

        // The saved case goes straight into the loaded list page, so going back
        // to the list shows the edit without waiting for a refetch.
        dispatch(updateCaseInList(response.data));

        invalidate();

        toast.success(response?.message || "Case updated successfully", {
          duration: 1500,
        });
        return { status: "updated", data: response.data };
      } catch (err) {
        toast.error(extractErrorMessage(err, "Failed to update case"), {
          duration: 2500,
        });
        throw err;
      }
    },
    [dispatch, invalidate],
  );

  return { update };
};

export default useUpdateCase;
