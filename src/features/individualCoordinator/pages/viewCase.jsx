import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, User, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import Comment from "@/components/shared/comment";
import ViewCaseForm from "@/features/individualCoordinator/components/case/viewCaseForm";
import { STATUS_STYLES, formatStatus } from "@/constants/formatStatus";
import { formatDate } from "@/constants/formatDate";
import { caseData } from "@/features/individualCoordinator/data/case/caseTable";

const ViewCase = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const caseItem = caseData.data.find((c) => c.id === id);

  const handleAddComment = (newRemark) => {
    const index = caseData.data.findIndex((c) => c.id === id);
    if (index === -1) return;
    caseData.data[index] = {
      ...caseData.data[index],
      remarks: [...(caseData.data[index].remarks || []), newRemark],
    };
  };

  return (
    <div className="flex flex-col gap-3 p-4 sm:p-6 lg:p-8 w-full max-w-6xl mx-auto">
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

      <div className="flex  w-full flex-col gap-3 rounded-lg border border-border bg-card px-4 py-6 shadow-xs sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User size={15} className="shrink-0 text-primary" />
            <span>
              Created by{" "}
              <span className="font-medium text-foreground">
                {caseItem?.created_by?.first_name || "-"}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays size={15} className="shrink-0 text-primary" />
            <span>
              Created on{" "}
              <span className="font-medium text-foreground">
                {formatDate(caseItem?.created_at)}
              </span>
            </span>
          </div>
        </div>

        <span
          className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ${
            STATUS_STYLES[caseItem?.status] || "bg-gray-100 text-gray-800"
          }`}
        >
          {formatStatus(caseItem?.status)}
        </span>
      </div>

      <ViewCaseForm />
      <Comment
        remarks={caseItem?.remarks || []}
        onAddComment={handleAddComment}
      />
    </div>
  );
};

export default ViewCase;
