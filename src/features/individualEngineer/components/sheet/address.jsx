import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Input } from "@/components/ui/input";

const RequiredLabel = ({ children }) => (
  <label className="mb-2 flex items-center gap-1 text-sm font-medium capitalize text-foreground">
    {children}
    <span className="text-destructive text-base leading-none">*</span>
  </label>
);

const FIELD_KEYS = [
  "city",
  "district",
  "state",
  "pin_code",
  "country",
  "lane",
  "landmark",
];

const Address = forwardRef(
  (
    {
      address = {},
      label,
      className,
      value,
      onChange,
      checked,
      onCheckedChange,
    },
    ref,
  ) => {
    const isControlled = value !== undefined;
    const [internalFields, setInternalFields] = useState(() =>
      FIELD_KEYS.reduce(
        (acc, key) => ({ ...acc, [key]: address[key] || "" }),
        {},
      ),
    );

    const fields = isControlled ? value : internalFields;

    const handleFieldChange = (key, fieldValue) => {
      if (isControlled) {
        onChange(key, fieldValue);
      } else {
        setInternalFields((prev) => ({ ...prev, [key]: fieldValue }));
      }
    };

    useImperativeHandle(ref, () => ({
      getValues: () => fields,
    }));

    return (
      <div className="space-y-6 bg-card p-5">
        {/* Header with label + checkbox */}
        <div className="flex items-center gap-3 border-b border-border pb-2">
          <h2 className="text-base font-semibold text-foreground capitalize">
            {label || "Address as per initiation"}
          </h2>
          <Input
            type="checkbox"
            checked={checked}
            onChange={(e) => onCheckedChange?.(e.target.checked)}
            className={`h-5 w-5 ${className || ""}`}
          />
        </div>

        {/* Responsive grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <RequiredLabel>City</RequiredLabel>
            <Input
              value={fields.city}
              onChange={(e) => handleFieldChange("city", e.target.value)}
              className="h-11 w-full"
            />
          </div>

          <div>
            <RequiredLabel>District</RequiredLabel>
            <Input
              value={fields.district}
              onChange={(e) => handleFieldChange("district", e.target.value)}
              className="h-11 w-full"
            />
          </div>

          <div>
            <RequiredLabel>State</RequiredLabel>
            <Input
              value={fields.state}
              onChange={(e) => handleFieldChange("state", e.target.value)}
              className="h-11 w-full"
            />
          </div>

          <div>
            <RequiredLabel>Pincode</RequiredLabel>
            <Input
              value={fields.pin_code}
              onChange={(e) => handleFieldChange("pin_code", e.target.value)}
              className="h-11 w-full"
            />
          </div>

          <div>
            <RequiredLabel>Country</RequiredLabel>
            <Input
              value={fields.country}
              onChange={(e) => handleFieldChange("country", e.target.value)}
              className="h-11 w-full"
            />
          </div>

          <div className="col-span-1 sm:col-span-2 lg:col-span-3">
            <RequiredLabel>Lane</RequiredLabel>
            <Input
              value={fields.lane}
              onChange={(e) => handleFieldChange("lane", e.target.value)}
              className="h-11 w-full"
            />
          </div>

          <div className="col-span-1 sm:col-span-2 lg:col-span-3">
            <RequiredLabel>Landmark</RequiredLabel>
            <Input
              value={fields.landmark}
              onChange={(e) => handleFieldChange("landmark", e.target.value)}
              className="h-11 w-full"
            />
          </div>
        </div>
      </div>
    );
  },
);

Address.displayName = "Address";

export default Address;
