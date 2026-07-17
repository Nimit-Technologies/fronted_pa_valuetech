import React, { forwardRef, useImperativeHandle, useRef } from "react";
import Coverage from "@/features/individualEngineer/components/sheet/step3/coverage";
import PropertyLocation from "@/features/individualEngineer/components/sheet/step3/propertyLocation";
import PropertyUsage from "@/features/individualEngineer/components/sheet/step3/propertyUsage";
import Road from "@/features/individualEngineer/components/sheet/step3/road";
import Transport from "@/features/individualEngineer/components/sheet/step3/transport";
import { sheetData } from "@/features/individualEngineer/data/sheet.js";

const Step3 = forwardRef((_props, ref) => {
  const propertyUsageRef = useRef(null);
  const propertyLocationRef = useRef(null);
  const coverageRef = useRef(null);
  const transportRef = useRef(null);
  const roadRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getData: () => ({
      propertyUsage: propertyUsageRef.current?.getData(),
      propertyLocation: propertyLocationRef.current?.getData(),
      coverage: coverageRef.current?.getData(),
      transport: transportRef.current?.getData(),
      road: roadRef.current?.getData(),
    }),
  }));

  return (
    <div className=" bg-card p-5 space-y-10">
      <div className="space-y-6">
        <PropertyUsage ref={propertyUsageRef} data={sheetData.propertyUsage} />
        <PropertyLocation
          ref={propertyLocationRef}
          data={sheetData.propertyLocation}
        />
        <Coverage ref={coverageRef} data={sheetData.coverage} />
        <Transport ref={transportRef} data={sheetData.transPort} />
        <Road ref={roadRef} data={sheetData.road} />
      </div>
    </div>
  );
});

Step3.displayName = "Step3";

export default Step3;
