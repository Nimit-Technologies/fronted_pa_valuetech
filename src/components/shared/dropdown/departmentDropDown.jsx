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
import useAllDepartment from "@/features/superAdmin/hooks/department/useAllDepartment";
import { usePaginationController } from "@/hooks/pagination/usePaginationController";

const FEATURE_KEY = "department-dropdown";

const DepartmentDropDown = ({
  value,
  onSelect,
  disabled = false,
  placeholder = "Select Department",
}) => {
  const {
    allDepartment,
    departmentData,
    departmentFirstId,
    departmentLastId,
    hasNextPage,
    hasPreviousPage,
    loading,
  } = useAllDepartment();

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const isObjectValue = typeof value === "object" && value !== null;
  const selectedId = isObjectValue
    ? (value.id ?? value.department_id ?? "")
    : (value ?? "");
  // Older callers pass the department *name* as a plain string; when no
  // loaded row matches it as an id, show the string itself.
  const rawName = isObjectValue
    ? value.name
    : (departmentData.find((item) => item.id === selectedId)?.name ?? value);
  const selectedName = typeof rawName === "string" ? rawName : "";

  // Only live, active departments are assignable. The list API also returns
  // soft-deleted and inactive rows, so hide those here.
  const visibleDepartments = departmentData.filter(
    (item) => !item.is_deleted && item.is_active,
  );

  // Paging keeps the current search so page 2 of "eng" is still "eng".
  const fetchDepartments = useCallback(
    ({ direction = "next", cursorId = "" } = {}) =>
      allDepartment({ direction, cursorId, search: searchTerm }),
    [allDepartment, searchTerm],
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
    firstId: departmentFirstId,
    lastId: departmentLastId,
    onFetch: fetchDepartments,
  });

  const handleOpenChange = (open) => {
    setIsOpen(open);
    if (!open) return;
    setSearchTerm("");
    resetToFirstPage();
    allDepartment();
  };

  // Debounced by SearchInput. Every new term restarts from page 1.
  const handleSearch = (term) => {
    setSearchTerm(term);
    resetToFirstPage();
    allDepartment({ search: term });
  };

  const handleSelect = (item) => {
    onSelect?.({
      id: item.id,
      name: item.name,
      branch_id: item.branch_id ?? item.branch?.id ?? "",
    });
  };

  const keepTypingInInput = (event) => {
    if (event.key.length === 1) event.stopPropagation();
  };

  const showInitialLoading = loading && visibleDepartments.length === 0;

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
            placeholder="Search department..."
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
              Loading departments…
            </div>
          ) : visibleDepartments.length > 0 ? (
            visibleDepartments.map((item) => (
              <DropdownMenuItem
                key={item.id}
                onClick={() => handleSelect(item)}
                className="cursor-pointer"
                data-active={selectedId === item.id}
              >
                <div className="flex flex-col">
                  <span className="capitalize">{item.name}</span>
                  {item.branch?.name ? (
                    <span className="text-xs capitalize text-muted-foreground">
                      {item.branch.name}
                    </span>
                  ) : null}
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="px-2 py-4 text-center text-sm text-muted-foreground">
              {searchTerm
                ? `No departments match "${searchTerm}".`
                : "No departments found"}
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

export default DepartmentDropDown;
