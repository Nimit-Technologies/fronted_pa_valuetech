import React, { forwardRef, useImperativeHandle, useState } from "react";
import FormHeader from "@/features/individualEngineer/components/sheet/formHeader";
import { Input } from "@/components/ui/input";

const RequiredLabel = ({ children }) => (
  <label className="flex items-center gap-2 mb-3 text-sm font-medium capitalize text-foreground">
    {children}
  </label>
);

const Coverage = forwardRef(({ data }, ref) => {
  const [values, setValues] = useState({});

  const handleChange = (item, value) => {
    setValues((prev) => ({ ...prev, [item]: value }));
  };

  useImperativeHandle(ref, () => ({
    getData: () => values,
  }));

  return (
    <div>
      <div className="space-y-6">
        <FormHeader>How it cover on (Direction)</FormHeader>

        {/* Responsive grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {data?.map((item, index) => {
            const isLastItem = index === data.length - 1;
            const shouldSpanFullWidth = data.length % 2 !== 0 && isLastItem;

            return (
              <div
                key={item}
                className={shouldSpanFullWidth ? "lg:col-span-2" : ""}
              >
                <RequiredLabel>{item}</RequiredLabel>
                <Input
                  value={values[item] ?? ""}
                  onChange={(e) => handleChange(item, e.target.value)}
                  className="h-11 w-full"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

Coverage.displayName = "Coverage";

export default Coverage;
