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

import { Plus } from "lucide-react";

import { departmentData } from "../../data/role/roleTable";

const CreateRole = () => {
  const [roleName, setRoleName] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!roleName.trim() || !department || !status) return;

    const selectedDepartment = departmentData.data.find(
      (dept) => dept.id === department,
    );

    console.log({
      roleName,
      departmentId: department,
      departmentName: selectedDepartment?.name,
      status,
    });

    // Reset Form
    setRoleName("");
    setDepartment("");
    setStatus("");
    setOpen(false);
  };

  const handleCancel = () => {
    setRoleName("");
    setDepartment("");
    setStatus("");
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button className="gap-2">
          <Plus size={16} />
          Create Role
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-[360px] p-5">
        <PopoverHeader className="px-0 pt-0">
          <PopoverTitle>Create Role</PopoverTitle>

          <PopoverDescription>Enter role details below.</PopoverDescription>
        </PopoverHeader>

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          {/* Role Name */}
          <div className="flex flex-col gap-2 w-full">
            <Label htmlFor="roleName">Role Name</Label>

            <Input
              id="roleName"
              placeholder="Enter Role Name"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Department */}
          <div className="flex flex-col gap-2 w-full">
            <Label htmlFor="department">Department</Label>

            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger id="department" className="w-full">
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>

              <SelectContent
                position="popper"
                side="bottom"
                align="start"
                sideOffset={6}
                className="w-[--radix-select-trigger-width]"
              >
                {departmentData.data
                  .filter((dept) => dept.is_active)
                  .map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="flex flex-col gap-2 w-full">
            <Label htmlFor="status">Status</Label>

            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status" className="w-full">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>

              <SelectContent
                position="popper"
                side="bottom"
                align="start"
                sideOffset={6}
                className="w-[--radix-select-trigger-width]"
              >
                <SelectItem value="active">Active</SelectItem>

                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>

            <Button type="submit">Create Role</Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default CreateRole;
