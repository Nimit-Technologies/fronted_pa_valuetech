import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useSession from "@/features/auth/hooks/useSession";
import useGetUserById from "@/features/superAdmin/hooks/user/useGetUserById";
import useUpdateProfile from "@/features/user/hooks/useUpdateProfile";

const FieldLabel = ({ htmlFor, required = false, children }) => (
  <Label htmlFor={htmlFor} className="mb-1.5 text-foreground">
    {children}
    {required ? <span className="ml-1 text-destructive">*</span> : null}
  </Label>
);

const InfoRow = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs font-medium text-muted-foreground capitalize">
      {label}
    </span>
    <span className="text-sm font-medium text-foreground capitalize">
      {value || "—"}
    </span>
  </div>
);

const INPUT_CLASS =
  "h-11 w-full bg-background border-border text-foreground placeholder:text-muted-foreground";

// Flattens an API user row into the form's field names; the service turns it
// back into the backend's snake_case self-service payload on submit. Only
// fields PUT /user/profile actually accepts get a form field — employee_id,
// branch, department, role and status are shown read-only below instead.
const toForm = (user) => ({
  firstName: user.first_name ?? "",
  lastName: user.last_name ?? "",
  email: user.email ?? "",
  phone: user.phone ?? "",
  // Responses only carry the masked Aadhaar (XXXXXXXX1234); the field starts
  // empty and is sent only when a new 12-digit number is typed.
  aadharNumber: "",
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
  if (!form.city.trim()) return "City is required.";
  if (!form.district.trim()) return "District is required.";
  if (!form.state.trim()) return "State is required.";
  if (!/^\d{6}$/.test(form.pincode)) return "Pincode must be 6 digits.";
  return "";
};

// Separate from the page so its state initialises from a user that has
// already loaded.
const ManageUserForm = ({ user, maskedAadhaar, onDone }) => {
  const { update } = useUpdateProfile();
  const [form, setForm] = useState(() => toForm(user));
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

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
          Personal Details
        </h2>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <InfoRow label="Employee ID" value={user.employee_id} />
          <InfoRow label="Branch" value={user.branch?.name} />
          <InfoRow label="Department" value={user.department?.name} />
          <InfoRow label="Role" value={user.role?.name} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
              Saving…
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
};

const ManageUser = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user: sessionUser } = useSession();
  const { getUserById } = useGetUserById();

  const basePath = pathname.startsWith("/coordinator")
    ? "/coordinator"
    : pathname.startsWith("/engineer")
      ? "/engineer"
      : pathname.startsWith("/branch-admin")
        ? "/branch-admin"
        : "/super-admin";

  const sessionUserId = sessionUser?.id;
  const [result, setResult] = useState({ id: null, user: null, failed: false });

  useEffect(() => {
    if (!sessionUserId) return;

    let cancelled = false;

    (async () => {
      const res = await getUserById(sessionUserId);
      if (cancelled) return;

      const data = res?.data ?? res ?? null;
      setResult({ id: sessionUserId, user: data, failed: !data });
    })();

    return () => {
      cancelled = true;
    };
  }, [sessionUserId, getUserById]);

  const settled = result.id === sessionUserId;
  const isLoading = Boolean(sessionUserId) && !settled;
  const notFound = !sessionUserId || (settled && result.failed);
  const user = settled ? result.user : null;

  const goToProfile = () => navigate(`${basePath}/user-profile`);

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
        <h1 className="text-lg font-semibold text-foreground">
          Manage My Profile
        </h1>
      </div>

      <div className="bg-card border border-border rounded-md py-6 shadow-sm">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading profile…
          </div>
        ) : notFound || !user ? (
          <div className="flex flex-col items-center justify-center gap-4 py-16">
            <p className="text-sm text-muted-foreground">
              Unable to load your profile.
            </p>
            <Button variant="outline" onClick={() => navigate(-1)}>
              Go Back
            </Button>
          </div>
        ) : (
          <ManageUserForm
            key={user.id}
            user={user}
            maskedAadhaar={user.aadhaar_number}
            onDone={goToProfile}
          />
        )}
      </div>
    </div>
  );
};

export default ManageUser;
