import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Pencil } from "lucide-react";
import { departmentData } from "../../data/role/roleTable"; 

const UpdateRole = ({
  defaultName = "",
  defaultDepartment = "",
  roleId,
}) => {
  const [roleName, setRoleName] = useState(defaultName);
  const [department, setDepartment] = useState(defaultDepartment);
  const [open, setOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!roleName.trim() || !department) return;

    const selectedDepartment = departmentData.data.find(
      (dept) => dept.id === department
    );

    // TODO: API Integration
    console.log({
      roleId,
      roleName: roleName.trim(),
      departmentId: department,
      departmentName: selectedDepartment?.name,
    });

    setOpen(false);
  };

  const handleCancel = () => {
    setRoleName(defaultName);
    setDepartment(defaultDepartment);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Pencil size={14} />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-[360px] p-5"
      >
        <PopoverHeader className="px-0 pt-0">
          <PopoverTitle className="text-base font-semibold">
            Update Role
          </PopoverTitle>

          <PopoverDescription>
            Update the role details below.
          </PopoverDescription>
        </PopoverHeader>

        <form
          onSubmit={handleSubmit}
          className="mt-5 space-y-5"
        >
          {/* Role Name */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="roleName">
              Role Name
            </Label>

            <Input
              id="roleName"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="Enter Role Name"
              className="w-full h-10"
              required
            />
          </div>

          {/* Department */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="department">
              Department
            </Label>

            <Select
              value={department}
              onValueChange={setDepartment}
            >
              <SelectTrigger
                id="department"
                className="w-full h-10"
              >
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>

              <SelectContent
                position="popper"
                side="bottom"
                align="start"
                sideOffset={5}
                className="w-[--radix-select-trigger-width]"
              >
                {departmentData.data
                  .filter((dept) => dept.is_active)
                  .map((dept) => (
                    <SelectItem
                      key={dept.id}
                      value={dept.id}
                    >
                      {dept.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
            >
              Cancel
            </Button>

            <Button type="submit">
              Update
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default UpdateRole;