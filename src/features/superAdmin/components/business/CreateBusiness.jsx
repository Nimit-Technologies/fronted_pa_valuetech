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
import BranchDropDown from "@/components/shared/dropdown/branchDropdown";
import useCreateBusiness from "../../hooks/business/useCreateBusiness";

const EMPTY_BRANCH = { branch_id: "", name: "" };

const CreateBusiness = ({ onCreated, disabled = false }) => {
  const { Create } = useCreateBusiness();
  const [businessName, setBusinessName] = useState("");
  const [branch, setBranch] = useState(EMPTY_BRANCH);
  const [open, setOpen] = useState(false);

  const resetForm = () => {
    setBusinessName("");
    setBranch(EMPTY_BRANCH);
  };

  // BranchDropDown hands back { branch_id, name }; keep only what the form
  // needs so nothing else leaks into the request.
  const handleBranchSelect = (selected) => {
    setBranch({
      branch_id: selected?.branch_id ?? "",
      name: selected?.name ?? "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // branch_id is required by the backend schema, so block the request here
    // rather than letting it come back as a 400.
    if (!businessName.trim() || !branch.branch_id) return;

    try {
      await Create({ name: businessName.trim(), branch_id: branch.branch_id });
    } catch (err) {
      console.error("Failed to create business type:", err);
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
          Create Business
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <PopoverHeader>
          <PopoverTitle className="text-base font-semibold text-foreground">
            Create Business
          </PopoverTitle>
          <PopoverDescription className="text-sm text-muted-foreground">
            Enter the name and branch for the new business type.
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

export default CreateBusiness;
