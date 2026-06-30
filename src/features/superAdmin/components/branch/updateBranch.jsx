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
import { Pencil } from "lucide-react";

const UpdateBranch = ({ defaultName = "", branchId }) => {
  const [branchName, setBranchName] = useState(defaultName);
  const [open, setOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!branchName.trim()) return;
    // TODO: wire up with API
    console.log("Updating branch:", branchId, branchName.trim());
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
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
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => { setBranchName(defaultName); setOpen(false); }}
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
