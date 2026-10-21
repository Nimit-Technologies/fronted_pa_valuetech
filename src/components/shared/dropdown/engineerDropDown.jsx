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
import useGetAllEngineer from "@/features/user/hooks/useGetAllEngineer";
import { usePaginationController } from "@/hooks/pagination/usePaginationController";

const FEATURE_KEY = "engineer-dropdown";

const getEngineerName = (engineer) =>
  `${engineer.first_name ?? ""} ${engineer.last_name ?? ""}`.trim() ||
  engineer.employee_id ||
  "";

const EngineerDropDown = ({
  value,
  onSelect,
  disabled = false,
  placeholder = "Select Engineer",
}) => {
  const {
    getAllEngineer,
    engineers,
    loading,
    error,
    hasNextPage,
    hasPreviousPage,
    engineerFirstId,
    engineerLastId,
  } = useGetAllEngineer();

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const isObjectValue = typeof value === "object" && value !== null;
  const selectedId = isObjectValue
    ? (value.engineer_id ?? value.id ?? value.employee_id ?? "")
    : (value ?? "");
  const matchedEngineer = engineers.find(
    (engineer) =>
      engineer.id === selectedId || engineer.employee_id === selectedId,
  );
  const selectedName = isObjectValue
    ? value.name || getEngineerName(value) || value.employee_id
    : matchedEngineer
      ? getEngineerName(matchedEngineer)
      : value;

  const fetchEngineers = useCallback(
    ({ direction = "next", cursorId = "" } = {}) =>
      getAllEngineer({ direction, cursorId, search: searchTerm }),
    [getAllEngineer, searchTerm],
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
    firstId: engineerFirstId,
    lastId: engineerLastId,
    onFetch: fetchEngineers,
  });

  const handleOpenChange = (open) => {
    setIsOpen(open);
    if (!open) return;
    const needsFirstPage = searchTerm || currentPage > 1 || Boolean(error);
    setSearchTerm("");
    resetToFirstPage();
    if (needsFirstPage) getAllEngineer();
  };

  // Debounced by SearchInput. Every new term restarts from page 1.
  const handleSearch = (term) => {
    setSearchTerm(term);
    resetToFirstPage();
    getAllEngineer({ search: term });
  };

  const handleSelect = (engineer) => {
    onSelect?.({
      engineer_id: engineer.id,
      employee_id: engineer.employee_id,
      name: getEngineerName(engineer),
      phone: engineer.phone,
    });
  };

  const keepTypingInInput = (event) => {
    if (event.key.length === 1) event.stopPropagation();
  };

  const showInitialLoading = loading && engineers.length === 0;

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
            value={searchTerm}
            onValueChange={setSearchTerm}
            placeholder="Search engineer..."
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
              Loading engineers…
            </div>
          ) : error ? (
            <div
              role="alert"
              className="px-2 py-4 text-center text-sm text-destructive"
            >
              {error}
            </div>
          ) : engineers.length > 0 ? (
            engineers.map((engineer) => (
              <DropdownMenuItem
                key={engineer.id}
                onClick={() => handleSelect(engineer)}
                className="cursor-pointer"
                data-active={
                  selectedId === engineer.id ||
                  selectedId === engineer.employee_id
                }
              >
                <div className="flex flex-col">
                  <span className="capitalize">
                    {getEngineerName(engineer)}
                  </span>
                  {engineer.employee_id ? (
                    <span className="text-xs text-muted-foreground">
                      {engineer.employee_id}
                    </span>
                  ) : null}
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="px-2 py-4 text-center text-sm text-muted-foreground">
              {searchTerm
                ? `No engineers match "${searchTerm}".`
                : "No engineers found"}
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
          disabled={loading || Boolean(error)}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default EngineerDropDown;
