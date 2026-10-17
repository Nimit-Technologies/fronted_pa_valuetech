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
import useUpdateBusiness from "../../hooks/business/useUpdateBusiness";

const EMPTY_BRANCH = { branch_id: "", name: "" };

const UpdateBusiness = ({
  defaultName = "",
  businessId,
  defaultStatus = true,
  // Current parent branch as { branch_id, name }; pre-selects the dropdown.
  defaultBranch = EMPTY_BRANCH,
  onUpdated,
}) => {
  const { Update } = useUpdateBusiness();
  const [businessName, setBusinessName] = useState(defaultName);
  const [status, setStatus] = useState(defaultStatus ? "true" : "false");
  const [branch, setBranch] = useState(defaultBranch);
  const [open, setOpen] = useState(false);

  const handleBranchSelect = (selected) => {
    setBranch({
      branch_id: selected?.branch_id ?? "",
      name: selected?.name ?? "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!businessName.trim() || !branch.branch_id) return;

    const payload = {
      businessId,
      name: businessName.trim(),
      is_active: status === "true",
    };
    // Only send branch_id when the user actually moved the business type. The
    // update schema is strict and the name only has to be unique within the
    // branch the row ends up in, so an unchanged branch is left out entirely.
    if (branch.branch_id !== defaultBranch.branch_id) {
      payload.branch_id = branch.branch_id;
    }

    try {
      await Update(payload);
    } catch (err) {
      console.error("Failed to update business type:", err);
      return;
    }
    onUpdated?.();
    setOpen(false);
  };

  const resetToDefaults = () => {
    setBusinessName(defaultName);
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
            Update Business
          </PopoverTitle>
          <PopoverDescription className="text-sm text-muted-foreground">
            Edit the name, branch or status of the business type.
          </PopoverDescription>
        </PopoverHeader>
        <form onSubmit={handleSubmit} className="mt-4 grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="businessName" className="text-foreground">
              Business Name
            </Label>
            <Input
              id="businessName"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g. Manufacturing"
              maxLength={100}
              className="h-9 bg-background border-border text-foreground placeholder:text-muted-foreground"
              required
            />
          </div>
          <div className="grid gap-1.5">
            <Label className="text-foreground">Branch</Label>
            <BranchDropDown value={branch} onSelect={handleBranchSelect} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="businessStatus" className="text-foreground">
              Status
            </Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="businessStatus" className="h-9 w-full">
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

export default UpdateBusiness;
