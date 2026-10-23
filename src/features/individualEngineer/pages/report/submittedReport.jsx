import React from "react";
import { useParams } from "react-router-dom";
import Step1 from "@/features/individualEngineer/pages/report/steps/step1";
import Step2 from "@/features/individualEngineer/pages/report/steps/step2";
import Step3 from "@/features/individualEngineer/pages/report/steps/step3";
import Step4 from "@/features/individualEngineer/pages/report/steps/step4";
import Step5 from "@/features/individualEngineer/pages/report/steps/step5";
import Step6 from "@/features/individualEngineer/pages/report/steps/step6";
import useGetReportByCaseId from "@/hooks/report/useGetReportByCaseId";

const SubmittedReport = () => {
  const { id: caseId } = useParams();
  const { report, task, loading, error } = useGetReportByCaseId(caseId);

  if (loading) {
    return <p role="status">Loading submitted report...</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  const submittedAt = report?.submittedAt
    ? new Date(report.submittedAt).toLocaleString()
    : "Unknown";
  const formData = report?.formData ?? {};

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 py-4">
      <header className="rounded-md border border-border bg-card p-5">
        <h1 className="text-lg font-semibold text-foreground">
          Submitted Site Visit Report
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Submitted on {submittedAt}. This report is read-only.
        </p>
      </header>

      <fieldset
        disabled
        className="min-w-0 space-y-6 border-0 p-0"
        aria-label="Submitted report"
      >
        <Step1
          initialData={formData.step1 ?? {}}
          task={task}
          showInitiationAddress
        />
        <section className="rounded-md border border-border bg-card p-5">
          <Step2 initialData={formData.step2 ?? {}} />
        </section>
        <section className="rounded-md border border-border bg-card p-5">
          <Step3 initialData={formData.step3 ?? {}} />
        </section>
        <section className="rounded-md border border-border bg-card p-5">
          <Step4 initialData={formData.step4 ?? {}} />
        </section>
        <section className="rounded-md border border-border bg-card p-5">
          <Step5 initialData={formData.step5 ?? {}} />
        </section>
        <section className="rounded-md border border-border bg-card p-5">
          <Step6 initialData={formData.step6 ?? {}} />
        </section>
      </fieldset>
      <p className="text-sm text-muted-foreground">
        Report photos were not included because photo storage is not configured.
      </p>
    </div>
  );
};

export default SubmittedReport;
