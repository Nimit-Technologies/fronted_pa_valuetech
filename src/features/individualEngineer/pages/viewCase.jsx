import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, Loader2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Comment from "@/components/shared/comment";
import ViewCaseForm from "@/features/individualEngineer/components/case/viewCaseForm";
import useGetCaseById from "@/features/individualCoordinator/hooks/case/useGetCaseById";
import useCreateRemark from "@/features/individualCoordinator/hooks/remark/useCreateRemark";
import { toComment } from "@/features/individualCoordinator/utils/toComment";
import { STATUS_STYLES, formatStatus } from "@/constants/formatStatus";
import { formatDate } from "@/constants/formatDate";

const ViewCase = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getCaseById } = useGetCaseById();
  const { create } = useCreateRemark();
  const [fetched, setFetched] = useState({ id: null, case: null, done: false });

  useEffect(() => {
    let cancelled = false;

    getCaseById(id).then((response) => {
      if (!cancelled) {
        setFetched({ id, case: response?.data ?? null, done: true });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [getCaseById, id]);

  const caseItem = fetched.id === id ? fetched.case : null;
  const loading = !(fetched.id === id && fetched.done);
  const statusCode = caseItem?.status?.code;
  const frozen = Boolean(caseItem?.status?.is_terminal);

  const addRemark = useCallback(
    async (content) => {
      const created = await create(id, content);
      if (!created) return;

      setFetched((previous) =>
        previous.id === id && previous.case
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
    <div className="flex flex-col gap-3 p-4 sm:p-6 lg:p-8 w-full max-w-6xl mx-auto">
      <div className="flex items-center justify-between gap-3">
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
            View Case
          </h1>
        </div>
      </div>

      {loading ? (
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
          <div className="flex w-full flex-col gap-3 rounded-lg border border-border bg-card px-4 py-6 shadow-xs sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-5">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User size={15} className="shrink-0 text-primary" />
                <span>
                  Created by{" "}
                  <span className="font-medium text-foreground capitalize">
                    {caseItem.created_by?.first_name || "-"}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays size={15} className="shrink-0 text-primary" />
                <span>
                  Created on{" "}
                  <span className="font-medium text-foreground">
                    {formatDate(caseItem.created_at)}
                  </span>
                </span>
              </div>
            </div>
            <span
              className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ${
                STATUS_STYLES[statusCode] || "bg-gray-100 text-gray-800"
              }`}
            >
              {formatStatus(caseItem.status?.name || statusCode)}
            </span>
          </div>

          <ViewCaseForm caseItem={caseItem} />
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

export default ViewCase;
