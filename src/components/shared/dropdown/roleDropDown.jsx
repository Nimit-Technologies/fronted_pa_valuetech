"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
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
import useAllRole from "@/features/superAdmin/hooks/role/useAllRole";

const ITEMS_PER_PAGE = 5;

const RoleDropDown = ({ value, onSelect, disabled = false }) => {
  const role = useSelector((state) => state.role);
  const roleData = role.roleData || [];
  const { allRole } = useAllRole();

  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const selectedRoleName = typeof value === "object" ? value?.name : value;

  const filteredRoles = roleData.filter(
    (roleItem) =>
      roleItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (roleItem.code || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const fetchRoles = async ({ direction = "next", cursorId = "" } = {}) => {
    await allRole({ direction, cursorId, dataLimit: ITEMS_PER_PAGE });
  };

  useEffect(() => {
    if (!isOpen || roleData.length > 0) return;
    fetchRoles();
  }, [isOpen, roleData.length]);

  const handleSelectRole = (roleItem) => {
    onSelect?.(roleItem);
    setSearchTerm("");
  };

  const handleNextPage = async () => {
    if (!role.hasNextPage) return;
    await fetchRoles({ direction: "next", cursorId: role.roleLastId });
  };

  const handlePrevPage = async () => {
    if (!role.hasPreviousPage) return;
    await fetchRoles({ direction: "previous", cursorId: role.roleFirstId });
  };

  return (
    <DropdownMenu onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <Button
          type="button"
          variant="outline"
          className="flex h-11 w-full items-center justify-between px-3 font-normal"
        >
          <span>{selectedRoleName || "Select Role"}</span>
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
            placeholder="Search role..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
            className="pl-8"
          />
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuGroup className="max-h-64 overflow-y-auto">
          {filteredRoles.length > 0 ? (
            filteredRoles.map((roleItem) => (
              <DropdownMenuItem
                key={roleItem.id}
                onClick={() => handleSelectRole(roleItem)}
                className="cursor-pointer"
                data-active={selectedRoleName === roleItem.name}
              >
                <div className="flex flex-col">
                  <span>{roleItem.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {roleItem.code || roleItem.name}
                  </span>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="px-2 py-4 text-center text-sm text-muted-foreground">
              No roles found
            </div>
          )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <div className="flex items-center justify-between px-2 py-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrevPage}
            disabled={!role.hasPreviousPage || filteredRoles.length === 0}
            className="h-8 px-2"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            {filteredRoles.length > 0
              ? `${Math.min(1, filteredRoles.length)}-${filteredRoles.length} of ${role.roleLength || filteredRoles.length}`
              : "0 items"}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNextPage}
            disabled={!role.hasNextPage || filteredRoles.length === 0}
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

export default RoleDropDown;
