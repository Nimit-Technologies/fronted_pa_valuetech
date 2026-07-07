import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Comment from "@/components/shared/comment";
import UpdateCaseForm from "@/features/individualCoordinator/components/case/updateCaseForm";
import { caseData } from "@/features/individualCoordinator/data/case/caseTable";

const UpdateCase = () => {
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

      <UpdateCaseForm />
      <Comment remarks={caseItem?.remarks || []} onAddComment={handleAddComment} />

      <div className="flex justify-center pt-2 pb-6">
        <Button
          type="submit"
          form="case-form"
          className="max-w-xs w-full py-5 text-base capitalize"
        >
          Update Case
        </Button>
      </div>
    </div>
  );
};

export default UpdateCase;
