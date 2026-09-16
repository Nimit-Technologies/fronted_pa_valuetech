import { useCallback, useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Pagination from "@/components/shared/pagination";
import SearchInput from "@/components/shared/searchInput";
import useAllBranch from "@/features/superAdmin/hooks/branch/useAllBranch";
import { usePaginationController } from "@/hooks/pagination/usePaginationController";

const FEATURE_KEY = "branch-dropdown";

const BranchDropDown = ({
  value,
  onSelect,
  disabled = false,
  placeholder = "Select Branch",
}) => {
  const {
    allBranch,
    branchData,
    branchFirstId,
    branchLastId,
    hasNextPage,
    hasPreviousPage,
    loading,
  } = useAllBranch();

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const isObjectValue = typeof value === "object" && value !== null;
  const selectedId = isObjectValue
    ? (value.branch_id ?? value.id ?? "")
    : (value ?? "");
  const selectedName = isObjectValue
    ? value.name
    : branchData.find((branchItem) => branchItem.id === selectedId)?.name;

  // Only live, active branches are assignable. The list API also returns
  // soft-deleted and inactive rows, so hide those here.
  const visibleBranches = branchData.filter(
    (branchItem) => !branchItem.isDeleted && branchItem.isActive,
  );

  const fetchBranches = useCallback(
    ({ direction = "next", cursorId = "" } = {}) =>
      allBranch({ direction, cursorId, search: searchTerm }),
    [allBranch, searchTerm],
  );

  const {
    currentPage,
    canGoNext,
    canGoPrevious,
    handleNext,
    handlePrevious,
    resetToFirstPage,
  } = usePaginationController({
    featureKey: FEATURE_KEY,
    isLoading: loading,
    hasNextPage,
    hasPreviousPage,
    firstId: branchFirstId,
    lastId: branchLastId,
    onFetch: fetchBranches,
  });

  const handleOpenChange = (open) => {
    setIsOpen(open);
    if (!open) return;
    setSearchTerm("");
    resetToFirstPage();
    allBranch();
  };

  // Debounced by SearchInput. Every new term restarts from page 1.
  const handleSearch = (term) => {
    setSearchTerm(term);
    resetToFirstPage();
    allBranch({ search: term });
  };

  const handleSelect = (branchItem) => {
    onSelect?.({ branch_id: branchItem.id, name: branchItem.name });
  };

  const keepTypingInInput = (event) => {
    if (event.key.length === 1) event.stopPropagation();
  };

  const showInitialLoading = loading && visibleBranches.length === 0;

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <Button
          type="button"
          variant="outline"
          className="flex h-11 w-full items-center justify-between px-3 font-normal"
        >
          <span
            className={selectedName ? "capitalize" : "text-muted-foreground"}
          >
            {selectedName || placeholder}
          </span>
          <ChevronDown
            size={20}
            className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[calc(100vw-2rem)] sm:w-80"
        align="start"
      >
        <div className="px-2 pt-2">
          <SearchInput
            placeholder="Search branch..."
            onSearch={handleSearch}
            onKeyDown={keepTypingInInput}
            disabled={disabled}
          />
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuGroup className="max-h-64 overflow-y-auto">
          {showInitialLoading ? (
            <div className="flex items-center justify-center gap-2 px-2 py-4 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading branches…
            </div>
          ) : visibleBranches.length > 0 ? (
            visibleBranches.map((branchItem) => (
              <DropdownMenuItem
                key={branchItem.id}
                onClick={() => handleSelect(branchItem)}
                className="cursor-pointer"
                data-active={selectedId === branchItem.id}
              >
                <div className="flex flex-col">
                  <span className="capitalize">{branchItem.name}</span>
                  {branchItem.code ? (
                    <span className="text-xs text-muted-foreground">
                      {branchItem.code}
                    </span>
                  ) : null}
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="px-2 py-4 text-center text-sm text-muted-foreground">
              {searchTerm
                ? `No branches match "${searchTerm}".`
                : "No branches found"}
            </div>
          )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <Pagination
          compact
          currentPage={currentPage}
          hasPreviousPage={canGoPrevious}
          hasNextPage={canGoNext}
          onPrev={handlePrevious}
          onNext={handleNext}
          disabled={loading}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BranchDropDown;
