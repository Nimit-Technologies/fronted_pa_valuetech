import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import BranchDropDown from "@/components/shared/dropdown/branchDropdown";
import DepartmentDropDown from "@/components/shared/dropdown/departmentDropDown";
import RoleDropDown from "@/components/shared/dropdown/roleDropDown";
import useCreateUser from "@/features/superAdmin/hooks/user/useCreateUser";

const FieldLabel = ({ htmlFor, required = false, children }) => (
  <Label htmlFor={htmlFor} className="mb-1.5 text-foreground">
    {children}
    {required ? <span className="ml-1 text-destructive">*</span> : null}
  </Label>
);

const INPUT_CLASS =
  "h-11 w-full bg-background border-border text-foreground placeholder:text-muted-foreground";

const EMPTY_BRANCH = { branch_id: "", name: "" };
const EMPTY_DEPARTMENT = { id: "", name: "" };
const EMPTY_ROLE = { id: "", name: "" };

const INITIAL_FORM = {
  employeeId: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  aadharNumber: "",
  password: "",
  confirmPassword: "",
  branch: EMPTY_BRANCH,
  department: EMPTY_DEPARTMENT,
  role: EMPTY_ROLE,
  city: "",
  district: "",
  state: "",
  pincode: "",
  country: "India",
  lane: "",
  landmark: "",
};

// Mirrors the backend zod schema so the obvious mistakes never leave the
// browser; the backend remains the authority and its message is toasted.
const validate = (form) => {
  if (!/^\d{10}$/.test(form.phone)) return "Phone number must be 10 digits.";
  if (!/^\d{12}$/.test(form.aadharNumber))
    return "Aadhaar number must be 12 digits.";
  if (!form.branch.branch_id) return "Please select a branch.";
  if (!form.department.id) return "Please select a department.";
  if (!form.role.id) return "Please select a role.";
  if (form.password.length < 12 || form.password.length > 20)
    return "Password must be 12 to 20 characters.";
  if (form.password !== form.confirmPassword) return "Passwords do not match.";
  if (!/^\d{6}$/.test(form.pincode)) return "Pincode must be 6 digits.";
  return "";
};

const CreateUser = () => {
  const navigate = useNavigate();
  const { create } = useCreateUser();

  const [form, setForm] = useState(INITIAL_FORM);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // The list page lives one path segment up (/…/user/create -> /…/user).
  const goToList = () => navigate("..", { relative: "path" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Each dropdown emits its own id key; keep only what the request needs.
  const handleBranchSelect = (selected) =>
    setForm((prev) => ({
      ...prev,
      branch: {
        branch_id: selected?.branch_id ?? "",
        name: selected?.name ?? "",
      },
    }));

  const handleDepartmentSelect = (selected) =>
    setForm((prev) => ({
      ...prev,
      department: { id: selected?.id ?? "", name: selected?.name ?? "" },
    }));

  const handleRoleSelect = (selected) =>
    setForm((prev) => ({
      ...prev,
      role: { id: selected?.id ?? "", name: selected?.name ?? "" },
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const problem = validate(form);
    if (problem) {
      setFormError(problem);
      return;
    }
    setFormError("");

    const payload = {
      employee_id: form.employeeId.trim(),
      first_name: form.firstName.trim(),
      last_name: form.lastName.trim(),
      phone: form.phone.trim(),
      password: form.password,
      confirm_password: form.confirmPassword,
      aadhaar_number: form.aadharNumber.trim(),
      branch_id: form.branch.branch_id,
      department_id: form.department.id,
      role_id: form.role.id,
      address: {
        city: form.city.trim(),
        district: form.district.trim(),
        state: form.state.trim(),
        pin_code: form.pincode.trim(),
        country: form.country.trim(),
        lane: form.lane.trim(),
        landmark: form.landmark.trim(),
      },
    };
    // Email is optional server-side but must be a valid address when sent.
    if (form.email.trim()) payload.email = form.email.trim();

    setSubmitting(true);
    try {
      await create(payload);
    } catch {
      // The hook already toasted the server's message; keep the form as is.
      return;
    } finally {
      setSubmitting(false);
    }

    goToList();
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 w-full max-w-6xl mx-auto">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="h-8 w-8"
          onClick={goToList}
        >
          <ArrowLeft size={16} />
        </Button>
        <h1 className="text-lg font-semibold text-foreground">Create User</h1>
      </div>

      <div className="bg-card border border-border rounded-md py-6 shadow-sm">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="max-w-4xl w-full mx-auto space-y-8 px-4"
        >
          <section className="space-y-4">
            <h2 className="text-base font-semibold border-b border-border pb-2 text-foreground">
              User Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <FieldLabel htmlFor="employeeId" required>
                  Employee ID
                </FieldLabel>
                <Input
                  id="employeeId"
                  name="employeeId"
                  value={form.employeeId}
                  onChange={handleChange}
                  placeholder="e.g. emp001"
                  className={INPUT_CLASS}
                  required
                />
              </div>

              <div>
                <FieldLabel htmlFor="firstName" required>
                  First Name
                </FieldLabel>
                <Input
                  id="firstName"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  className={INPUT_CLASS}
                  required
                />
              </div>

              <div>
                <FieldLabel htmlFor="lastName" required>
                  Last Name
                </FieldLabel>
                <Input
                  id="lastName"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  className={INPUT_CLASS}
                  required
                />
              </div>

              <div>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter email (optional)"
                  className={INPUT_CLASS}
                />
              </div>

              <div>
                <FieldLabel htmlFor="phone" required>
                  Phone
                </FieldLabel>
                <Input
                  id="phone"
                  name="phone"
                  inputMode="numeric"
                  maxLength={10}
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="10-digit phone number"
                  className={INPUT_CLASS}
                  required
                />
              </div>

              <div>
                <FieldLabel htmlFor="aadharNumber" required>
                  Aadhaar Number
                </FieldLabel>
                <Input
                  id="aadharNumber"
                  name="aadharNumber"
                  inputMode="numeric"
                  maxLength={12}
                  value={form.aadharNumber}
                  onChange={handleChange}
                  placeholder="12-digit Aadhaar number"
                  className={INPUT_CLASS}
                  required
                />
              </div>

              <div>
                <FieldLabel required>Branch</FieldLabel>
                <BranchDropDown
                  value={form.branch}
                  onSelect={handleBranchSelect}
                  disabled={submitting}
                />
              </div>

              <div>
                <FieldLabel required>Department</FieldLabel>
                <DepartmentDropDown
                  value={form.department}
                  onSelect={handleDepartmentSelect}
                  disabled={submitting}
                />
              </div>

              <div>
                <FieldLabel required>Role</FieldLabel>
                <RoleDropDown
                  value={form.role}
                  onSelect={handleRoleSelect}
                  disabled={submitting}
                />
              </div>

              <div>
                <FieldLabel htmlFor="password" required>
                  Password
                </FieldLabel>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  autoComplete="new-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className={INPUT_CLASS}
                  required
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  12 to 20 characters with an uppercase letter, a lowercase
                  letter, a number and a special character. No spaces.
                </p>
              </div>

              <div>
                <FieldLabel htmlFor="confirmPassword" required>
                  Confirm Password
                </FieldLabel>
                <Input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  autoComplete="new-password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  className={INPUT_CLASS}
                  required
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-base font-semibold border-b border-border pb-2 text-foreground">
              Address
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <FieldLabel htmlFor="city" required>
                  City
                </FieldLabel>
                <Input
                  id="city"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                  className={INPUT_CLASS}
                  required
                />
              </div>

              <div>
                <FieldLabel htmlFor="district" required>
                  District
                </FieldLabel>
                <Input
                  id="district"
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                  placeholder="Enter district"
                  className={INPUT_CLASS}
                  required
                />
              </div>

              <div>
                <FieldLabel htmlFor="state" required>
                  State
                </FieldLabel>
                <Input
                  id="state"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  placeholder="Enter state"
                  className={INPUT_CLASS}
                  required
                />
              </div>

              <div>
                <FieldLabel htmlFor="pincode" required>
                  Pincode
                </FieldLabel>
                <Input
                  id="pincode"
                  name="pincode"
                  inputMode="numeric"
                  maxLength={6}
                  value={form.pincode}
                  onChange={handleChange}
                  placeholder="6-digit pincode"
                  className={INPUT_CLASS}
                  required
                />
              </div>

              <div>
                <FieldLabel htmlFor="country">Country</FieldLabel>
                <Input
                  id="country"
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  placeholder="Enter country"
                  className={INPUT_CLASS}
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-3">
                <FieldLabel htmlFor="lane">Lane / Street</FieldLabel>
                <Input
                  id="lane"
                  name="lane"
                  value={form.lane}
                  onChange={handleChange}
                  placeholder="Enter lane or street"
                  className={INPUT_CLASS}
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-3">
                <FieldLabel htmlFor="landmark">Landmark</FieldLabel>
                <Input
                  id="landmark"
                  name="landmark"
                  value={form.landmark}
                  onChange={handleChange}
                  placeholder="Enter landmark"
                  className={INPUT_CLASS}
                />
              </div>
            </div>
          </section>

          {formError ? (
            <p role="alert" className="text-sm text-destructive">
              {formError}
            </p>
          ) : null}

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2 pb-2">
            <Button
              type="button"
              variant="outline"
              className="sm:w-40"
              onClick={goToList}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" className="sm:w-40" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating…
                </>
              ) : (
                "Create User"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;
