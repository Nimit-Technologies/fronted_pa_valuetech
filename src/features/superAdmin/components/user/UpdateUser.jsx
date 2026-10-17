import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { ArrowLeft, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BranchDropDown from "@/components/shared/dropdown/branchDropdown";
import DepartmentDropDown from "@/components/shared/dropdown/departmentDropDown";
import RoleDropDown from "@/components/shared/dropdown/roleDropDown";
import BusinessTypeDropDown from "@/components/shared/dropdown/businessTypeDropDown";
import { isCoordinatorRoleName } from "@/features/auth/constants/roles";
import useGetUserById from "@/features/superAdmin/hooks/user/useGetUserById";
import useUpdateUser from "@/features/superAdmin/hooks/user/useUpdateUser";

const FieldLabel = ({ htmlFor, required = false, children }) => (
  <Label htmlFor={htmlFor} className="mb-1.5 text-foreground">
    {children}
    {required ? <span className="ml-1 text-destructive">*</span> : null}
  </Label>
);

const INPUT_CLASS =
  "h-11 w-full bg-background border-border text-foreground placeholder:text-muted-foreground";

// Flattens an API user row into the form's field names. The service turns it
// back into the backend's snake_case update payload on submit.
const toForm = (user) => ({
  id: user.id,
  employeeId: user.employee_id ?? "",
  firstName: user.first_name ?? "",
  lastName: user.last_name ?? "",
  email: user.email ?? "",
  phone: user.phone ?? "",
  // Responses only carry the masked Aadhaar (XXXXXXXX1234); the field starts
  // empty and is sent only when a new 12-digit number is typed.
  aadharNumber: "",
  branch: user.branch?.name ?? "",
  branchId: user.branch?.id ?? "",
  department: user.department?.name ?? "",
  departmentId: user.department?.id ?? "",
  role: user.role?.name ?? "",
  roleId: user.role?.id ?? "",
  // Coordinators only; null for every other role. The name comes from the
  // business_type relation, the id from either it or the flat column.
  businessType: user.business_type?.name ?? "",
  businessTypeId: user.business_type?.id ?? user.business_type_id ?? "",
  status: user.is_active ? "Active" : "Inactive",
  city: user.address?.city ?? "",
  district: user.address?.district ?? "",
  state: user.address?.state ?? "",
  pincode: user.address?.pin_code ?? "",
  country: user.address?.country ?? "",
  lane: user.address?.lane ?? "",
  landmark: user.address?.landmark ?? "",
});

const validate = (form) => {
  if (!/^\d{10}$/.test(form.phone)) return "Phone number must be 10 digits.";
  if (form.aadharNumber && !/^\d{12}$/.test(form.aadharNumber))
    return "Aadhaar number must be 12 digits.";
  if (!form.branchId) return "Please select a branch.";
  if (!form.departmentId) return "Please select a department.";
  if (!form.roleId) return "Please select a role.";
  // A coordinator's case scope *is* their business type and it fails closed,
  // so leaving one without it would silently hide every case from them.
  if (isCoordinatorRoleName(form.role) && !form.businessTypeId)
    return "Please select a business type for a coordinator.";
  if (!/^\d{6}$/.test(form.pincode)) return "Pincode must be 6 digits.";
  return "";
};

// Separate from the page so its state initialises from a user that has
// already loaded; the page remounts it (via key) if the id changes.
const UpdateUserForm = ({ user, maskedAadhaar, onDone }) => {
  const { update } = useUpdateUser();
  const [form, setForm] = useState(() => toForm(user));
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Each dropdown emits its own id key; keep name and id in flat fields.
  const handleBranchSelect = (selected) =>
    setForm((prev) => ({
      ...prev,
      branch: selected?.name ?? "",
      branchId: selected?.branch_id ?? "",
      // Business types are unique per branch and the API validates the chosen
      // one against the branch the user ends up in, so a move invalidates it.
      businessType: "",
      businessTypeId: "",
    }));

  const handleDepartmentSelect = (selected) =>
    setForm((prev) => ({
      ...prev,
      department: selected?.name ?? "",
      departmentId: selected?.id ?? "",
    }));

  const handleRoleSelect = (selected) =>
    setForm((prev) => {
      const role = selected?.name ?? "";
      const keepBusinessType = isCoordinatorRoleName(role);
      return {
        ...prev,
        role,
        roleId: selected?.id ?? "",
        // Cleared as soon as the role is no longer a coordinator; the payload
        // then sends an explicit null, which disconnects the business line.
        businessType: keepBusinessType ? prev.businessType : "",
        businessTypeId: keepBusinessType ? prev.businessTypeId : "",
      };
    });

  const handleBusinessTypeSelect = (selected) =>
    setForm((prev) => ({
      ...prev,
      businessType: selected?.name ?? "",
      businessTypeId: selected?.business_type_id ?? "",
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const problem = validate(form);
    if (problem) {
      setFormError(problem);
      return;
    }
    setFormError("");

    setSubmitting(true);
    try {
      await update(form);
    } catch {
      // The hook already toasted the server's message; keep the form as is.
      return;
    } finally {
      setSubmitting(false);
    }

    onDone();
  };

  return (
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
              className={INPUT_CLASS}
              required
            />
          </div>

          <div>
            <FieldLabel htmlFor="aadharNumber">Aadhaar Number</FieldLabel>
            <Input
              id="aadharNumber"
              name="aadharNumber"
              inputMode="numeric"
              maxLength={12}
              value={form.aadharNumber}
              onChange={handleChange}
              placeholder={
                maskedAadhaar
                  ? `Current: ${maskedAadhaar}`
                  : "12-digit Aadhaar number"
              }
              className={INPUT_CLASS}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Leave blank to keep the current number.
            </p>
          </div>

          <div>
            <FieldLabel required>Branch</FieldLabel>
            <BranchDropDown
              value={{ branch_id: form.branchId, name: form.branch }}
              onSelect={handleBranchSelect}
              disabled={submitting}
            />
          </div>

          <div>
            <FieldLabel required>Department</FieldLabel>
            <DepartmentDropDown
              value={{ id: form.departmentId, name: form.department }}
              onSelect={handleDepartmentSelect}
              disabled={submitting}
            />
          </div>

          <div>
            <FieldLabel required>Role</FieldLabel>
            <RoleDropDown
              value={{ id: form.roleId, name: form.role }}
              onSelect={handleRoleSelect}
              disabled={submitting}
            />
          </div>

          {isCoordinatorRoleName(form.role) ? (
            <div>
              <FieldLabel required>Business Type</FieldLabel>
              <BusinessTypeDropDown
                value={{
                  business_type_id: form.businessTypeId,
                  name: form.businessType,
                }}
                onSelect={handleBusinessTypeSelect}
                branchId={form.branchId}
                disabled={submitting}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Scopes which cases this coordinator can see. Must belong to the
                selected branch.
              </p>
            </div>
          ) : null}

          <div>
            <FieldLabel htmlFor="userStatus" required>
              Status
            </FieldLabel>
            <Select
              value={form.status}
              onValueChange={(value) =>
                setForm((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger id="userStatus" className="h-11 w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
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
          onClick={onDone}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button type="submit" className="sm:w-40" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Updating…
            </>
          ) : (
            "Update User"
          )}
        </Button>
      </div>
    </form>
  );
};

const UpdateUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getUserById } = useGetUserById();

  // The row from the list is shown immediately if we came from there; the
  // authoritative record is fetched so a deep link or refresh also works.
  const cachedUser = useSelector((state) =>
    (state.user.userData || []).find((item) => item.id === id),
  );
  const [fetched, setFetched] = useState({ id: null, user: null, done: false });

  useEffect(() => {
    let cancelled = false;
    getUserById(id).then((response) => {
      if (cancelled) return;
      setFetched({ id, user: response?.data ?? null, done: true });
    });
    return () => {
      cancelled = true;
    };
  }, [id, getUserById]);

  const user = fetched.id === id && fetched.user ? fetched.user : cachedUser;
  const loading = !user && !(fetched.id === id && fetched.done);

  // The list page lives two path segments up (/…/user/update/:id -> /…/user).
  const goToList = () => navigate("../..", { relative: "path" });

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
        <h1 className="text-lg font-semibold text-foreground">Update User</h1>
      </div>

      <div className="bg-card border border-border rounded-md py-6 shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading user…
          </div>
        ) : !user ? (
          <div className="flex flex-col items-center justify-center gap-4 py-16">
            <p className="text-sm text-muted-foreground">User not found.</p>
            <Button variant="outline" onClick={goToList}>
              Back to users
            </Button>
          </div>
        ) : (
          <UpdateUserForm
            key={user.id}
            user={user}
            maskedAadhaar={user.aadhaar_number}
            onDone={goToList}
          />
        )}
      </div>
    </div>
  );
};

export default UpdateUser;
