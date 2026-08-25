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

import { roleData } from "@/features/superAdmin/data/role/roleTable";
import DepartmentDropDown from "@/components/shared/dropdown/departmentDropDown";
import BranchDropDown from "@/components/shared/dropdown/branchDropdown";

// const depart = {
// departName:""
// };
// const branchData = {
//   branchName :""
// }
const IN_Data = {
  departName: "",
  branchName: "",
};
const CreateRole = () => {
  const [roleName, setRoleName] = useState("");
  const [department, setDepartment] = useState("");
  // const [branch, setBranch] = useState(branchData);
  const [form, setForm] = useState(IN_Data);
  const [status, setStatus] = useState("");
  const [open, setOpen] = useState(false);

  const HandleDepartmentSel = (dep) => {
    setForm((prev) => ({ ...prev, departName: dep }));
  };
  const HandleBranchSel = (bra) => {
    setForm((prev) => ({ ...prev, branchName: bra }));
  };
  // console.log("departmet: "+IN_Data.departName);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!roleName.trim() || !department || !status) return;

    const selectedDepartment = roleData.data.find(
      (dept) => dept.id === department,
    );

    console.log({
      roleName,
      departmentId: department,
      departmentName: selectedDepartment?.name,
      status,
    });

    // Reset Form
    setRoleName("");
    setDepartment("");
    setStatus("");
    setOpen(false);
  };

  const handleCancel = () => {
    setRoleName("");
    setDepartment("");
    setStatus("");
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button className="gap-2">
          <Plus size={16} />
          Create Role
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-[360px] p-5">
        <PopoverHeader className="px-0 pt-0">
          <PopoverTitle>Create Role</PopoverTitle>

          <PopoverDescription>Enter role details below.</PopoverDescription>
        </PopoverHeader>

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          {/* Role Name */}
          <div className="flex flex-col gap-2 w-full">
            <Label htmlFor="roleName">Role Name</Label>

            <Input
              id="roleName"
              placeholder="Enter Role Name"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Department */}
          <div className="flex flex-col gap-2 w-full">
            <Label htmlFor="department">Department</Label>

            <DepartmentDropDown
              value={form.departName}
              onSelect={HandleDepartmentSel}
            ></DepartmentDropDown>
            {/* <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger id="department" className="w-full">
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>

              <SelectContent
                position="popper"
                side="bottom"
                align="start"
                sideOffset={6}
                className="w-[--radix-select-trigger-width]"
              >
                {roleData.data
                  .filter((dept) => dept.is_active)
                  .map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select> */}
            {/* Branch */}
          </div>
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="branch">Branch</label>
            <BranchDropDown
              value={form.branchName}
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
                <SelectItem key={0} value={"Zoho Developer"}>Zoho Developer</SelectItem>

              </SelectContent> */}
            {/* </Select> */}
          </div>

          {/* Status */}
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

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>

            <Button type="submit">Create Role</Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default CreateRole;
