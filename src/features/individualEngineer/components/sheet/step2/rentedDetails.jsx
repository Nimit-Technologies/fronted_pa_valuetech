import React, { forwardRef, useImperativeHandle, useState } from "react";
import FormHeader from "@/features/individualEngineer/components/sheet/formHeader";
import { Input } from "@/components/ui/input";

const RequiredLabel = ({ children }) => (
  <label className="flex items-center gap-2 mb-3 text-sm font-medium capitalize text-foreground">
    {children}
  </label>
);

const RentedDetails = forwardRef(({ data }, ref) => {
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
        <FormHeader>if rented, details of rented area & rent</FormHeader>

        {/* Responsive grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data?.map((item) => (
            <div key={item}>
              <RequiredLabel>{item}</RequiredLabel>
              <Input
                value={values[item] ?? ""}
                onChange={(e) => handleChange(item, e.target.value)}
                className="h-11 w-full"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

RentedDetails.displayName = "RentedDetails";

export default RentedDetails;
