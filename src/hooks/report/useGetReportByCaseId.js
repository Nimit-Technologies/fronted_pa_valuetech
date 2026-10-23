import { useEffect, useState } from "react";
import getMySubmittedReport from "@/features/individualEngineer/services/getMySubmittedReport";
import { extractErrorMessage } from "@/utils/extractErrorMessage";

const useGetReportByCaseId = (caseId) => {
  const [report, setReport] = useState(null);
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(Boolean(caseId));
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCurrent = true;

    if (!caseId) {
      return () => {
        isCurrent = false;
      };
    }

    const loadReport = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getMySubmittedReport(caseId);
        if (!isCurrent) return;

        setReport(response.data.report);
        setTask(response.data.task);
      } catch (requestError) {
        if (!isCurrent) return;

        setReport(null);
        setTask(null);
        setError(
          extractErrorMessage(
            requestError,
            "Failed to load the submitted report.",
          ),
        );
      } finally {
        if (isCurrent) setLoading(false);
      }
    };

    loadReport();
    return () => {
      isCurrent = false;
    };
  }, [caseId]);

  return {
    report: caseId ? report : null,
    task: caseId ? task : null,
    loading,
    error:
      error ?? (!caseId ? "A case ID is required to load this report." : null),
  };
};

export default useGetReportByCaseId;
