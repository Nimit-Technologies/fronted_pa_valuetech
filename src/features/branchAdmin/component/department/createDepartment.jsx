import React, { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

const INITIAL_FORM = { departmentName: "", status: "" };

// Opens as a centered modal. A popover is always anchored to its trigger, so
// a popup that should sit in the middle of the screen is a dialog.
const CreateDepartment = ({ onCreate, disabled = false }) => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const name = form.departmentName.trim();
  const nameMissing = submitted && !name;
  const statusMissing = submitted && !form.status;

  const setField = (field) => (value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setSubmitted(false);
  };

  // Runs for Cancel, the X button, Escape and outside clicks alike, so the
  // form never reopens with stale input.
  const handleOpenChange = (next) => {
    if (!next) resetForm();
    setOpen(next);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (!name || !form.status) return;

    const payload = { name, is_active: form.status === "active" };
    // TODO: call the department API once this page moves off mock data.
    console.log("Create department:", payload);
    onCreate?.(payload);

    resetForm();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2 whitespace-nowrap" disabled={disabled}>
          <Plus size={16} />
          Create Department
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Create Department</DialogTitle>
          <DialogDescription>Enter department details below.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
          {/* Department Name */}
          <div className="grid gap-1.5">
            <Label htmlFor="departmentName">Department Name</Label>
            <Input
              id="departmentName"
              value={form.departmentName}
              onChange={(e) => setField("departmentName")(e.target.value)}
              placeholder="Enter Department Name"
              aria-invalid={nameMissing}
            />
            {nameMissing && (
              <p className="text-xs text-destructive">
                Department name is required.
              </p>
            )}
          </div>

          {/* Status */}
          <div className="grid gap-1.5">
            <Label htmlFor="departmentStatus">Status</Label>
            <Select value={form.status} onValueChange={setField("status")}>
              <SelectTrigger
                id="departmentStatus"
                className="w-full"
                aria-invalid={statusMissing}
              >
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            {statusMissing && (
              <p className="text-xs text-destructive">
                Please select a status.
              </p>
            )}
          </div>

          {/* Buttons */}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create Department</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDepartment;
