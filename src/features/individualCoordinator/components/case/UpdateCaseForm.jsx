import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BankSelect from "@/features/individualCoordinator/components/case/BankSelect";
import useAssignCase from "@/features/individualCoordinator/hooks/case/useAssignCase";
import useUpdateCase from "@/features/individualCoordinator/hooks/case/useUpdateCase";
import { extractErrorMessage } from "@/utils/extractErrorMessage";
import { validateCaseFields } from "@/features/individualCoordinator/utils/validateCaseFields";
import { zodFieldErrors } from "@/utils/zodFieldErrors";
import EngineerDropDown from "@/components/shared/dropdown/engineerDropDown";

const RequiredLabel = ({ children, optional = false }) => (
  <label className="mb-2 flex items-center gap-0.5 text-sm font-medium capitalize text-foreground">
    {children}
    {optional ? null : (
      <span className="text-destructive text-base leading-none">*</span>
    )}
  </label>
);

const FIELD_CLASS =
  "h-11 w-full bg-background border-border text-foreground placeholder:text-muted-foreground";

// The scalars this form may edit. business_type_id is absent on purpose: a
// coordinator who moved a case to another business line would lose sight of it
// permanently, so the backend answers that with a 403 and only a branch admin
// can do it. employee_id is absent because it is not on this schema at all —
// assigning an engineer is PATCH /case/assign/:id.
const CASE_FIELDS = [
  "file_number",
  "banker_name",
  "customer_name",
  "customer_contact_number",
  "case_type",
];

const ADDRESS_FIELDS = [
  "city",
  "district",
  "state",
  "pin_code",
  "country",
  "lane",
  "landmark",
];

// Stored nulls (an address with no lane) become "" so every input stays
// controlled, and the diff below compares like with like.
const buildFormState = (caseItem) => {
  const address = caseItem.address ?? {};

  const state = {};
  for (const field of CASE_FIELDS) state[field] = caseItem[field] ?? "";
  for (const field of ADDRESS_FIELDS) state[field] = address[field] ?? "";
  return state;
};

// Only what actually changed. The update schema requires at least one field and
// rejects anything it does not declare, and sending a field the user never
// touched is not free: an unchanged business_type_id would still be a 403 for a
// coordinator, and an unchanged file_number re-runs the uniqueness check.
//
// A key left out of `address` keeps its stored value; one sent empty clears it,
// which is how an optional lane or landmark is removed.
const buildPayload = ({ form, bank, caseItem }) => {
  const payload = {};

  for (const field of CASE_FIELDS) {
    const value = form[field].trim();
    if (value !== (caseItem[field] ?? "")) payload[field] = value;
  }

  const address = {};
  for (const field of ADDRESS_FIELDS) {
    const value = form[field].trim();
    if (value !== (caseItem.address?.[field] ?? "")) address[field] = value;
  }
  if (Object.keys(address).length) payload.address = address;

  // The one relation this form may move. The case's branch follows the bank's,
  // and the backend re-derives it rather than trusting a client.
  if (bank?.id && bank.id !== caseItem.bank?.id) payload.bank_id = bank.id;

  return payload;
};

// `caseItem` is the record as GET /case/:id returns it. The page owns loading
// and not-found, and renders this only once the detail has arrived — seeding an
// edit form from the cached list row would mean the fields changing underneath
// the user when the fetch lands.
const UpdateCaseForm = ({ caseItem }) => {
  const navigate = useNavigate();
  const { assign, isAssigning } = useAssignCase();
  const { update } = useUpdateCase();

  const [form, setForm] = useState(() =>
    caseItem ? buildFormState(caseItem) : null,
  );
  const [bank, setBank] = useState(() => caseItem?.bank ?? null);
  const [assignedEngineer, setAssignedEngineer] = useState(
    () => caseItem?.employee ?? null,
  );
  const [savedEmployeeId, setSavedEmployeeId] = useState(
    () => caseItem?.employee?.employee_id ?? "",
  );
  const [assignmentError, setAssignmentError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (!caseItem || !form) {
    return (
      <div className="bg-card border border-border rounded-md py-12 shadow-sm text-center text-sm text-muted-foreground">
        Case not found.
      </div>
    );
  }

  // A closed or cancelled case is a delivered work product: the report has gone
  // to the bank, and the backend refuses an edit with a 409. Don't offer the
  // fields in the first place.
  const frozen = Boolean(caseItem.status?.is_terminal);
  const locked = frozen || submitting || isAssigning;
  const selectedEmployeeId = assignedEngineer?.employee_id ?? "";
  const assignmentChanged =
    Boolean(selectedEmployeeId) && selectedEmployeeId !== savedEmployeeId;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) =>
      prev[name] ? { ...prev, [name]: undefined } : prev,
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (locked) return;

    // The same rules the server applies, checked before the request so a
    // cleared required field or a half-typed number is answered immediately.
    // business_type_id is skipped: this form cannot change it, so it has no
    // field to show an error on.
    const invalid = validateCaseFields({
      form,
      bank,
      businessTypeId: caseItem.business_type?.id,
      skip: ["business_type_id"],
    });
    if (Object.keys(invalid).length) {
      setFieldErrors(invalid);
      return;
    }

    const payload = buildPayload({ form, bank, caseItem });

    // An empty payload is a 400 from the schema's own "provide at least one
    // field" rule, so it is worth answering here rather than by round trip.
    if (Object.keys(payload).length === 0) {
      toast("No changes to save", { duration: 2000 });
      return;
    }

    setSubmitting(true);
    setFieldErrors({});
    try {
      const result = await update(caseItem.id, payload);
      if (result.status === "unchanged") return;

      navigate(`/cordinator/case/view/${caseItem.id}`);
    } catch (err) {
      // The hook has already surfaced the message; this puts each validation
      // failure on its own field.
      setFieldErrors(zodFieldErrors(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssign = async () => {
    if (locked || !assignmentChanged) return;

    setAssignmentError("");
    try {
      const response = await assign(caseItem.id, selectedEmployeeId);
      setAssignedEngineer(response?.data?.employee ?? assignedEngineer);
      setSavedEmployeeId(selectedEmployeeId);
    } catch (err) {
      setAssignmentError(extractErrorMessage(err, "Failed to assign engineer"));
    }
  };

  const error = (key) =>
    fieldErrors[key] ? (
      <p className="mt-1 text-xs text-destructive">{fieldErrors[key]}</p>
    ) : null;

  return (
    <div className="bg-card border border-border rounded-md py-6 shadow-sm">
      <form
        id="case-form"
        onSubmit={handleSubmit}
        className="max-w-3xl w-full mx-auto space-y-8 px-4"
      >
        {frozen ? (
          <div
            role="alert"
            className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            This case is {caseItem.status?.name} and can no longer be edited.
            Ask a branch admin to reopen it first.
          </div>
        ) : null}

        <div className="space-y-4">
          <h2 className="text-base font-semibold text-foreground capitalize border-b border-border pb-2">
            Case Details
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <RequiredLabel>File Number</RequiredLabel>
              <Input
                name="file_number"
                value={form.file_number}
                onChange={handleChange}
                disabled={locked}
                className={FIELD_CLASS}
                placeholder="Enter file number"
              />
              {error("file_number")}
            </div>

            <div>
              <RequiredLabel>Banker Name</RequiredLabel>
              <Input
                name="banker_name"
                value={form.banker_name}
                onChange={handleChange}
                disabled={locked}
                className={FIELD_CLASS}
                placeholder="Enter banker name"
              />
              {error("banker_name")}
            </div>

            <div>
              <RequiredLabel>Customer Name</RequiredLabel>
              <Input
                name="customer_name"
                value={form.customer_name}
                onChange={handleChange}
                disabled={locked}
                className={FIELD_CLASS}
                placeholder="Enter customer name"
              />
              {error("customer_name")}
            </div>

            <div>
              <RequiredLabel>Customer Contact Number</RequiredLabel>
              <Input
                name="customer_contact_number"
                value={form.customer_contact_number}
                onChange={handleChange}
                disabled={locked}
                inputMode="numeric"
                maxLength={10}
                className={FIELD_CLASS}
                placeholder="10-digit mobile number"
              />
              {error("customer_contact_number")}
            </div>

            <div>
              <RequiredLabel>Case Type</RequiredLabel>
              <Input
                name="case_type"
                value={form.case_type}
                onChange={handleChange}
                disabled={locked}
                className={FIELD_CLASS}
                placeholder="Enter case type"
              />
              {error("case_type")}
            </div>

            <div>
              {/* Shown, not chosen: moving a case between business lines is a
                  branch admin's call. */}
              <RequiredLabel>Business type</RequiredLabel>
              <Input
                value={caseItem.business_type?.name || ""}
                disabled
                className={`${FIELD_CLASS} capitalize`}
              />
            </div>

            <div>
              <RequiredLabel>Bank</RequiredLabel>
              <BankSelect value={bank} onSelect={setBank} disabled={locked} />
              {error("bank_id")}
            </div>

            <div>
              {/* Follows the bank: picking a bank picks the branch. */}
              <RequiredLabel optional>Bank Branch</RequiredLabel>
              <Input
                value={bank?.bank_branch || ""}
                disabled
                className={`${FIELD_CLASS} capitalize`}
                placeholder="Follows the selected bank"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-base font-semibold text-foreground capitalize border-b border-border pb-2">
            Property Address
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <RequiredLabel>City</RequiredLabel>
              <Input
                name="city"
                value={form.city}
                onChange={handleChange}
                disabled={locked}
                className={FIELD_CLASS}
                placeholder="Enter city"
              />
              {error("address.city")}
            </div>

            <div>
              <RequiredLabel>District</RequiredLabel>
              <Input
                name="district"
                value={form.district}
                onChange={handleChange}
                disabled={locked}
                className={FIELD_CLASS}
                placeholder="Enter district"
              />
              {error("address.district")}
            </div>

            <div>
              <RequiredLabel>State</RequiredLabel>
              <Input
                name="state"
                value={form.state}
                onChange={handleChange}
                disabled={locked}
                className={FIELD_CLASS}
                placeholder="Enter state"
              />
              {error("address.state")}
            </div>

            <div>
              <RequiredLabel>Pincode</RequiredLabel>
              <Input
                name="pin_code"
                value={form.pin_code}
                onChange={handleChange}
                disabled={locked}
                inputMode="numeric"
                maxLength={6}
                className={FIELD_CLASS}
                placeholder="6-digit pin code"
              />
              {error("address.pin_code")}
            </div>

            <div>
              <RequiredLabel optional>Country</RequiredLabel>
              <Input
                name="country"
                value={form.country}
                onChange={handleChange}
                disabled={locked}
                className={FIELD_CLASS}
                placeholder="India"
              />
              {error("address.country")}
            </div>

            <div className="col-span-1 sm:col-span-2 lg:col-span-3">
              <RequiredLabel optional>Lane</RequiredLabel>
              <Input
                name="lane"
                value={form.lane}
                onChange={handleChange}
                disabled={locked}
                className={FIELD_CLASS}
                placeholder="Enter lane / street"
              />
              {error("address.lane")}
            </div>

            <div className="col-span-1 sm:col-span-2 lg:col-span-3">
              <RequiredLabel optional>Landmark</RequiredLabel>
              <Input
                name="landmark"
                value={form.landmark}
                onChange={handleChange}
                disabled={locked}
                className={FIELD_CLASS}
                placeholder="Enter landmark"
              />
              {error("address.landmark")}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-base font-semibold text-foreground capitalize border-b border-border pb-2">
            Assignments
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <RequiredLabel optional>Engineer</RequiredLabel>
              <EngineerDropDown
                placeholder="Select Engineer"
                value={assignedEngineer}
                onSelect={(engineer) => {
                  setAssignedEngineer(engineer);
                  setAssignmentError("");
                }}
                disabled={locked}
              />
            </div>
            <div>
              <RequiredLabel optional>Engineer Mobile Number</RequiredLabel>
              <Input
                value={assignedEngineer?.phone || ""}
                disabled
                className={FIELD_CLASS}
                placeholder="Not yet allocated"
              />
            </div>
          </div>
          <div className="flex flex-col items-start gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={locked || !assignmentChanged}
              onClick={handleAssign}
            >
              {isAssigning ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Assigning
                </span>
              ) : savedEmployeeId ? (
                "Reassign Engineer"
              ) : (
                "Assign Engineer"
              )}
            </Button>
            {assignmentError ? (
              <p role="alert" className="text-sm text-destructive">
                {assignmentError}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Button
            type="submit"
            className="max-w-xs w-full py-5 text-base capitalize sm:w-auto sm:px-12"
            disabled={locked}
          >
            {submitting ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving
              </span>
            ) : (
              "Update Case"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="py-5 text-base capitalize sm:px-10"
            disabled={submitting}
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UpdateCaseForm;
