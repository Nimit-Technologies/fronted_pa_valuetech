import React, { forwardRef, useImperativeHandle, useState } from "react";
import FormHeader from "@/features/individualEngineer/components/sheet/formHeader";
import { Input } from "@/components/ui/input";

const Occupation = forwardRef(({ data, initialValues = {} }, ref) => {
  const [checkedItems, setCheckedItems] = useState(() => initialValues);
  const [otherText, setOtherText] = useState(
    () => initialValues.otherText ?? "",
  );

  const handleToggle = (item, isChecked) => {
    setCheckedItems((prev) => ({ ...prev, [item]: isChecked }));
  };

  useImperativeHandle(ref, () => ({
    getData: () => ({ ...checkedItems, otherText }),
  }));

  return (
    <div className="space-y-6">
      <FormHeader>Occupation Status</FormHeader>

      {/* Responsive grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {data.map((item) => (
          <div key={item} className="flex items-center">
            <label className="flex items-center gap-2 text-sm font-medium capitalize text-foreground">
              <Input
                type="checkbox"
                className="h-5 w-5"
                checked={checkedItems[item] || false}
                onChange={(e) => handleToggle(item, e.target.checked)}
              />
              {item}
            </label>
            {item === "other" && checkedItems[item] && (
              <Input
                aria-label="Other occupation"
                value={otherText}
                onChange={(e) => setOtherText(e.target.value)}
                className="ml-2 h-9"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

Occupation.displayName = "Occupation";

export default Occupation;
