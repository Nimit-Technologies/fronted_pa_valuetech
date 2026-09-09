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
import useCreateRole from "../../hooks/role/useCreateRole";
import useAllRole from "../../hooks/role/useAllRole";
import DepartmentDropDown from "@/components/shared/dropdown/departmentDropDown";
import BranchDropDown from "@/components/shared/dropdown/branchDropdown";

const IN_Data = {
  departName: "",
  departmentId: "",
  branchName: "",
  branchId: "",
};

const CreateRole = () => {
  const { Create } = useCreateRole();
  const { allRole } = useAllRole();

  const [roleName, setRoleName] = useState("");
  const [form, setForm] = useState(IN_Data);
  const [status, setStatus] = useState("");
  const [open, setOpen] = useState(false);

  const HandleDepartmentSel = (department) => {
    setForm((prev) => ({
      ...prev,
      departName: department?.name || "",
      departmentId: department?.id || "",
    }));
  };

  const HandleBranchSel = (branch) => {
    setForm((prev) => ({
      ...prev,
      branchName: branch?.name || "",
      branchId: branch?.id || "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!roleName.trim() || !form.departmentId || !status) return;

    try {
      await Create({
        name: roleName.trim(),
        department_id: form.departmentId,
      });
      await allRole();
    } catch (err) {
      console.log(err);
    }

    setRoleName("");
    setForm(IN_Data);
    setStatus("");
    setOpen(false);
  };

  const handleCancel = () => {
    setRoleName("");
    setForm(IN_Data);
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

          <div className="flex flex-col gap-2 w-full">
            <Label htmlFor="department">Department</Label>

            <DepartmentDropDown
              value={form.departName}
              onSelect={HandleDepartmentSel}
            ></DepartmentDropDown>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="branch">Branch</label>
            <BranchDropDown
              value={form.branchName}
              onSelect={HandleBranchSel}
            ></BranchDropDown>
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

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>

            <Button type="submit">Create</Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default CreateRole;
