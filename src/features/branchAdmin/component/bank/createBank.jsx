import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import useCreateBank from "@/features/branchAdmin/hooks/bank/useCreateBank";
import { toCreateBankPayload } from "@/features/branchAdmin/services/bank/bankPayload";
import { validateBankForm } from "@/features/branchAdmin/services/bank/bankFormValidation";

const RequiredLabel = ({ children }) => (
  <label className="mb-2 flex items-center gap-0.5 text-sm font-medium capitalize text-foreground">
    {children}
    <span className="text-destructive text-base leading-none">*</span>
  </label>
);

const OptionalLabel = ({ children }) => (
  <label className="mb-2 flex items-center text-sm font-medium capitalize text-foreground">
    {children}
  </label>
);

const FieldError = ({ message }) =>
  message ? <p className="mt-1 text-xs text-destructive">{message}</p> : null;

const INITIAL_FORM = {
  name: "",
  displayName: "",
  bankBranch: "",
  bankBranchCode: "",
  gstNumber: "",

  city: "",
  district: "",
  state: "",
  pinCode: "",
  country: "India",
  lane: "",
  landmark: "",
};

const inputClass =
  "h-11 w-full bg-background border-border text-foreground placeholder:text-muted-foreground";

const CreateBank = () => {
  const navigate = useNavigate();
  const { Create } = useCreateBank();

  const branch = useSelector((state) => state.auth.user?.branch);

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!branch?.id) {
      toast.error("Your account has no branch assigned", { duration: 700 });
      return;
    }

    const validationErrors = validateBankForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      await Create(toCreateBankPayload(form, branch.id));
      navigate("/branch-admin/bank");
    } catch {
      setSubmitting(false);
    }
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
          Create Bank
        </h1>
      </div>

      <div className="bg-card border border-border rounded-md py-6 shadow-sm">
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl w-full mx-auto space-y-8 px-4"
        >
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-foreground capitalize border-b border-border pb-2">
              Bank Details
            </h2>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <RequiredLabel>Bank Name</RequiredLabel>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter bank name"
                  className={inputClass}
                />
                <FieldError message={errors.name} />
              </div>

              <div>
                <RequiredLabel>Display Bank Name</RequiredLabel>
                <Input
                  name="displayName"
                  value={form.displayName}
                  onChange={handleChange}
                  placeholder="Enter display bank name"
                  className={inputClass}
                />
                <FieldError message={errors.displayName} />
              </div>

              <div>
                <RequiredLabel>Bank Branch</RequiredLabel>
                <Input
                  name="bankBranch"
                  value={form.bankBranch}
                  onChange={handleChange}
                  placeholder="Enter bank branch"
                  className={inputClass}
                />
                <FieldError message={errors.bankBranch} />
              </div>

              <div>
                <RequiredLabel>Branch Code</RequiredLabel>
                <Input
                  name="bankBranchCode"
                  value={form.bankBranchCode}
                  onChange={handleChange}
                  placeholder="Enter branch code"
                  className={inputClass}
                />
                <FieldError message={errors.bankBranchCode} />
              </div>

              <div>
                <RequiredLabel>GST Number</RequiredLabel>
                <Input
                  name="gstNumber"
                  value={form.gstNumber}
                  onChange={handleChange}
                  placeholder="Enter GST number"
                  className={inputClass}
                />
                <FieldError message={errors.gstNumber} />
              </div>

              <div>
                <OptionalLabel>Office Branch</OptionalLabel>
                <Input
                  value={branch?.name ?? ""}
                  placeholder="No branch assigned"
                  disabled
                  readOnly
                  className={`${inputClass} capitalize`}
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
                  placeholder="Enter city"
                  className={inputClass}
                />
                <FieldError message={errors.city} />
              </div>

              <div>
                <RequiredLabel>District</RequiredLabel>
                <Input
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                  placeholder="Enter district"
                  className={inputClass}
                />
                <FieldError message={errors.district} />
              </div>

              <div>
                <RequiredLabel>State</RequiredLabel>
                <Input
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  placeholder="Enter state"
                  className={inputClass}
                />
                <FieldError message={errors.state} />
              </div>

              <div>
                <RequiredLabel>Pin Code</RequiredLabel>
                <Input
                  name="pinCode"
                  value={form.pinCode}
                  onChange={handleChange}
                  placeholder="Enter 6 digit pin code"
                  inputMode="numeric"
                  maxLength={6}
                  className={inputClass}
                />
                <FieldError message={errors.pinCode} />
              </div>

              <div>
                <RequiredLabel>Country</RequiredLabel>
                <Input
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  placeholder="Enter country"
                  className={inputClass}
                />
                <FieldError message={errors.country} />
              </div>

              <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                <OptionalLabel>Lane</OptionalLabel>
                <Input
                  name="lane"
                  value={form.lane}
                  onChange={handleChange}
                  placeholder="Enter lane / street"
                  className={inputClass}
                />
                <FieldError message={errors.lane} />
              </div>

              <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                <OptionalLabel>Landmark</OptionalLabel>
                <Input
                  name="landmark"
                  value={form.landmark}
                  onChange={handleChange}
                  placeholder="Enter landmark"
                  className={inputClass}
                />
                <FieldError message={errors.landmark} />
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-2 pb-6">
            <Button
              type="submit"
              disabled={submitting}
              className="max-w-xs w-full py-5 text-base capitalize"
            >
              {submitting ? "Creating..." : "Create Bank"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBank;
