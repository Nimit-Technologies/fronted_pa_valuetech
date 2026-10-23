import React, { forwardRef, useImperativeHandle, useState } from "react";
import FormHeader from "@/features/individualEngineer/components/sheet/formHeader";
import { Input } from "@/components/ui/input";

const PLOT_MEASURED_FIELD = "plot measured yes or no, (if no give reason)";
const YES_NO_FIELDS = new Set(["entire property shown", "internal pics taken"]);
const NUMBER_FIELDS = new Set(["year of construction", "number of floors"]);

const RequiredLabel = ({ children }) => (
  <label className="flex items-center gap-2 mb-3 text-sm font-medium capitalize text-foreground">
    {children}
  </label>
);

const Coverage = forwardRef(({ data, initialValues = {} }, ref) => {
  const [values, setValues] = useState(() => initialValues);
  const [plotMeasured, setPlotMeasured] = useState(() => {
    const value = initialValues[PLOT_MEASURED_FIELD] ?? "";
    if (/^yes\b/i.test(value)) return "Yes";
    if (/^no\b/i.test(value)) return "No";
    return "";
  });
  const [plotMeasuredReason, setPlotMeasuredReason] = useState(() => {
    const value = initialValues[PLOT_MEASURED_FIELD] ?? "";
    return value.replace(/^no\b\s*[,;:-]?\s*/i, "");
  });

  const handleChange = (item, value) => {
    setValues((prev) => ({ ...prev, [item]: value }));
  };

  useImperativeHandle(ref, () => ({
    getData: () =>
      data?.includes(PLOT_MEASURED_FIELD)
        ? {
            ...values,
            [PLOT_MEASURED_FIELD]:
              plotMeasured === "No" && plotMeasuredReason.trim()
                ? `No, ${plotMeasuredReason.trim()}`
                : plotMeasured,
          }
        : values,
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
                {item === PLOT_MEASURED_FIELD ? (
                  <div className="space-y-2">
                    <select
                      aria-label={item}
                      value={plotMeasured}
                      onChange={(e) => setPlotMeasured(e.target.value)}
                      className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                    {plotMeasured === "No" && (
                      <Input
                        aria-label="Reason plot was not measured"
                        value={plotMeasuredReason}
                        onChange={(e) => setPlotMeasuredReason(e.target.value)}
                        className="h-11 w-full"
                      />
                    )}
                  </div>
                ) : YES_NO_FIELDS.has(item) ? (
                  <select
                    aria-label={item}
                    value={values[item] ?? ""}
                    onChange={(e) => handleChange(item, e.target.value)}
                    className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                ) : (
                  <Input
                    type={NUMBER_FIELDS.has(item) ? "number" : "text"}
                    min={NUMBER_FIELDS.has(item) ? "0" : undefined}
                    step={NUMBER_FIELDS.has(item) ? "1" : undefined}
                    value={values[item] ?? ""}
                    onChange={(e) => handleChange(item, e.target.value)}
                    className="h-11 w-full"
                  />
                )}
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
