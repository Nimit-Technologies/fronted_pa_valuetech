import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { updateEngineerTaskStatus } from "@/features/individualEngineer/slice/engineerTaskSlice";
import transitionEngineerCase from "@/features/individualEngineer/services/transitionEngineerCase";
import { extractErrorMessage } from "@/utils/extractErrorMessage";

const useTransitionEngineerCase = () => {
  const dispatch = useDispatch();
  const [updatingCaseId, setUpdatingCaseId] = useState(null);

  const transition = useCallback(
    async (caseId, status) => {
      setUpdatingCaseId(caseId);
      try {
        const response = await transitionEngineerCase(caseId, status.code);
        dispatch(
          updateEngineerTaskStatus({
            caseId,
            status: response.data.status,
          }),
        );
        toast.success(response.message || "Case status updated");
        return response.data;
      } catch (error) {
        toast.error(
          extractErrorMessage(error, "Failed to update case status."),
        );
        return null;
      } finally {
        setUpdatingCaseId(null);
      }
    },
    [dispatch],
  );

  return { transition, updatingCaseId };
};

export default useTransitionEngineerCase;
