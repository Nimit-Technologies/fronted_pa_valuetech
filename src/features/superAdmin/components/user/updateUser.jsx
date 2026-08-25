import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { userTableData } from "@/features/branchAdmin/data/user/userTable";
import DepartmentDropDown from "@/components/shared/dropdown/departmentDropDown";
import RoleDropDown from "@/components/shared/dropdown/roleDropDown";
import BranchDropDown from "@/components/shared/dropdown/branchDropdown";

const RequiredLabel = ({ children }) => (
  <label className="mb-2 flex items-center gap-0.5 text-sm font-medium capitalize text-foreground">
    {children}
    <span className="text-destructive text-base leading-none">*</span>
  </label>
);

const UpdateUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = userTableData.data.find((item) => item.id === id);

  const [form, setForm] = useState({
    employeeId: user?.employee_id ?? "",
    firstName: user?.first_name ?? "",
    lastName: user?.last_name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    aadharNumber: user?.adhar_number ?? "",

    branch: user?.branch?.name ?? "",
    department: user?.department?.name ?? "",
    role: user?.role?.name ?? "",
    status: user?.is_active ? "Active" : "Inactive",

    city: user?.address?.city ?? "",
    district: user?.address?.district ?? "",
    state: user?.address?.state ?? "",
    pincode: user?.address?.pin_code ?? "",
    country: user?.address?.country ?? "",
    lane: user?.address?.lane ?? "",
    landmark: user?.address?.landmark ?? "",
  });

  const handleDepartmentSelect = (dep) => {
    setForm((prev) => ({ ...prev, department: dep }));
  };

  const handleBranchSelect = (bra) => {
    setForm((prev) => ({ ...prev, branch: bra }));
  };

  const handleRoleSelect = (rol) => {
    setForm((prev) => ({ ...prev, role: rol }));
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSelect = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Updated User :", id, form);
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-muted-foreground">User not found.</p>

        <Button variant="outline" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon-sm"
          className="h-8 w-8"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} />
        </Button>

        <h1 className="text-lg font-semibold">Update User</h1>
      </div>

      {/* Card */}
      <div className="bg-card border border-border rounded-md py-6 shadow-sm">
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl w-full mx-auto space-y-8 px-4"
        >
          {/* User Details */}
          <div className="space-y-4">
            <h2 className="text-base font-semibold border-b border-border pb-2">
              User Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Employee ID */}
              <div>
                <RequiredLabel>Employee ID</RequiredLabel>

                <Input
                  name="employeeId"
                  value={form.employeeId}
                  onChange={handleChange}
                  placeholder="Enter Employee ID"
                  className="h-11 bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              {/* First Name */}
              <div>
                <RequiredLabel>First Name</RequiredLabel>

                <Input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="Enter First Name"
                  className="h-11 bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              {/* Last Name */}
              <div>
                <RequiredLabel>Last Name</RequiredLabel>

                <Input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Enter Last Name"
                  className="h-11 bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              {/* Email */}
              <div>
                <RequiredLabel>Email</RequiredLabel>

                <Input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter Email"
                  className="h-11 bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              {/* Phone */}
              <div>
                <RequiredLabel>Phone Number</RequiredLabel>

                <Input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter Phone Number"
                  className="h-11 bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              {/* Aadhar */}
              <div>
                <RequiredLabel>Aadhar Number</RequiredLabel>

                <Input
                  name="aadharNumber"
                  value={form.aadharNumber}
                  onChange={handleChange}
                  placeholder="Enter Aadhar Number"
                  className="h-11 bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
              {/* Branch */}
              <div className="flex flex-col gap-2 w-full">
                <RequiredLabel>Branch</RequiredLabel>
                <BranchDropDown
                  value={form.branch}
                  onSelect={handleBranchSelect}
                ></BranchDropDown>
                {/* <Select
                  value={form.branch}
                  onValueChange={(value) => handleSelect("branch", value)}
                >
                  <SelectTrigger className="w-full h-11 bg-background border-border">
                    <SelectValue placeholder="Select Branch" />
                  </SelectTrigger>

                  <SelectContent className="w-[--radix-select-trigger-width]">
                    <SelectItem value="Noida">Noida</SelectItem>
                    <SelectItem value="Lucknow">Lucknow</SelectItem>
                    <SelectItem value="Gurgaon">Gurgaon</SelectItem>
                  </SelectContent>
                </Select> */}
              </div>

              {/* Department */}
              <div className="flex flex-col gap-2 w-full">
                <RequiredLabel>Department</RequiredLabel>
                <DepartmentDropDown
                  value={form.department}
                  onSelect={handleDepartmentSelect}
                ></DepartmentDropDown>
                {/* <Select
                  value={form.department}
                  onValueChange={(value) => handleSelect("department", value)}
                >
                  <SelectTrigger className="w-full h-11 bg-background border-border">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>

                  <SelectContent className="w-[--radix-select-trigger-width]">
                    <SelectItem value="Management">Management</SelectItem>

                    <SelectItem value="Sales">Sales</SelectItem>

                    <SelectItem value="Technical">Technical</SelectItem>

                    <SelectItem value="HR">HR</SelectItem>
                  </SelectContent>
                </Select> */}
              </div>

              {/* Role */}
              <div className="flex flex-col gap-2 w-full">
                <RequiredLabel>Role</RequiredLabel>
                <RoleDropDown
                  value={form.role}
                  onSelect={handleRoleSelect}
                ></RoleDropDown>
                {/* <Select
                  value={form.role}
                  onValueChange={(value) => handleSelect("role", value)}
                >
                  <SelectTrigger className="w-full h-11 bg-background border-border">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>

                  <SelectContent className="w-[--radix-select-trigger-width]">
                    <SelectItem value="Super Admin">Super Admin</SelectItem>

                    <SelectItem value="Manager">Manager</SelectItem>

                    <SelectItem value="Engineer">Engineer</SelectItem>

                    <SelectItem value="Staff">Staff</SelectItem>
                  </SelectContent>
                </Select> */}
              </div>

              {/* Status */}
              <div className="flex flex-col gap-2 w-full">
                <RequiredLabel>Status</RequiredLabel>

                <Select
                  value={form.status}
                  onValueChange={(value) => handleSelect("status", value)}
                >
                  <SelectTrigger className="w-full h-11 bg-background border-border">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>

                  <SelectContent className="w-[--radix-select-trigger-width]">
                    <SelectItem value="Active">Active</SelectItem>

                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-4">
            <h2 className="text-base font-semibold border-b border-border pb-2">
              Address
            </h2>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <RequiredLabel>City</RequiredLabel>

                <Input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Enter City"
                  className="h-11 bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <RequiredLabel>District</RequiredLabel>

                <Input
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                  placeholder="Enter District"
                  className="h-11 bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <RequiredLabel>State</RequiredLabel>

                <Input
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  placeholder="Enter State"
                  className="h-11 bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <RequiredLabel>Pincode</RequiredLabel>

                <Input
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  placeholder="Enter Pincode"
                  className="h-11 bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <RequiredLabel>Country</RequiredLabel>

                <Input
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  placeholder="Enter Country"
                  className="h-11 bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                <RequiredLabel>Lane</RequiredLabel>

                <Input
                  name="lane"
                  value={form.lane}
                  onChange={handleChange}
                  placeholder="Enter Lane"
                  className="h-11 bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                <RequiredLabel>Landmark</RequiredLabel>

                <Input
                  name="landmark"
                  value={form.landmark}
                  onChange={handleChange}
                  placeholder="Enter Landmark"
                  className="h-11 bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>
          </div>

          {/* Update Button */}
          <div className="flex justify-center pt-2 pb-6">
            <Button type="submit" className="max-w-xs w-full py-5 text-base">
              Update User
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateUser;
