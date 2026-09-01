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
import useUpdateDepartment from "../../hooks/department/useUpdateDepartment";
import useAllDepartment from "../../hooks/department/useAllDepartment";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Pencil } from "lucide-react";

const UpdateDepartment = ({
  departmentId,

  defaultDepartmentName = "Engineering",

  defaultStatus = true,
}) => {
  const { update } = useUpdateDepartment();
  const { allDepartment } = useAllDepartment();

  const [departmentName, setDepartmentName] = useState(defaultDepartmentName);

  const [status, setStatus] = useState(defaultStatus ? "active" : "inactive");

  const [open, setOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      data: {
        id: departmentId,
        name: departmentName,
        is_active: status === "active",
      },
    };

    try {
      await update(payload);
      allDepartment();
    } catch (err) {
      console.error("Failed to update department:", err);
    }
    setOpen(false);
  };

  const handleCancel = () => {
    setDepartmentName(defaultDepartmentName);

    setStatus(defaultStatus ? "active" : "inactive");

    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"

          size="icon"

          className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Pencil size={14} />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"

        className="w-[360px] p-5"
      >
        <PopoverHeader className="px-0 pt-0">
          <PopoverTitle>Update Department</PopoverTitle>

          <PopoverDescription>
            Update department details below.
          </PopoverDescription>
        </PopoverHeader>

        <form
          onSubmit={handleSubmit}

          className="mt-5 space-y-5"
        >
          {/* Department Name */}

          <div className="flex flex-col gap-2 w-full">
            <Label>Department Name</Label>

            <Input
              value={departmentName}

              onChange={(e) => setDepartmentName(e.target.value)}

              placeholder="Enter Department Name"

              className="w-full"
            />
          </div>

          {/* Status */}

          <div className="flex flex-col gap-2 w-full">
            <Label>Status</Label>

            <Select
              value={status}

              onValueChange={setStatus}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="active">Active</SelectItem>

                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Buttons */}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"

              variant="outline"

              onClick={handleCancel}
            >
              Cancel
            </Button>

            <Button type="submit">Update</Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default UpdateDepartment;
