import React, { forwardRef, useImperativeHandle, useRef } from "react";
import Step6Data from "@/features/individualEngineer/components/sheet/step6/step6";
import { sheetData } from "@/features/individualEngineer/data/sheet";

const Step6 = forwardRef((_props, ref) => {
  const step6DataRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getData: () => step6DataRef.current?.getData(),
  }));

  return (
    <div className=" bg-card p-5 space-y-10">
      <Step6Data ref={step6DataRef} data={sheetData.step6} />
    </div>
  );
});

Step6.displayName = "Step6";

export default Step6;
