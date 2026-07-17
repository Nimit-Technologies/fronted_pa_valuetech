import React, { forwardRef, useImperativeHandle, useRef } from "react";
import Header1 from "@/features/individualEngineer/components/sheet/step1/header1";
import Header2 from "@/features/individualEngineer/components/sheet/step1/header2";
import Section1 from "@/features/individualEngineer/components/sheet/step1/section1";

const Step1 = forwardRef((_props, ref) => {
  const section1Ref = useRef(null);

  useImperativeHandle(ref, () => ({
    getData: () => section1Ref.current?.getData(),
  }));

  return (
    <div className="space-y-4 ">
      <Header1 />
      <Header2 />
      <Section1 ref={section1Ref} />
    </div>
  );
});

Step1.displayName = "Step1";

export default Step1;
