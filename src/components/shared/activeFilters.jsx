import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

// The bar above a filtered table: one chip per column that currently has a
// filter, a clear-all, and how much of the loaded page survives filtering.
// Renders nothing while no column is filtered, so pages can mount it
// unconditionally.
const ActiveFilters = ({
  columns = {},
  filters = {},
  activeColumns = [],
  onClearColumn,
  onClearAll,
  visibleCount,
  totalCount,
}) => {
  if (activeColumns.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <span className="text-muted-foreground">Filters:</span>

      {activeColumns.map((column) => {
        const label = columns[column]?.label ?? column;
        return (
          <span
            key={column}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-medium text-foreground"
          >
            {label} ({filters[column]?.length ?? 0})
            <button
              type="button"
              aria-label={`Clear ${label} filter`}
              className="rounded-full text-muted-foreground hover:text-destructive"
              onClick={() => onClearColumn?.(column)}
            >
              <X size={12} />
            </button>
          </span>
        );
      })}

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-7 px-2 text-xs"
        onClick={onClearAll}
      >
        Clear all
      </Button>

      <span className="ml-auto text-xs text-muted-foreground">
        Showing {visibleCount} of {totalCount} on this page
      </span>
    </div>
  );
};

export default ActiveFilters;
