import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Pagination = ({
  currentPage = 1,
  totalPages = null,
  hasPreviousPage = false,
  hasNextPage = false,
  onPrev,
  onNext,
  disabled = false,
  compact = false,
  label,
  className,
}) => {
  const pageLabel =
    label ??
    `Page ${currentPage}${Number.isFinite(totalPages) ? ` of ${totalPages}` : ""}`;
  const prevDisabled = disabled || !hasPreviousPage;
  const nextDisabled = disabled || !hasNextPage;

  if (compact) {
    return (
      <div
        className={cn(
          "flex items-center justify-between gap-2 px-2 py-2",
          className,
        )}
      >
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 px-2"
          onClick={onPrev}
          disabled={prevDisabled}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {pageLabel}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 px-2"
          onClick={onNext}
          disabled={nextDisabled}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "w-full flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 shadow rounded-md mt-4",
        className,
      )}
    >
      <p className="text-sm font-medium text-muted-foreground">{pageLabel}</p>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="flex-1 sm:flex-none px-6"
          onClick={onPrev}
          disabled={prevDisabled}
        >
          Previous
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="flex-1 sm:flex-none px-10"
          onClick={onNext}
          disabled={nextDisabled}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
