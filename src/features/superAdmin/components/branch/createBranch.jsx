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
import useCreateBranch from "../../hooks/branch/useCreateBranch";
import useAllBranch from "../../hooks/branch/useAllBranch";
const CreateBranch = () => {
  const { Create } = useCreateBranch();
  const { allBranch } = useAllBranch();
  const [branchName, setBranchName] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!branchName.trim()) return;
    // TODO: wire up with API
    // console.log("Creating branch:", branchName.trim());

    try {
      await Create({ name: branchName.trim() });
      await allBranch();
    } catch (err) {
      console.error("Failed to create branch:", err);
    }

    setBranchName("");
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button className="gap-2 whitespace-nowrap">
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
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => {
                setBranchName("");
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
