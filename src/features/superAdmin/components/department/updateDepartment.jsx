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
import BranchDropDown from "@/components/shared/dropdown/branchDropdown";
import useUpdateDepartment from "../../hooks/department/useUpdateDepartment";

const EMPTY_BRANCH = { branch_id: "", name: "" };

const UpdateDepartment = ({
  defaultName = "",
  departmentId,
  defaultStatus = true,
  // Current parent branch as { branch_id, name }; pre-selects the dropdown.
  defaultBranch = EMPTY_BRANCH,
  onUpdated,
}) => {
  const { Update } = useUpdateDepartment();
  const [departmentName, setDepartmentName] = useState(defaultName);
  const [status, setStatus] = useState(defaultStatus ? "true" : "false");
  const [branch, setBranch] = useState(defaultBranch);
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!departmentName.trim() || !branch.branch_id) return;

    const data = {
      id: departmentId,
      name: departmentName.trim(),
      is_active: status === "true",
    };
    // Only send branch_id when the user actually moved the department, so an
    // unchanged branch never trips the backend's duplicate-name or
    // branch-existence checks.
    if (branch.branch_id !== defaultBranch.branch_id) {
      data.branch_id = branch.branch_id;
    }

    try {
      await Update({ data });
    } catch (err) {
      console.error("Failed to update department:", err);
      return;
    }
    onUpdated?.();
    setOpen(false);
  };

  const resetToDefaults = () => {
    setDepartmentName(defaultName);
    setStatus(defaultStatus ? "true" : "false");
    setBranch(defaultBranch);
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
            Update Department
          </PopoverTitle>
          <PopoverDescription className="text-sm text-muted-foreground">
            Edit the name, branch or status of the department.
          </PopoverDescription>
        </PopoverHeader>
        <form onSubmit={handleSubmit} className="mt-4 grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="departmentName" className="text-foreground">
              Department Name
            </Label>
            <Input
              id="departmentName"
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              placeholder="e.g. Engineering"
              className="h-9 bg-background border-border text-foreground placeholder:text-muted-foreground"
              required
            />
          </div>
          <div className="grid gap-1.5">
            <Label className="text-foreground">Branch</Label>
            <BranchDropDown value={branch} onSelect={setBranch} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="departmentStatus" className="text-foreground">
              Status
            </Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="departmentStatus" className="h-9 w-full">
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

export default UpdateDepartment;
