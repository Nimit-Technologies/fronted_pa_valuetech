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
import BranchDropDown from "@/components/shared/dropdown/branchDropdown";
const CreateDepartment = () => {
  const branchData = {
    branchName: "",
  };

  const [departmentName, setDepartmentName] = useState("");
  const [status, setStatus] = useState("");
  const [branch, setBranch] = useState(branchData);
  const [open, setOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!departmentName.trim() || !status) return;

    console.log({
      departmentName,
      status,
    });

    // Reset Form
    setDepartmentName("");
    setStatus("");
    setOpen(false);
  };

  const HandleBranchSel = (bra) => {
    setBranch((prev) => ({ ...prev, branchName: bra }));
  };

  const handleCancel = () => {
    setDepartmentName("");
    setStatus("");
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* Button */}
      <PopoverTrigger asChild>
        <Button className="gap-2">
          <Plus size={16} />
          Create Department
        </Button>
      </PopoverTrigger>

      {/* Popup */}
      <PopoverContent align="end" className="w-[360px] p-5">
        <PopoverHeader className="px-0 pt-0">
          <PopoverTitle>Create Department</PopoverTitle>

          <PopoverDescription>
            Enter department details below.
          </PopoverDescription>
        </PopoverHeader>

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          {/* Department Name */}
          <div className="flex flex-col gap-2 w-full">
            <Label>Department Name</Label>

            <Input
              placeholder="Enter Department Name"
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              className="w-full"
            />
          </div>
          {/* Branch */}

          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="branch">Branch</label>
            <BranchDropDown
              value={branch.branchName}
              onSelect={HandleBranchSel}
            ></BranchDropDown>
            {/* <Select value={branch} onValueChange={setBranch}>

              <SelectTrigger id="branch" className="w-full">
                <SelectValue placeholder="Select Branch"></SelectValue>
              </SelectTrigger>

              <SelectContent
                position="popper"
                side="bottom"
                align="start"
                sideOffset={6}
                className="w-[--radix-select-trigger-width]"
              >
                <SelectItem key={0} value={"Zoho Developer"}>Noida</SelectItem>

              </SelectContent>
            </Select> */}
          </div>

          {/* Status */}
          <div className="flex flex-col gap-2 w-full">
            <Label>Status</Label>

            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="active">Active</SelectItem>

                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>

            <Button type="submit">Create Department</Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default CreateDepartment;
