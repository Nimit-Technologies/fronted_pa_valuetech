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
import useAllBusiness from "@/features/superAdmin/hooks/business/useAllBusiness";
import { usePaginationController } from "@/hooks/pagination/usePaginationController";

const FEATURE_KEY = "business-type-dropdown";

// Stable reference for the no-branch case, so the empty list is not a fresh
// array identity on every render.
const NO_BUSINESS_TYPES = [];

// `branchId` scopes the list, and is not optional in practice: business types
// are unique per branch, and the user create/update endpoints look the chosen
// type up *within* the selected branch, so one from another branch comes back
// as "not found". It is sent to the API, which narrows the query itself.
//
// The local branch filter below is a safety net for a response that was not
// narrowed (an older backend, or a cached slice still holding another branch's
// page) — the slice is shared with the business management screen.
//
// Unlike the branch and role lists, this endpoint takes no `search` param, so
// the name filter is applied to the loaded page only.
const BusinessTypeDropDown = ({
  value,
  onSelect,
  branchId = "",
  disabled = false,
  placeholder = "Select Business Type",
}) => {
  const {
    allBusiness,
    businessData,
    businessFirstId,
    businessLastId,
    hasNextPage,
    hasPreviousPage,
    loading,
  } = useAllBusiness();

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const isObjectValue = typeof value === "object" && value !== null;
  const selectedId = isObjectValue
    ? (value.business_type_id ?? value.id ?? "")
    : (value ?? "");
  const selectedName = isObjectValue
    ? value.name
    : businessData.find((item) => item.id === selectedId)?.name;

  const term = searchTerm.trim().toLowerCase();
  // Only live, active types are assignable, and only ones in the selected
  // branch. With no branch chosen the list is empty by design rather than
  // showing types the backend would refuse — tested before the filter so an
  // unpicked branch does not walk the array only to produce nothing.
  const visibleBusinessTypes = branchId
    ? businessData.filter(
        (item) =>
          !item.isDeleted &&
          item.isActive &&
          item.branchId === branchId &&
          (!term || item.name.toLowerCase().includes(term)),
      )
    : NO_BUSINESS_TYPES;

  const fetchBusinessTypes = useCallback(
    ({ direction = "next", cursorId = "" } = {}) =>
      allBusiness({ direction, cursorId, branchId }),
    [allBusiness, branchId],
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
    firstId: businessFirstId,
    lastId: businessLastId,
    onFetch: fetchBusinessTypes,
  });

  // Reloads on every open rather than on mount: the branch can change between
  // opens, and the shared slice may be holding another screen's page.
  const handleOpenChange = (open) => {
    setIsOpen(open);
    if (!open) return;
    setSearchTerm("");
    resetToFirstPage();
    if (branchId) allBusiness({ branchId });
  };

  const handleSelect = (item) => {
    onSelect?.({ business_type_id: item.id, name: item.name });
  };

  const keepTypingInInput = (event) => {
    if (event.key.length === 1) event.stopPropagation();
  };

  // Coerced rather than relying on `branchId &&`, which would make this the
  // empty string when no branch is picked.
  const showInitialLoading =
    Boolean(branchId) && loading && businessData.length === 0;

  const emptyMessage = !branchId
    ? "Select a branch first."
    : term
      ? `No business types match "${term}" on this page.`
      : "This branch has no business types yet.";

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
      {/* Deliberately not disabled when no branch is picked: a dead button
          looks broken, so it opens and says what to do instead. */}
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
            placeholder="Search business type..."
            onSearch={setSearchTerm}
            onKeyDown={keepTypingInInput}
            disabled={disabled}
          />
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuGroup className="max-h-64 overflow-y-auto">
          {showInitialLoading ? (
            <div className="flex items-center justify-center gap-2 px-2 py-4 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading business types…
            </div>
          ) : visibleBusinessTypes.length > 0 ? (
            visibleBusinessTypes.map((item) => (
              <DropdownMenuItem
                key={item.id}
                onClick={() => handleSelect(item)}
                className="cursor-pointer"
                data-active={selectedId === item.id}
              >
                <span className="capitalize">{item.name}</span>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="px-2 py-4 text-center text-sm text-muted-foreground">
              {emptyMessage}
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

export default BusinessTypeDropDown;
