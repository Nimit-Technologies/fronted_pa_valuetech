import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreateCaseForm from "@/features/individualCoordinator/components/case/createCaseForm";
import Comment from "@/components/shared/comment";

const CreateCase = () => {
  const navigate = useNavigate();

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
          Create Case
        </h1>
      </div>

      <CreateCaseForm />
      <Comment />

      <div className="flex justify-center pt-2 pb-6">
        <Button
          type="submit"
          form="case-form"
          className="max-w-xs w-full py-5 text-base capitalize"
        >
          Create Case
        </Button>
      </div>
    </div>
  );
};

export default CreateCase;
