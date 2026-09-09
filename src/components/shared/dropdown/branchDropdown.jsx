"use client";

import { useEffect, useState } from "react";
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
import {
  ChevronLeft,
  ChevronRight,
  Search,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useSelector } from "react-redux";
import useAllBranch from "@/features/superAdmin/hooks/branch/useAllBranch";

const ITEMS_PER_PAGE = 5;

const BranchDropDown = ({ value, onSelect, disabled = false }) => {
  const branch = useSelector((state) => state.branch);
  const branchData = branch.branchData || [];
  const { allBranch } = useAllBranch();

  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const selectedBranchName = typeof value === "object" ? value?.name : value;

  const filteredBranches = branchData.filter(
    (branchItem) =>
      branchItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (branchItem.code || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const fetchBranches = async ({ direction = "next", cursorId = "" } = {}) => {
    await allBranch({ direction, cursorId, dataLimit: ITEMS_PER_PAGE });
  };

  useEffect(() => {
    if (!isOpen || branchData.length > 0) return;
    fetchBranches();
  }, [isOpen, branchData.length]);

  const handleSelectBranch = (branchItem) => {
    onSelect?.(branchItem);
    setSearchTerm("");
  };

  const handleNextPage = async () => {
    if (!branch.hashNextPage) return;
    await fetchBranches({ direction: "next", cursorId: branch.branchLastId });
  };

  const handlePrevPage = async () => {
    if (!branch.hashPreviousPage) return;
    await fetchBranches({
      direction: "previous",
      cursorId: branch.branchFirstId,
    });
  };

  return (
    <DropdownMenu onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <Button
          type="button"
          variant="outline"
          className="flex h-11 w-full items-center justify-between px-3 font-normal"
        >
          <span>{selectedBranchName || "Select Branch"}</span>
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[calc(100vw-2rem)] sm:w-80"
        align="start"
      >
        <div className="relative px-2 pt-2">
          <Search className="absolute left-4 top-4 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search branch..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
            className="pl-8"
          />
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuGroup className="max-h-64 overflow-y-auto">
          {filteredBranches.length > 0 ? (
            filteredBranches.map((branchItem) => (
              <DropdownMenuItem
                key={branchItem.id}
                onClick={() => handleSelectBranch(branchItem)}
                className="cursor-pointer"
                data-active={selectedBranchName === branchItem.name}
              >
                <div className="flex flex-col">
                  <span>{branchItem.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {branchItem.code || branchItem.name}
                  </span>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="px-2 py-4 text-center text-sm text-muted-foreground">
              No branches found
            </div>
          )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <div className="flex items-center justify-between px-2 py-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrevPage}
            disabled={!branch.hashPreviousPage || filteredBranches.length === 0}
            className="h-8 px-2"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            {filteredBranches.length > 0
              ? `${Math.min(1, filteredBranches.length)}-${filteredBranches.length} of ${branch.branchLength || filteredBranches.length}`
              : "0 items"}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNextPage}
            disabled={!branch.hashNextPage || filteredBranches.length === 0}
            className="h-8 px-2"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BranchDropDown;
