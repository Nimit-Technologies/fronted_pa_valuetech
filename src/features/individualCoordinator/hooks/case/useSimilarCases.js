import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import SimilarCasesAPI from "@/features/individualCoordinator/services/case/similarCases";
import useSessionDraft from "@/hooks/draft/useSessionDraft";
import { extractErrorMessage } from "@/utils/extractErrorMessage";

// A restored panel is only useful if it still carries the query its pages came
// from: "load more" is an offset into one ranked result set, so without the
// number and address that produced the first page there is nothing to page
// against, and the honest thing is to start fresh.
const reviveReview = (stored) => {
  if (!stored || typeof stored !== "object") return undefined;
  if (!Array.isArray(stored.cases) || stored.cases.length === 0)
    return undefined;
  if (!stored.query?.customerContactNumber || !stored.query?.address)
    return undefined;

  const nextOffset = Number.isInteger(stored.nextOffset)
    ? stored.nextOffset
    : null;

  return {
    message: typeof stored.message === "string" ? stored.message : "",
    cases: stored.cases.filter(
      (match) => match && typeof match.id === "string",
    ),
    // Tied to nextOffset deliberately: a "load more" with nowhere to load from
    // would render a button that cannot do anything.
    hasNextPage: Boolean(stored.hasNextPage) && nextOffset !== null,
    nextOffset,
    query: stored.query,
  };
};

// The review panel behind the create form's one advisory refusal. A 409
// carrying `similar_cases` is a question rather than an error, and this holds
// what the user is looking at while they answer it: the matches so far, whether
// more exist, and the fetch that appends the next page.
//
// `query` is a snapshot of the customer number and address that produced the
// first page, taken when the panel opens. Later pages are fetched against that
// snapshot and not against the live form, because an offset is a position in
// one ranked result set: paging after the address has been edited would walk a
// different ranking, silently skipping some matches and repeating others.
//
// With a `draftKey` the panel is kept in the tab's storage, so following a
// match through to its case page and pressing Back brings the review back
// rather than an empty form. Without one it is ordinary component state.
const useSimilarCases = ({ draftKey = null } = {}) => {
  const [review, setReview, clearReview] = useSessionDraft(
    draftKey,
    null,
    reviveReview,
  );
  const [loadingMore, setLoadingMore] = useState(false);
  // Bumped whenever the panel opens or closes, so a page still in flight from
  // a previous panel cannot land in the current one.
  const generation = useRef(0);

  const open = useCallback(
    (warning, query) => {
      generation.current += 1;
      setReview({
        message: warning?.message || "",
        cases: warning?.similarCases ?? [],
        hasNextPage: Boolean(warning?.hasNextPage),
        nextOffset: warning?.nextOffset ?? null,
        query,
      });
    },
    [setReview],
  );

  const dismiss = useCallback(() => {
    generation.current += 1;
    clearReview();
  }, [clearReview]);

  const loadMore = useCallback(async () => {
    // Guarded on the current state rather than on an argument, so a second
    // click while the first page is still loading cannot refetch the same
    // offset and append it twice.
    if (loadingMore) return;
    if (!review?.hasNextPage || review.nextOffset == null) return;

    const requested = generation.current;
    setLoadingMore(true);
    try {
      const response = await SimilarCasesAPI({
        ...review.query,
        offset: review.nextOffset,
      });
      const page = response?.similar_cases ?? [];

      setReview((prev) => {
        // Dismissed, or reopened by a fresh submit, while the request was in
        // flight. Appending here would resurrect a panel the user closed.
        if (!prev || requested !== generation.current) return prev;

        // The ranking is recomputed per request, so a case created between the
        // two calls can shift a row across the page boundary. Deduping on id
        // keeps that from rendering the same match twice with two serial
        // numbers.
        const seen = new Set(prev.cases.map((match) => match.id));
        return {
          ...prev,
          cases: [
            ...prev.cases,
            ...page.filter((match) => !seen.has(match.id)),
          ],
          hasNextPage: Boolean(response?.hasNextPage),
          nextOffset: response?.nextOffset ?? null,
        };
      });
    } catch (err) {
      // Advisory to begin with: failing to page the matches must not cost the
      // user the form, so this is toasted and not rethrown.
      toast.error(extractErrorMessage(err, "Failed to load more matches"), {
        duration: 2500,
      });
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, review, setReview]);

  return { review, loadingMore, open, dismiss, loadMore };
};

export default useSimilarCases;
