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
import { Plus } from "lucide-react";
import DepartmentDropDown from "@/components/shared/dropdown/departmentDropDown";
import useCreateRole from "../../hooks/role/useCreateRole";

const EMPTY_DEPARTMENT = { id: "", name: "" };

const CreateRole = ({ onCreated, disabled = false }) => {
  const { Create } = useCreateRole();
  const [roleName, setRoleName] = useState("");
  const [department, setDepartment] = useState(EMPTY_DEPARTMENT);
  const [open, setOpen] = useState(false);

  const resetForm = () => {
    setRoleName("");
    setDepartment(EMPTY_DEPARTMENT);
  };

  // DepartmentDropDown hands back the raw department row; keep only what the
  // form needs so nothing else leaks into the request.
  const handleDepartmentSelect = (selected) => {
    setDepartment({ id: selected?.id ?? "", name: selected?.name ?? "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roleName.trim() || !department.id) return;

    try {
      // The branch is derived server-side from the department, so a role can
      // never point at a different branch than its department.
      await Create({ name: roleName.trim(), department_id: department.id });
    } catch (err) {
      console.error("Failed to create role:", err);
      return;
    }

    onCreated?.();
    resetForm();
    setOpen(false);
  };

  const handleOpenChange = (next) => {
    if (!next) resetForm();
    setOpen(next);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button className="gap-2 whitespace-nowrap" disabled={disabled}>
          <Plus size={16} />
          Create Role
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <PopoverHeader>
          <PopoverTitle className="text-base font-semibold text-foreground">
            Create Role
          </PopoverTitle>
          <PopoverDescription className="text-sm text-muted-foreground">
            Enter the name and department for the new role.
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
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => {
                resetForm();
                setOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Create
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default CreateRole;
