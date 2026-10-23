import React, { forwardRef, useImperativeHandle, useRef } from "react";
import Step5Data from "@/features/individualEngineer/components/sheet/step5/step5";
import { sheetData } from "@/features/individualEngineer/data/sheet";

const Step5 = forwardRef(({ initialData = {} }, ref) => {
  const step5DataRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getData: () => step5DataRef.current?.getData(),
  }));

  return (
    <div className=" bg-card p-5 space-y-10">
      <Step5Data
        ref={step5DataRef}
        data={sheetData.step5}
        initialValues={initialData}
      />
    </div>
  );
});

Step5.displayName = "Step5";

export default Step5;
