import React, { useEffect, useRef, useState } from "react";
import debounce from "debounce";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const SearchInput = ({
  value,
  defaultValue = "",
  onSearch,
  onValueChange,
  debounceTime = 300,
  placeholder = "Search...",
  disabled = false,
  clearable = true,
  className,
  inputClassName,
  ...inputProps
}) => {
  const isControlled = value !== undefined;
  const [innerValue, setInnerValue] = useState(defaultValue);
  const term = isControlled ? value : innerValue;

  const onSearchRef = useRef(onSearch);
  const debouncedRef = useRef(null);

  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  useEffect(() => {
    const debounced = debounce(
      (next) => onSearchRef.current?.(next),
      debounceTime,
    );
    debouncedRef.current = debounced;
    return () => {
      debounced.clear();
      debouncedRef.current = null;
    };
  }, [debounceTime]);

  const update = (next, { immediate = false } = {}) => {
    if (!isControlled) setInnerValue(next);
    onValueChange?.(next);
    if (immediate) {
      debouncedRef.current?.clear();
      onSearchRef.current?.(next);
    } else {
      debouncedRef.current?.(next);
    }
  };

  const showClear = clearable && Boolean(term) && !disabled;

  return (
    <div className={cn("relative flex items-center", className)}>
      <Search
        size={16}
        className="absolute left-3 text-muted-foreground pointer-events-none"
      />
      <Input
        type="text"
        value={term}
        onChange={(e) => update(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={cn("pl-9", showClear && "pr-8", inputClassName)}
        {...inputProps}
      />
      {showClear && (
        <button
          type="button"
          onClick={() => update("", { immediate: true })}
          aria-label="Clear search"
          className="absolute right-2 rounded-sm p-0.5 text-muted-foreground hover:text-foreground"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
