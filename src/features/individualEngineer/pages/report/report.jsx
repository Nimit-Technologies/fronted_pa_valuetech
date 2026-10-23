import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Step1 from "@/features/individualEngineer/pages/report/steps/step1";
import Step2 from "@/features/individualEngineer/pages/report/steps/step2";
import Step3 from "@/features/individualEngineer/pages/report/steps/step3";
import Step4 from "@/features/individualEngineer/pages/report/steps/step4";
import Step5 from "@/features/individualEngineer/pages/report/steps/step5";
import Step6 from "@/features/individualEngineer/pages/report/steps/step6";
import Step7 from "@/features/individualEngineer/pages/report/steps/step7";
import Pagination from "@/features/individualEngineer/components/pagination";
import saveReport from "@/features/individualEngineer/services/saveReport";
import getMyReport from "@/features/individualEngineer/services/getMyReport";
import { extractErrorMessage } from "@/utils/extractErrorMessage";

const STEP_COMPONENTS = [Step1, Step2, Step3, Step4, Step5, Step6, Step7];
const TOTAL_STEPS = STEP_COMPONENTS.length;

const Report = () => {
  const { id: taskId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);
  const [initialData, setInitialData] = useState(null);
  const [isLoadingReport, setIsLoadingReport] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let isCurrent = true;

    const loadReport = async () => {
      try {
        if (!taskId) {
          throw new Error("The assigned task could not be identified.");
        }
        const response = await getMyReport(taskId);
        if (!isCurrent) return;
        const report = response.data;
        setInitialData(report?.formData ?? null);
        setCurrentPage(report?.currentStep ?? 1);
        setCompletedSteps(report?.completedSteps ?? []);
        setIsSubmitted(Boolean(report && !report.isDraft));
      } catch (error) {
        if (isCurrent) {
          setLoadError(
            extractErrorMessage(error, "Failed to load report draft."),
          );
        }
      } finally {
        if (isCurrent) setIsLoadingReport(false);
      }
    };

    loadReport();

    return () => {
      isCurrent = false;
    };
  }, [taskId]);

  // Every step stays mounted (visibility toggled via CSS) so its state
  // survives navigating away and back; a ref per step lets us pull each
  // step's current values on submit.
  const stepRefs = useMemo(
    () => STEP_COMPONENTS.map(() => React.createRef()),
    [],
  );

  const isLastStep = currentPage === TOTAL_STEPS;

  const handlePrev = () => setCurrentPage((page) => Math.max(1, page - 1));
  const handleNext = () => {
    setCompletedSteps((steps) =>
      steps.includes(currentPage) ? steps : [...steps, currentPage],
    );
    setCurrentPage((page) => Math.min(TOTAL_STEPS, page + 1));
    setSaveMessage(null);
  };

  const persistReport = async (action) => {
    if (!taskId) {
      setSaveMessage({
        type: "error",
        text: "The assigned task could not be identified.",
      });
      return;
    }

    const stepData = stepRefs.slice(0, 6).reduce((data, stepRef, index) => {
      data[`step${index + 1}`] = stepRef.current?.getData();
      return data;
    }, {});

    if (Object.values(stepData).some((step) => step === undefined)) {
      setSaveMessage({
        type: "error",
        text: "The report is not ready to save. Please reload and try again.",
      });
      return;
    }

    setIsSaving(true);
    setSaveMessage(null);
    try {
      await saveReport(taskId, {
        action,
        currentStep: action === "submit" ? TOTAL_STEPS : currentPage,
        completedSteps:
          action === "submit"
            ? Array.from({ length: TOTAL_STEPS }, (_, index) => index + 1)
            : completedSteps,
        stepData,
      });
      if (action === "submit") {
        setIsSubmitted(true);
        setSaveMessage({
          type: "success",
          text: "Report submitted successfully.",
        });
      } else {
        setSaveMessage({ type: "success", text: "Draft saved successfully." });
      }
    } catch (error) {
      setSaveMessage({
        type: "error",
        text: extractErrorMessage(error, "Failed to save report draft."),
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDraft = () => persistReport("draft");
  const handleSubmit = () => persistReport("submit");

  if (isLoadingReport) {
    return <p role="status">Loading report...</p>;
  }

  if (loadError) {
    return <p role="alert">{loadError}</p>;
  }

  return (
    <div className="max-w-5xl w-full mx-auto  space-y-4 py-4">
      {isSubmitted && (
        <p role="status" className="text-sm text-muted-foreground">
          This report has already been submitted and is read-only.
        </p>
      )}

      {STEP_COMPONENTS.map((StepComponent, index) => (
        <div key={index} className={currentPage === index + 1 ? "" : "hidden"}>
          <fieldset disabled={isSubmitted} className="min-w-0 border-0 p-0">
            <StepComponent
              ref={stepRefs[index]}
              initialData={initialData?.[`step${index + 1}`] ?? {}}
            />
          </fieldset>
        </div>
      ))}

      {saveMessage && (
        <p
          role={saveMessage.type === "error" ? "alert" : "status"}
          className={
            saveMessage.type === "error"
              ? "text-sm text-destructive"
              : "text-sm text-green-700"
          }
        >
          {saveMessage.text}
        </p>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={TOTAL_STEPS}
        onPrev={handlePrev}
        onNext={handleNext}
        isLastStep={isLastStep}
        onSaveDraft={handleSaveDraft}
        onSubmit={handleSubmit}
        isSaving={isSaving}
        isSubmitted={isSubmitted}
      />
    </div>
  );
};

export default Report;
