import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Pagination from "@/components/shared/pagination";
import useAllBanks from "@/features/individualCoordinator/hooks/bank/useAllBanks";

// Picks the bank a case is filed under, from the branch's real banks.
//
// Distinct from components/shared/dropdown/bankDropDown, which lists ten
// hardcoded bank names and hands back a string — fine for the screens still on
// mock data, useless here, where the create needs a bank_id and the case's
// branch is derived from the bank.
//
// The list endpoint pages at DATA_LIMIT and has no server-side search, so the
// filter box narrows the loaded page and paging walks the rest.
const BankSelect = ({ value, onSelect, disabled = false }) => {
  const {
    banks,
    loading,
    error,
    hasNextPage,
    hasPreviousPage,
    next,
    previous,
  } = useAllBanks();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const visible = useMemo(() => {
    const term = filter.trim().toLowerCase();
    if (!term) return banks;
    return banks.filter((bank) =>
      [bank.display_name, bank.name, bank.bank_branch, bank.bank_branch_code]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(term)),
    );
  }, [banks, filter]);

  const label = value
    ? value.display_name || value.name || "Select Bank"
    : "Select Bank";

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className="flex h-11 w-full items-center justify-between px-3 font-normal"
        >
          <span className="truncate capitalize">{label}</span>
          {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[calc(100vw-2rem)] sm:w-80"
        align="start"
      >
        <div className="relative px-2 pt-2">
          <Search className="absolute left-4 top-4 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter this page..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="pl-8"
          />
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuGroup className="max-h-64 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center gap-2 px-2 py-6 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading banks…
            </div>
          ) : error ? (
            <div className="px-2 py-4 text-center text-sm text-destructive">
              {error}
            </div>
          ) : visible.length === 0 ? (
            <div className="px-2 py-4 text-center text-sm text-muted-foreground">
              {banks.length === 0
                ? "No banks in your branch"
                : "No banks match"}
            </div>
          ) : (
            visible.map((bank) => (
              <DropdownMenuItem
                key={bank.id}
                onClick={() => onSelect?.(bank)}
                className="cursor-pointer"
                data-active={value?.id === bank.id}
              >
                <div className="flex flex-col">
                  <span className="capitalize">
                    {bank.display_name || bank.name}
                  </span>
                  <span className="text-xs text-muted-foreground capitalize">
                    {[bank.bank_branch, bank.bank_branch_code]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuGroup>

        {hasNextPage || hasPreviousPage ? (
          <>
            <DropdownMenuSeparator />
            <Pagination
              compact
              className="px-0"
              currentPage={pageNumber}
              hasPreviousPage={hasPreviousPage && !loading}
              hasNextPage={hasNextPage && !loading}
              onPrev={() => {
                setPageNumber((page) => Math.max(1, page - 1));
                setFilter("");
                previous();
              }}
              onNext={() => {
                setPageNumber((page) => page + 1);
                setFilter("");
                next();
              }}
            />
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BankSelect;
