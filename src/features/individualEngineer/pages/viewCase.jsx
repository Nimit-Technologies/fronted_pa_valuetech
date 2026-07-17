import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import Comment from "@/components/shared/comment";
import ViewCaseForm from "@/features/individualEngineer/components/case/viewCaseForm";
import { caseData } from "@/features/individualEngineer/data/case/caseTable";
import CaseHeader from "@/features/individualEngineer/components/caseHeader";

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
    <>
      <div className="flex  border-b sticky z-30 top-0 bg-card py-4  px-3  items-center justify-between gap-3">
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

        <Button
          asChild
          variant="default"
          size="icon-sm"
          className="h-10 w-fit px-4 py-1.5 shrink-0 text-white"
        >
          <Link
            className="flex  items-center gap-1.5"
            to={`/engineer/report/create/${caseItem.id}`}
          >
            <Pencil size={14} />
            <span className=" hidden text-xs whitespace-nowrap sm:inline">
              Fill Sheet
            </span>
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-3 p-4 sm:p-6 lg:p-8 w-full max-w-6xl mx-auto">
        <CaseHeader caseItem={caseItem} />

        <ViewCaseForm />
        <Comment
          remarks={caseItem?.remarks || []}
          onAddComment={handleAddComment}
        />
      </div>
    </>
  );
};

export default ViewCase;
