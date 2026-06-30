import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const RequiredLabel = ({ children }) => (
  <label className="mb-2 flex items-center gap-0.5 text-sm font-medium capitalize text-foreground">
    {children}
    <span className="text-destructive text-base leading-none">*</span>
  </label>
);

const CreateBranchAdmin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    employeeId: "",
    aadharCard: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    department: "",
    role: "",
    password: "",
    confirmPassword: "",
    city: "",
    district: "",
    state: "",
    pincode: "",
    country: "",
    lane: "",
    landmark: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 w-full max-w-6xl mx-auto">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="h-8 w-8"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} />
        </Button>
        <h1 className="text-lg font-semibold text-foreground capitalize">
          Create Branch Admin
        </h1>
      </div>

      <div className="bg-card border border-border rounded-md py-6 shadow-sm">
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl w-full mx-auto space-y-8 px-4"
        >
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-foreground capitalize border-b border-border pb-2">
              Employee Details
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <RequiredLabel>Employee Id</RequiredLabel>
                <Input
                  name="employeeId"
                  value={form.employeeId}
                  onChange={handleChange}
                  className="h-11 w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
                  placeholder="Enter employee ID"
                />
              </div>

              <div>
                <RequiredLabel>Aadhar Card Number</RequiredLabel>
                <Input
                  name="aadharCard"
                  value={form.aadharCard}
                  onChange={handleChange}
                  className="h-11 w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
                  placeholder="Enter Aadhaar number"
                />
              </div>

              <div>
                <RequiredLabel>First Name</RequiredLabel>
                <Input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className="h-11 w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
                  placeholder="Enter first name"
                />
              </div>

              <div>
                <RequiredLabel>Last Name</RequiredLabel>
                <Input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  className="h-11 w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
                  placeholder="Enter last name"
                />
              </div>

              <div>
                <RequiredLabel>Email</RequiredLabel>
                <Input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="h-11 w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
                  placeholder="example@domain.com"
                />
              </div>

              <div>
                <RequiredLabel>Phone Number</RequiredLabel>
                <Input
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  className="h-11 w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <RequiredLabel>Department</RequiredLabel>
                <Input
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  className="h-11 w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
                  placeholder="Enter department"
                />
              </div>

              <div>
                <RequiredLabel>Role</RequiredLabel>
                <Input
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="h-11 w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
                  placeholder="Enter role"
                />
              </div>

              <div>
                <RequiredLabel>Password</RequiredLabel>
                <Input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  className="h-11 w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
                  placeholder="Enter password"
                />
              </div>

              <div>
                <RequiredLabel>Confirm Password</RequiredLabel>
                <Input
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="h-11 w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
                  placeholder="Re-enter password"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-base font-semibold text-foreground capitalize border-b border-border pb-2">
              Address
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <RequiredLabel>City</RequiredLabel>
                <Input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="h-11 w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
                  placeholder="Enter city"
                />
              </div>

              <div>
                <RequiredLabel>District</RequiredLabel>
                <Input
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                  className="h-11 w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
                  placeholder="Enter district"
                />
              </div>

              <div>
                <RequiredLabel>State</RequiredLabel>
                <Input
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  className="h-11 w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
                  placeholder="Enter state"
                />
              </div>

              <div>
                <RequiredLabel>Pincode</RequiredLabel>
                <Input
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  className="h-11 w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
                  placeholder="Enter pincode"
                />
              </div>

              <div>
                <RequiredLabel>Country</RequiredLabel>
                <Input
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  className="h-11 w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
                  placeholder="Enter country"
                />
              </div>

              <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                <RequiredLabel>Lane</RequiredLabel>
                <Input
                  name="lane"
                  value={form.lane}
                  onChange={handleChange}
                  className="h-11 w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
                  placeholder="Enter lane / street"
                />
              </div>

              <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                <RequiredLabel>Landmark</RequiredLabel>
                <Input
                  name="landmark"
                  value={form.landmark}
                  onChange={handleChange}
                  className="h-11 w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
                  placeholder="Enter landmark"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-2 pb-6">
            <Button
              type="submit"
              className="max-w-xs w-full py-5 text-base capitalize"
            >
              Create Branch Admin
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBranchAdmin;
