import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreateCaseForm from "@/features/individualCoordinator/components/case/CreateCaseForm";

// No remark panel here: remarks belong to a case, and there is no case until
// this form succeeds. The submit button lives inside the form now, so it can
// show the write in flight and gate the duplicate confirmation.
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
    </div>
  );
};

export default CreateCase;
