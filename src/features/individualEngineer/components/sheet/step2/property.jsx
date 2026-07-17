import React, { forwardRef, useImperativeHandle, useState } from "react";
import FormHeader from "@/features/individualEngineer/components/sheet/formHeader";
import { Input } from "@/components/ui/input";

const Property = forwardRef(({ data }, ref) => {
  const [checkedItems, setCheckedItems] = useState({});

  const handleToggle = (item, isChecked) => {
    setCheckedItems((prev) => ({ ...prev, [item]: isChecked }));
  };

  useImperativeHandle(ref, () => ({
    getData: () => checkedItems,
  }));

  return (
    <div className="space-y-6">
      <FormHeader>Type of property</FormHeader>

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
          </div>
        ))}
      </div>
    </div>
  );
});

Property.displayName = "Property";

export default Property;
