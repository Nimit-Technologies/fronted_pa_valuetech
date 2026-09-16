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
import useUpdateBranch from "../../hooks/branch/useUpdateBranch";

const UpdateBranch = ({
  defaultName = "",
  branchId,
  defaultStatus = true,
  onUpdated,
}) => {
  const { Update } = useUpdateBranch();
  const [branchName, setBranchName] = useState(defaultName);
  const [status, setStatus] = useState(defaultStatus ? "true" : "false");
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!branchName.trim()) return;

    const payload = {
      data: {
        id: branchId,
        name: branchName.trim(),
        is_active: status === "true",
      },
    };

    try {
      await Update(payload);
    } catch (err) {
      console.error("Failed to update branch:", err);
      return;
    }
    onUpdated?.();
    setOpen(false);
  };

  const resetToDefaults = () => {
    setBranchName(defaultName);
    setStatus(defaultStatus ? "true" : "false");
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
            Update Branch
          </PopoverTitle>
          <PopoverDescription className="text-sm text-muted-foreground">
            Edit the name of the branch.
          </PopoverDescription>
        </PopoverHeader>
        <form onSubmit={handleSubmit} className="mt-4 grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="branchName" className="text-foreground">
              Branch Name
            </Label>
            <Input
              id="branchName"
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
              placeholder="e.g. Mumbai"
              className="h-9 bg-background border-border text-foreground placeholder:text-muted-foreground"
              required
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="branchStatus" className="text-foreground">
              Status
            </Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="branchStatus" className="h-9 w-full">
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

export default UpdateBranch;
