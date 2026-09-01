import React from "react";
import { Button } from "@/components/ui/button";

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPrev,
  onNext,
  hasPreviousPage = false,
  hasNextPage = false,
}) => {
  return (
    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 shadow rounded-md mt-4">
      <p className="text-sm font-medium text-muted-foreground">
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 sm:flex-none px-6"
          onClick={onPrev}
          disabled={!hasPreviousPage}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 sm:flex-none px-10"
          onClick={onNext}
          disabled={!hasNextPage}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
