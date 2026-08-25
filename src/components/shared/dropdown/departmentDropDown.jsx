"use client";

import { useState } from "react";
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

const departmentData = [
  { id: 1, name: "Management", code: "Man" },
  { id: 2, name: "Engineer", code: "Eng" },
  { id: 3, name: "Back Office", code: "BOF" },
  //   { id: 4, name: "PNB", code: "PNB" },
  //   { id: 5, name: "Axis Bank", code: "AXIS" },
  //   { id: 6, name: "Bank of Baroda", code: "BOB" },
  //   { id: 7, name: "Kotak Mahindra Bank", code: "KOTAK" },
  //   { id: 8, name: "Canara Bank", code: "CNRB" },
  //   { id: 9, name: "Union Bank of India", code: "UBIN" },
  //   { id: 10, name: "IndusInd Bank", code: "INDB" },
];

const ITEMS_PER_PAGE = 5;

const DepartmentDropDown = ({ value, onSelect, disabled = false }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  // Filter banks based on search
  const filteredBanks = departmentData.filter(
    (bank) =>
      bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bank.code.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredBanks.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentBanks = filteredBanks.slice(startIndex, endIndex);

  const handleSelectBank = (bank) => {
    onSelect?.(bank);
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <DropdownMenu onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild disabled={disabled}>
        {/* <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className="h-11 w-full justify-start font-normal"
        >
          {value || "Select Department"}
        </Button> */}
        <Button
          type="button"
          variant="outline"
          className="flex h-11 w-full items-center justify-between px-3 font-normal"
        >
          <span>{value || "Select Department"}</span>
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[calc(100vw-2rem)] sm:w-80"
        align="start"
      >
        {/* Search Bar */}
        <div className="relative px-2 pt-2">
          <Search className="absolute left-4 top-4 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search department..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-8"
          />
        </div>

        <DropdownMenuSeparator />

        {/* Bank Items */}
        <DropdownMenuGroup className="max-h-64 overflow-y-auto">
          {currentBanks.length > 0 ? (
            currentBanks.map((bank) => (
              <DropdownMenuItem
                key={bank.id}
                onClick={() => handleSelectBank(bank.name)}
                className="cursor-pointer"
                data-active={value === bank.name}
              >
                <div className="flex flex-col">
                  <span>{bank.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {bank.code}
                  </span>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="px-2 py-4 text-sm text-muted-foreground text-center">
              No banks found
            </div>
          )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Footer with Previous/Next buttons */}
        <div className="flex items-center justify-between px-2 py-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrevPage}
            disabled={currentPage === 1 || filteredBanks.length === 0}
            className="h-8 px-2"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            {filteredBanks.length > 0
              ? `${startIndex + 1}-${Math.min(endIndex, filteredBanks.length)} of ${filteredBanks.length}`
              : "0 items"}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === totalPages || filteredBanks.length === 0}
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

export default DepartmentDropDown;
