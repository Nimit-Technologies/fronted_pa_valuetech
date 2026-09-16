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
import DepartmentDropDown from "@/components/shared/dropdown/departmentDropDown";
import useUpdateRole from "../../hooks/role/useUpdateRole";

const EMPTY_DEPARTMENT = { id: "", name: "" };

const UpdateRole = ({
  defaultName = "",
  roleId,
  defaultStatus = true,
  // Current parent department as { id, name }; pre-selects the dropdown.
  defaultDepartment = EMPTY_DEPARTMENT,
  onUpdated,
}) => {
  const { Update } = useUpdateRole();
  const [roleName, setRoleName] = useState(defaultName);
  const [status, setStatus] = useState(defaultStatus ? "true" : "false");
  const [department, setDepartment] = useState(defaultDepartment);
  const [open, setOpen] = useState(false);

  const handleDepartmentSelect = (selected) => {
    setDepartment({ id: selected?.id ?? "", name: selected?.name ?? "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roleName.trim() || !department.id) return;

    const data = {
      id: roleId,
      name: roleName.trim(),
      is_active: status === "true",
    };
    // Only send department_id when the user actually moved the role, so an
    // unchanged department never trips the backend's duplicate-name or
    // department-existence checks. The branch follows the department.
    if (department.id !== defaultDepartment.id) {
      data.department_id = department.id;
    }

    try {
      await Update({ data });
    } catch (err) {
      console.error("Failed to update role:", err);
      return;
    }
    onUpdated?.();
    setOpen(false);
  };

  const resetToDefaults = () => {
    setRoleName(defaultName);
    setStatus(defaultStatus ? "true" : "false");
    setDepartment(defaultDepartment);
  };

  const handleCancel = () => {
    resetToDefaults();
    setOpen(false);
  };

  // Re-seed the form from props every time the popover opens, so a row whose
  // data changed since mount (after a reload or re-sort) shows current values.
  const handleOpenChange = (next) => {
    if (next) resetToDefaults();
    setOpen(next);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <Pencil size={14} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <PopoverHeader>
          <PopoverTitle className="text-base font-semibold text-foreground">
            Update Role
          </PopoverTitle>
          <PopoverDescription className="text-sm text-muted-foreground">
            Edit the name, department or status of the role.
          </PopoverDescription>
        </PopoverHeader>
        <form onSubmit={handleSubmit} className="mt-4 grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="roleName" className="text-foreground">
              Role Name
            </Label>
            <Input
              id="roleName"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="e.g. Frontend Engineer"
              className="h-9 bg-background border-border text-foreground placeholder:text-muted-foreground"
              required
            />
          </div>
          <div className="grid gap-1.5">
            <Label className="text-foreground">Department</Label>
            <DepartmentDropDown
              value={department}
              onSelect={handleDepartmentSelect}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="roleStatus" className="text-foreground">
              Status
            </Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="roleStatus" className="h-9 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">In Active</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Update
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default UpdateRole;
