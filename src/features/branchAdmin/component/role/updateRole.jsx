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

import { departmentData } from "@/features/branchAdmin/data/role/roleTable";

const UpdateRole = ({
  roleId,

  defaultRoleName = "Frontend Engineer",

  // Engineering department
  defaultDepartment = "2",

  // Active status
  defaultStatus = true,
}) => {
  const [roleName, setRoleName] = useState(defaultRoleName);

  const [department, setDepartment] = useState(
    defaultDepartment?.toString() || "",
  );

  const [status, setStatus] = useState(defaultStatus ? "active" : "inactive");

  const [open, setOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const selectedDepartment = departmentData.data.find(
      (dept) => dept.id === department,
    );

    console.log({
      roleId,

      roleName,

      departmentId: department,

      departmentName: selectedDepartment?.name,

      status,
    });

    setOpen(false);
  };

  const handleCancel = () => {
    setRoleName(defaultRoleName);

    setDepartment(defaultDepartment?.toString() || "");

    setStatus(defaultStatus ? "active" : "inactive");

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
          <PopoverTitle>Update Role</PopoverTitle>

          <PopoverDescription>Update role details below.</PopoverDescription>
        </PopoverHeader>

        <form
          onSubmit={handleSubmit}

          className="mt-5 space-y-5"
        >
          {/* Role Name */}

          <div className="flex flex-col gap-2 w-full">
            <Label>Role Name</Label>

            <Input
              value={roleName}

              onChange={(e) => setRoleName(e.target.value)}

              placeholder="Enter Role Name"

              className="w-full"
            />
          </div>

          {/* Department */}

          <div className="flex flex-col gap-2 w-full">
            <Label>Department</Label>

            <Select
              value={department}

              onValueChange={setDepartment}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {departmentData.data

                  .filter((dept) => dept.is_active)

                  .map((dept) => (
                    <SelectItem
                      key={dept.id}

                      value={dept.id.toString()}
                    >
                      {dept.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}

          <div className="flex flex-col gap-2 w-full">
            <Label>Status</Label>

            <Select
              value={status}

              onValueChange={setStatus}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="active">Active</SelectItem>

                <SelectItem value="inactive">Inactive</SelectItem>
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

            <Button type="submit">Update</Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default UpdateRole;
