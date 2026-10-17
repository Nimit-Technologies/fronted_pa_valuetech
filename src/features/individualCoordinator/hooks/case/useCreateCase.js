import { useCallback } from "react";
import { toast } from "sonner";
import CreateCaseAPI from "@/features/individualCoordinator/services/case/createCase";
import { extractErrorMessage } from "@/utils/extractErrorMessage";
import { useResourceCache } from "@/hooks/cache/useResourceCache";

// A 409 carrying `similar_cases` is the one refusal that is a question rather
// than an error: the backend holds the create back once when an existing case
// shares the customer's phone number or reads like the same property, and
// expects the user to look at the matches and resubmit with confirm_duplicate.
const duplicateWarning = (err) => {
  const { status, data } = err?.response ?? {};
  if (status !== 409 || !Array.isArray(data?.similar_cases)) return null;
  return data;
};

const useCreateCase = () => {
  // Drops the cached case list so the next read refetches.
  const { invalidate } = useResourceCache("case");
  // Resolves to { status: "created", data } or { status: "duplicate", ... }.
  // Every other failure is toasted and rethrown, so the form keeps its input.
  const create = useCallback(
    async (payload) => {
      try {
        const response = await CreateCaseAPI(payload);
        invalidate();
        toast.success(response?.message || "Case created successfully", {
          duration: 1500,
        });
        return { status: "created", data: response?.data };
      } catch (err) {
        const warning = duplicateWarning(err);
        if (warning) {
          // nextOffset is carried through because the matches are paged: the
          // create only ever returns the first page, and "load more" asks
          // POST /case/similar for the rest from this position.
          return {
            status: "duplicate",
            message: warning.message,
            similarCases: warning.similar_cases,
            hasNextPage: Boolean(warning.hasNextPage),
            nextOffset: warning.nextOffset ?? null,
          };
        }

        toast.error(extractErrorMessage(err, "Failed to create case"), {
          duration: 2500,
        });
        throw err;
      }
    },
    [invalidate],
  );

  return { create };
};

export default useCreateCase;
