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
import useAllRole from "@/features/superAdmin/hooks/role/useAllRole";
import { usePaginationController } from "@/hooks/pagination/usePaginationController";

const FEATURE_KEY = "role-dropdown";

const RoleDropDown = ({
  value,
  onSelect,
  disabled = false,
  placeholder = "Select Role",
}) => {
  const {
    allRole,
    roleData,
    roleFirstId,
    roleLastId,
    hasNextPage,
    hasPreviousPage,
    loading,
  } = useAllRole();

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const isObjectValue = typeof value === "object" && value !== null;
  const selectedId = isObjectValue
    ? (value.id ?? value.role_id ?? "")
    : (value ?? "");
  // Older callers pass the role *name* as a plain string; when no loaded row
  // matches it as an id, show the string itself.
  const rawName = isObjectValue
    ? value.name
    : (roleData.find((item) => item.id === selectedId)?.name ?? value);
  const selectedName = typeof rawName === "string" ? rawName : "";

  // Only live, active roles are assignable. The list API already drops
  // soft-deleted roles; the is_deleted check keeps this correct if that
  // ever changes.
  const visibleRoles = roleData.filter(
    (item) => !item.is_deleted && item.is_active,
  );

  // Paging keeps the current search so page 2 of "eng" is still "eng".
  const fetchRoles = useCallback(
    ({ direction = "next", cursorId = "" } = {}) =>
      allRole({ direction, cursorId, search: searchTerm }),
    [allRole, searchTerm],
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
    firstId: roleFirstId,
    lastId: roleLastId,
    onFetch: fetchRoles,
  });

  const handleOpenChange = (open) => {
    setIsOpen(open);
    if (!open) return;
    setSearchTerm("");
    resetToFirstPage();
    allRole();
  };

  // Debounced by SearchInput. Every new term restarts from page 1.
  const handleSearch = (term) => {
    setSearchTerm(term);
    resetToFirstPage();
    allRole({ search: term });
  };

  const handleSelect = (item) => {
    onSelect?.({
      id: item.id,
      name: item.name,
      department_id: item.department_id ?? item.department?.id ?? "",
      branch_id: item.branch_id ?? item.branch?.id ?? "",
    });
  };

  const keepTypingInInput = (event) => {
    if (event.key.length === 1) event.stopPropagation();
  };

  const showInitialLoading = loading && visibleRoles.length === 0;

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
            placeholder="Search role..."
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
              Loading roles…
            </div>
          ) : visibleRoles.length > 0 ? (
            visibleRoles.map((item) => (
              <DropdownMenuItem
                key={item.id}
                onClick={() => handleSelect(item)}
                className="cursor-pointer"
                data-active={selectedId === item.id}
              >
                <div className="flex flex-col">
                  <span className="capitalize">{item.name}</span>
                  {item.department?.name ? (
                    <span className="text-xs capitalize text-muted-foreground">
                      {item.department.name}
                    </span>
                  ) : null}
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="px-2 py-4 text-center text-sm text-muted-foreground">
              {searchTerm
                ? `No roles match "${searchTerm}".`
                : "No roles found"}
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

export default RoleDropDown;
