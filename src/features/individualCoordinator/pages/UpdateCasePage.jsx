import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Comment from "@/components/shared/comment";
import UpdateCaseForm from "@/features/individualCoordinator/components/case/UpdateCaseForm";
import useGetCaseById from "@/features/individualCoordinator/hooks/case/useGetCaseById";
import useCreateRemark from "@/features/individualCoordinator/hooks/remark/useCreateRemark";
import { toComment } from "@/features/individualCoordinator/utils/toComment";
import { formatStatus } from "@/constants/formatStatus";

// Unlike the view page, this one does not fall back to the cached list row
// while the detail loads: the form seeds its fields from `caseItem` once, so
// rendering it against a row that is about to be replaced would swap the values
// out from under whoever started typing.
const UpdateCase = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getCaseById } = useGetCaseById();
  const { create } = useCreateRemark();

  const [fetched, setFetched] = useState({ id: null, case: null, done: false });

  useEffect(() => {
    let cancelled = false;
    getCaseById(id).then((response) => {
      if (cancelled) return;
      setFetched({ id, case: response?.data ?? null, done: true });
    });
    return () => {
      cancelled = true;
    };
  }, [id, getCaseById]);

  const settled = fetched.id === id && fetched.done;
  const caseItem = fetched.id === id ? fetched.case : null;

  // A closed or cancelled case is frozen, remarks included — the backend
  // refuses one with a 409, so don't offer the box in the first place.
  const frozen = Boolean(caseItem?.status?.is_terminal);

  // The saved remark comes back with its author snapshot, so it goes straight
  // into the thread instead of costing a refetch of the whole case.
  const addRemark = useCallback(
    async (content) => {
      const created = await create(id, content);
      if (!created) return;

      setFetched((previous) =>
        previous.case
          ? {
              ...previous,
              case: {
                ...previous.case,
                remarks: [created, ...(previous.case.remarks || [])],
              },
            }
          : previous,
      );
    },
    [create, id],
  );

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 w-full max-w-6xl mx-auto">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="h-8 w-8"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} />
        </Button>
        <h1 className="text-lg font-semibold text-foreground capitalize">
          Update Case
        </h1>
      </div>

      {!settled ? (
        <div className="flex items-center justify-center gap-2 rounded-md border border-border bg-card py-16 text-sm text-muted-foreground shadow-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading case…
        </div>
      ) : !caseItem ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-md border border-border bg-card py-16 shadow-sm">
          <p className="text-sm text-muted-foreground">Case not found.</p>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Back to cases
          </Button>
        </div>
      ) : (
        <>
          {/* Remounted if the route's id changes, so the form re-seeds from the
              case it is actually editing. */}
          <UpdateCaseForm key={caseItem.id} caseItem={caseItem} />

          {/* The API sends the thread newest-first (it is a preview of the
              latest); the panel reads top-down, so flip it to chronological. */}
          <Comment
            remarks={[...(caseItem.remarks || [])].reverse().map(toComment)}
            onSubmit={addRemark}
            disabled={frozen}
          />
          {frozen ? (
            <p className="text-xs text-muted-foreground">
              This case is {formatStatus(caseItem.status?.name)} and can no
              longer be commented on.
            </p>
          ) : null}
          {caseItem.has_more_remarks ? (
            <p className="text-xs text-muted-foreground">
              Showing the most recent remarks only.
            </p>
          ) : null}
        </>
      )}
    </div>
  );
};

export default UpdateCase;
