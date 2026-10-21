import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import AssignCaseAPI from "@/features/individualCoordinator/services/case/assignCase";
import { updateCaseInList } from "@/store/slice/case/caseSlice";
import { extractErrorMessage } from "@/utils/extractErrorMessage";
import { useResourceCache } from "@/hooks/cache/useResourceCache";

const useAssignCase = () => {
  const dispatch = useDispatch();
  const { invalidate } = useResourceCache("case");
  const [isAssigning, setIsAssigning] = useState(false);

  const assign = useCallback(
    async (caseId, employeeId) => {
      setIsAssigning(true);
      try {
        const response = await AssignCaseAPI(caseId, employeeId);
        if (response?.data) {
          dispatch(updateCaseInList(response.data));
        }
        invalidate();
        toast.success(response?.message || "Engineer assigned successfully", {
          duration: 1500,
        });
        return response;
      } catch (err) {
        toast.error(extractErrorMessage(err, "Failed to assign engineer"), {
          duration: 2500,
        });
        throw err;
      } finally {
        setIsAssigning(false);
      }
    },
    [dispatch, invalidate],
  );

  return { assign, isAssigning };
};

export default useAssignCase;
