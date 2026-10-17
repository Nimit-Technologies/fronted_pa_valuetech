import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import BranchDropDown from "@/components/shared/dropdown/branchDropdown";
import useCreateDepartment from "../../hooks/department/useCreateDepartment";

const EMPTY_BRANCH = { branch_id: "", name: "" };

const CreateDepartment = ({ onCreated, disabled = false }) => {
  const { Create } = useCreateDepartment();
  const [departmentName, setDepartmentName] = useState("");
  const [branch, setBranch] = useState(EMPTY_BRANCH);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");

  const resetForm = () => {
    setDepartmentName("");
    setBranch(EMPTY_BRANCH);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!departmentName.trim() || !branch.branch_id) return;

    try {
      await Create({
        name: departmentName.trim(),
        branch_id: branch.branch_id,
      });
    } catch (err) {
      console.error("Failed to create department:", err);
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
          Create Department
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <PopoverHeader>
          <PopoverTitle className="text-base font-semibold text-foreground">
            Create Department
          </PopoverTitle>
          <PopoverDescription className="text-sm text-muted-foreground">
            Enter the name and branch for the new department.
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

export default CreateDepartment;
