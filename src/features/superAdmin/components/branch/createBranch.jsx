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
import useCreateBranch from "../../hooks/branch/useCreateBranch";

const CreateBranch = ({ onCreated, disabled = false }) => {
  const { Create } = useCreateBranch();
  const [branchName, setBranchName] = useState("");
  const [status, setStatus] = useState("true");
  const [open, setOpen] = useState(false);

  const resetForm = () => {
    setBranchName("");
    setStatus("true");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!branchName.trim()) return;

    try {
      await Create({ name: branchName.trim(), is_active: status === "true" });
    } catch (err) {
      console.error("Failed to create branch:", err);
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
          Create Branch
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <PopoverHeader>
          <PopoverTitle className="text-base font-semibold text-foreground">
            Create Branch
          </PopoverTitle>
          <PopoverDescription className="text-sm text-muted-foreground">
            Enter the name for the new branch.
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

export default CreateBranch;
