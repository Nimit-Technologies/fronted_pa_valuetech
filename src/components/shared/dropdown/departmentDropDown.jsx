"use client";

import { useCallback, useEffect, useState } from "react";
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
import useAllDepartment from "@/features/superAdmin/hooks/department/useAllDepartment";

const ITEMS_PER_PAGE = 5;

const DepartmentDropDown = ({ value, onSelect, disabled = false }) => {
  const department = useSelector((state) => state.department);
  const departmentData = department.departmentData || [];
  const { allDepartment } = useAllDepartment();

  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const selectedDepartmentName =
    typeof value === "object" ? value?.name : value;

  const filteredDepartments = departmentData.filter(
    (departmentItem) =>
      departmentItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (departmentItem.code || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  const fetchDepartments = useCallback(
    async ({ direction = "next", cursorId = "" } = {}) => {
      await allDepartment({ direction, cursorId, dataLimit: ITEMS_PER_PAGE });
    },
    [allDepartment],
  );

  useEffect(() => {
    if (!isOpen || departmentData.length > 0) return;
    fetchDepartments();
  }, [isOpen, departmentData.length, fetchDepartments]);

  const handleSelectDepartment = (departmentItem) => {
    onSelect?.(departmentItem);
    setSearchTerm("");
  };

  const handleNextPage = async () => {
    if (!department.hasNextPage) return;
    await fetchDepartments({
      direction: "next",
      cursorId: department.departmentLastId,
    });
  };

  const handlePrevPage = async () => {
    if (!department.hasPreviousPage) return;
    await fetchDepartments({
      direction: "previous",
      cursorId: department.departmentFirstId,
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
          <span>{selectedDepartmentName || "Select Department"}</span>
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
            placeholder="Search department..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
            className="pl-8"
          />
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuGroup className="max-h-64 overflow-y-auto">
          {filteredDepartments.length > 0 ? (
            filteredDepartments.map((departmentItem) => (
              <DropdownMenuItem
                key={departmentItem.id}
                onClick={() => handleSelectDepartment(departmentItem)}
                className="cursor-pointer"
                data-active={selectedDepartmentName === departmentItem.name}
              >
                <div className="flex flex-col">
                  <span>{departmentItem.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {departmentItem.code || departmentItem.name}
                  </span>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="px-2 py-4 text-center text-sm text-muted-foreground">
              No departments found
            </div>
          )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <div className="flex items-center justify-between px-2 py-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrevPage}
            disabled={
              !department.hasPreviousPage || filteredDepartments.length === 0
            }
            className="h-8 px-2"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            {filteredDepartments.length > 0
              ? `${Math.min(1, filteredDepartments.length)}-${filteredDepartments.length} of ${department.departmentLength || filteredDepartments.length}`
              : "0 items"}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNextPage}
            disabled={
              !department.hasNextPage || filteredDepartments.length === 0
            }
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
