import React, { useMemo, useState } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import SearchInput from "@/components/shared/searchInput";
import { cn } from "@/lib/utils";

const ColumnFilter = ({
  label,
  options = [],
  selected = null,
  onChange,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");

  const isAll = selected === null;
  const isChecked = (value) => isAll || selected.includes(value);

  const visible = useMemo(() => {
    const query = term.trim().toLowerCase();
    if (!query) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(query),
    );
  }, [options, term]);

  const allVisibleChecked =
    visible.length > 0 && visible.every((option) => isChecked(option.value));

  const currentValues = () =>
    isAll ? options.map((option) => option.value) : selected;

  const commit = (nextValues) => {
    const everyOptionKept = options.every((option) =>
      nextValues.includes(option.value),
    );
    onChange?.(everyOptionKept ? null : nextValues);
  };

  const toggleOne = (value) => {
    const current = currentValues();
    commit(
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
  };

  const toggleVisible = () => {
    const current = currentValues();
    const visibleValues = visible.map((option) => option.value);
    commit(
      allVisibleChecked
        ? current.filter((item) => !visibleValues.includes(item))
        : Array.from(new Set([...current, ...visibleValues])),
    );
  };

  const handleOpenChange = (next) => {
    setOpen(next);
    if (!next) setTerm("");
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`Filter ${label}`}
          title={
            isAll ? `Filter ${label}` : `${label}: ${selected.length} selected`
          }
          disabled={disabled}
          className={cn(
            "ml-1 inline-flex h-6 w-6 items-center justify-center rounded transition-colors hover:bg-muted disabled:opacity-50",
            isAll ? "text-muted-foreground" : "text-primary",
          )}
        >
          <Filter size={14} className={isAll ? "" : "fill-current"} />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-64 p-0"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <div className="border-b border-border px-3 py-2 text-sm font-semibold text-foreground">
          Filter by {label}
        </div>

        <div className="px-2 pt-2">
          <SearchInput
            placeholder={`Search ${label.toLowerCase()}...`}
            value={term}
            onValueChange={setTerm}
            inputClassName="h-9"
          />
        </div>

        <div className="max-h-56 overflow-y-auto px-2 py-2 text-sm">
          {visible.length === 0 ? (
            <p className="px-1 py-3 text-center text-muted-foreground">
              {options.length === 0
                ? "No values to filter."
                : "No values match."}
            </p>
          ) : (
            <>
              <label className="flex cursor-pointer items-center gap-2 rounded px-1 py-1 hover:bg-muted">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-primary"
                  checked={allVisibleChecked}
                  onChange={toggleVisible}
                />
                <span className="font-medium text-foreground">
                  {term ? "Select all results" : "Select all"}
                </span>
              </label>
              {visible.map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center gap-2 rounded px-1 py-1 hover:bg-muted"
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-primary"
                    checked={isChecked(option.value)}
                    onChange={() => toggleOne(option.value)}
                  />
                  <span className="truncate capitalize text-foreground">
                    {option.label}
                  </span>
                </label>
              ))}
            </>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border px-2 py-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            onClick={() => onChange?.(null)}
            disabled={isAll}
          >
            Clear
          </Button>
          <Button
            type="button"
            size="sm"
            className="h-8 px-3"
            onClick={() => handleOpenChange(false)}
          >
            Done
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ColumnFilter;
