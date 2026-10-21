import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BankSelect from "@/features/individualCoordinator/components/case/BankSelect";
import SimilarCasesTable from "@/components/shared/case/similarCasesTable";
import useCreateCase from "@/features/individualCoordinator/hooks/case/useCreateCase";
import useSimilarCases from "@/features/individualCoordinator/hooks/case/useSimilarCases";
import useMyBusinessType from "@/features/individualCoordinator/hooks/businessType/useMyBusinessType";
import useSessionDraft from "@/hooks/draft/useSessionDraft";
import { validateCaseFields } from "@/features/individualCoordinator/utils/validateCaseFields";
import { zodFieldErrors } from "@/utils/zodFieldErrors";

const RequiredLabel = ({ children, optional = false }) => (
  <label className="mb-2 flex items-center gap-0.5 text-sm font-medium capitalize text-foreground">
    {children}
    {optional ? null : (
      <span className="text-destructive text-base leading-none">*</span>
    )}
  </label>
);

const INITIAL_FORM = {
  file_number: "",
  banker_name: "",
  customer_name: "",
  customer_contact_number: "",
  case_type: "",
  city: "",
  district: "",
  state: "",
  pin_code: "",
  country: "India",
  lane: "",
  landmark: "",
};

const DRAFT_KEYS = {
  form: "coordinator:create-case:form",
  bank: "coordinator:create-case:bank",
  duplicates: "coordinator:create-case:duplicates",
};

const reviveForm = (stored) => {
  if (!stored || typeof stored !== "object") return undefined;

  return Object.keys(INITIAL_FORM).reduce((acc, key) => {
    acc[key] =
      typeof stored[key] === "string" ? stored[key] : INITIAL_FORM[key];
    return acc;
  }, {});
};

const reviveBank = (stored) =>
  stored && typeof stored === "object" && stored.id ? stored : undefined;

const buildAddress = (form) => {
  const address = {
    city: form.city.trim(),
    district: form.district.trim(),
    state: form.state.trim(),
    pin_code: form.pin_code.trim(),
  };
  if (form.country.trim()) address.country = form.country.trim();
  if (form.lane.trim()) address.lane = form.lane.trim();
  if (form.landmark.trim()) address.landmark = form.landmark.trim();

  return address;
};

const buildPayload = ({ form, bank, businessTypeId, confirmDuplicate }) => {
  const address = buildAddress(form);

  return {
    file_number: form.file_number.trim(),
    banker_name: form.banker_name.trim(),
    customer_name: form.customer_name.trim(),
    customer_contact_number: form.customer_contact_number.trim(),
    case_type: form.case_type.trim(),
    business_type_id: businessTypeId ?? "",
    bank_id: bank?.id ?? "",
    address,
    ...(confirmDuplicate ? { confirm_duplicate: true } : {}),
  };
};

const FIELD_CLASS =
  "h-11 w-full bg-background border-border text-foreground placeholder:text-muted-foreground";

const CreateCaseForm = () => {
  const navigate = useNavigate();
  const { create } = useCreateCase();
  const { businessTypeId, name: businessTypeName } = useMyBusinessType();
  // Opened when the backend holds the create back over possible duplicates.
  // The same payload is then resubmitted with confirm_duplicate; the hook owns
  // the matches themselves and pages them on demand.
  const {
    review: duplicates,
    loadingMore,
    open: openReview,
    dismiss: dismissReview,
    loadMore,
  } = useSimilarCases({ draftKey: DRAFT_KEYS.duplicates });

  const [form, setForm, clearFormDraft] = useSessionDraft(
    DRAFT_KEYS.form,
    INITIAL_FORM,
    reviveForm,
  );
  const [bank, setBank, clearBankDraft] = useSessionDraft(
    DRAFT_KEYS.bank,
    null,
    reviveBank,
  );
  // Field errors and the in-flight flag are deliberately not drafted: they
  // describe one attempt, not what the user typed.
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const discardDraft = useCallback(() => {
    clearFormDraft();
    clearBankDraft();
    dismissReview();
  }, [clearFormDraft, clearBankDraft, dismissReview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) =>
      prev[name] ? { ...prev, [name]: undefined } : prev,
    );
  };

  const submit = async (confirmDuplicate) => {
    // Checked here as well as on the server: a required field left blank or a
    // half-typed phone number is a 400 the user can be told about without a
    // round trip, and the messages match the ones the API would have sent.
    const invalid = validateCaseFields({ form, bank, businessTypeId });
    if (Object.keys(invalid).length) {
      setFieldErrors(invalid);
      return;
    }

    setSubmitting(true);
    setFieldErrors({});
    try {
      const result = await create(
        buildPayload({ form, bank, businessTypeId, confirmDuplicate }),
      );

      if (result.status === "duplicate") {
        // The query is snapshotted alongside the matches: paging them is by
        // offset into one ranked result set, so later pages have to be asked
        // for with the values that produced the first one, not with whatever
        // the form holds by then.
        openReview(result, {
          customerContactNumber: form.customer_contact_number.trim(),
          address: buildAddress(form),
        });
        return;
      }

      // The case exists now, so the draft has done its job. This is the only
      // path that throws the input away on its own.
      discardDraft();
      navigate("/cordinator/case");
    } catch (err) {
      // The hook has already surfaced the message; this puts each validation
      // failure on its own field.
      setFieldErrors(zodFieldErrors(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitting) return;
    submit(false);
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
        {!businessTypeId ? (
          <div
            role="alert"
            className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            Your account has no business type set, so a case cannot be filed
            under it. Ask an administrator to assign one.
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
                className={FIELD_CLASS}
                placeholder="Enter case type"
              />
              {error("case_type")}
            </div>

            <div>
              {/* A coordinator handles exactly one business line, and the
                  backend refuses a case filed under any other, so this is
                  shown rather than chosen. */}
              <RequiredLabel>Business type</RequiredLabel>
              <Input
                value={businessTypeName || businessTypeId || ""}
                disabled
                className={`${FIELD_CLASS} capitalize`}
              />
              {error("business_type_id")}
            </div>

            <div>
              <RequiredLabel>Bank</RequiredLabel>
              <BankSelect value={bank} onSelect={setBank} />
              {error("bank_id")}
            </div>

            <div>
              {/* The case's branch follows the bank's, which is why this is
                  read-only: picking a bank picks the branch. */}
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
                inputMode="numeric"
                maxLength={6}
                className={FIELD_CLASS}
                placeholder="6-digit pin code"
              />
              {error("address.pin_code")}
            </div>

            <div>
              <RequiredLabel>Country</RequiredLabel>
              <Input
                name="country"
                value={form.country}
                onChange={handleChange}
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
                className={FIELD_CLASS}
                placeholder="Enter landmark"
              />
              {error("address.landmark")}
            </div>
          </div>
        </div>

        {/* The one advisory refusal: an existing case shares the customer's
            number or reads like the same property. The matches are named by
            file number and business line only — a case in another business
            line is not this coordinator's to read past that. */}
        {duplicates ? (
          <div
            role="alert"
            className="space-y-3 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-100"
          >
            <p className="font-medium">
              {duplicates.message || "Similar cases already exist."}
            </p>

            <SimilarCasesTable
              cases={duplicates.cases}
              hasNextPage={duplicates.hasNextPage}
              loadingMore={loadingMore}
              onLoadMore={loadMore}
            />

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={submitting}
                onClick={() => submit(true)}
              >
                Create anyway
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={submitting}
                onClick={dismissReview}
              >
                Let me check
              </Button>
            </div>
          </div>
        ) : null}

        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Button
            type="submit"
            className="max-w-xs w-full py-5 text-base capitalize sm:w-auto sm:px-12"
            disabled={submitting || !businessTypeId}
          >
            {submitting ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating
              </span>
            ) : (
              "Create Case"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="py-5 text-base capitalize sm:px-10"
            disabled={submitting}
            // Cancel is the user saying they do not want this case, so the
            // draft goes with it. Every other way off this page — the sidebar,
            // a duplicate's View link — keeps it.
            onClick={() => {
              discardDraft();
              navigate("/cordinator/case");
            }}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateCaseForm;
