import React, { useMemo, useState } from "react";
import Step1 from "@/features/individualEngineer/pages/report/steps/step1";
import Step2 from "@/features/individualEngineer/pages/report/steps/step2";
import Step3 from "@/features/individualEngineer/pages/report/steps/step3";
import Step4 from "@/features/individualEngineer/pages/report/steps/step4";
import Step5 from "@/features/individualEngineer/pages/report/steps/step5";
import Step6 from "@/features/individualEngineer/pages/report/steps/step6";
import Step7 from "@/features/individualEngineer/pages/report/steps/step7";
import Pagination from "@/features/individualEngineer/components/pagination";

const STEP_COMPONENTS = [Step1, Step2, Step3, Step4, Step5, Step6, Step7];
const TOTAL_STEPS = STEP_COMPONENTS.length;

const Report = () => {
  const [currentPage, setCurrentPage] = useState(1);

  // Every step stays mounted (visibility toggled via CSS) so its state
  // survives navigating away and back; a ref per step lets us pull each
  // step's current values on submit.
  const stepRefs = useMemo(
    () => STEP_COMPONENTS.map(() => React.createRef()),
    [],
  );

  const isLastStep = currentPage === TOTAL_STEPS;

  const handlePrev = () => setCurrentPage((page) => Math.max(1, page - 1));
  const handleNext = () =>
    setCurrentPage((page) => Math.min(TOTAL_STEPS, page + 1));

  const handleSubmit = () => {
    const allData = stepRefs.reduce((acc, stepRef, index) => {
      acc[`step${index + 1}`] = stepRef.current?.getData();
      return acc;
    }, {});
    console.log("Report submitted:", allData);
  };

  return (
    <div className="max-w-5xl w-full mx-auto  space-y-4 py-4">
      {STEP_COMPONENTS.map((StepComponent, index) => (
        <div key={index} className={currentPage === index + 1 ? "" : "hidden"}>
          <StepComponent ref={stepRefs[index]} />
        </div>
      ))}

      <Pagination
        currentPage={currentPage}
        totalPages={TOTAL_STEPS}
        onPrev={handlePrev}
        onNext={handleNext}
        isLastStep={isLastStep}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default Report;
