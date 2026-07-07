import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BankDropDown from "@/components/shared/dropdown/bankDropDown";
import { Input } from "@/components/ui/input";
import { caseData } from "@/features/individualCoordinator/data/case/caseTable";
import { userProfileData } from "@/data/userProfile";

const RequiredLabel = ({ children }) => (
  <label className="mb-2 flex items-center gap-0.5 text-sm font-medium capitalize text-foreground">
    {children}
    <span className="text-destructive text-base leading-none">*</span>
  </label>
);

const INITIAL_FORM = {
  file_number: "",
  banker_name: "",
  customer_name: "",
  customer_phone_number: "",
  case_type: "",
  business_type: "",
  bank: "",
  branch: "",
  city: "",
  district: "",
  state: "",
  pincode: "",
  country: "",
  lane: "",
  landmark: "",
  engineer_name: "",
  engineer_mobile_number: "",
  drafter_name: "",
  drafter_mobile_number: "",
  appraiser_name: "",
  appraiser_mobile_number: "",
};

const CreateCaseForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBankSelect = (bankName) => {
    setForm((prev) => ({ ...prev, bank: bankName }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const currentUser = userProfileData.data[0];
    const now = new Date().toISOString();
    const nextIndex = caseData.data.length + 1;

    const newCase = {
      id: `case_${String(nextIndex).padStart(4, "0")}`,
      file_number: form.file_number,
      customer_name: form.customer_name,
      customer_phone_number: form.customer_phone_number,

      branch: {
        branch_id: `branch_${String(nextIndex).padStart(3, "0")}`,
        name: form.branch,
      },

      bank: {
        bank_id: `bank_${String(nextIndex).padStart(3, "0")}`,
        display_name: form.bank,
        name: form.bank,
      },

      banker: form.banker_name,
      case_type: form.case_type,
      business_type: {
        business_type_id: `bt_${String(nextIndex).padStart(3, "0")}`,
        name: form.business_type,
      },

      address: {
        lane: form.lane,
        landmark: form.landmark,
        city: form.city,
        district: form.district,
        state: form.state,
        pin_code: form.pincode,
        country: form.country,
      },

      created_by: {
        id: currentUser.id,
        first_name: currentUser.first_name,
      },

      updated_by: [],

      engineer: {
        id: `eng_${String(nextIndex).padStart(3, "0")}`,
        name: form.engineer_name,
        phone_number: form.engineer_mobile_number,
      },

      remarks: [],

      status: "OPEN",
      created_at: now,
      updated_at: now,
      deleted_at: null,
      is_active: true,
    };

    caseData.data.push(newCase);
    caseData.meta.total_cases = caseData.data.length;

    navigate("/coordinator/case");
  };

  return (
    <div className="bg-card border border-border rounded-md py-6 shadow-sm">
      <form
        id="case-form"
        onSubmit={handleSubmit}
        className="max-w-3xl w-full mx-auto space-y-8 px-4"
      >
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
                className="h-11 w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
                placeholder="Enter file number"
              />
            </div>

            <div>
              <RequiredLabel>Banker Name</RequiredLabel>
              <Input
                name="banker_name"
                value={form.banker_name}
                onChange={handleChange}
                className="h-11 w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
                placeholder="Enter banker name"
              />
            </div>

            <div>
              <RequiredLabel>Customer Name</RequiredLabel>
              <Input
                name="customer_name"
                value={form.customer_name}
                onChange={handleChange}
                className="h-11 w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
                placeholder="Enter customer name"
              />
            </div>

            <div>
              <RequiredLabel>Customer Phone Number</RequiredLabel>
              <Input
                name="customer_phone_number"
                value={form.customer_phone_number}
                onChange={handleChange}
                className="h-11 w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
                placeholder="Enter customer phone number"
              />
            </div>

            <div>
              <RequiredLabel>Case Type</RequiredLabel>
              <Input
                name="case_type"
                value={form.case_type}
                onChange={handleChange}
                className="h-11 w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
                placeholder="Enter case type"
              />
            </div>

            <div>
              <RequiredLabel>Business type</RequiredLabel>
              <Input
                name="business_type"
                value={form.business_type}
                onChange={handleChange}
                className="h-11 w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
                placeholder="Enter business type"
              />
            </div>

            <div>
              <RequiredLabel>Bank</RequiredLabel>
              <BankDropDown value={form.bank} onSelect={handleBankSelect} />
            </div>

            <div>
              <RequiredLabel>Bank Branch</RequiredLabel>
              <Input
                name="branch"
                value={form.branch}
                onChange={handleChange}
                className="h-11 w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
                placeholder="Enter bank branch"
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

        <div className="space-y-4">
          <h2 className="text-base font-semibold text-foreground capitalize border-b border-border pb-2">
            Allocated User
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <RequiredLabel>Engineer Name</RequiredLabel>
              <Input
                name="engineer_name"
                value={form.engineer_name}
                onChange={handleChange}
                className="h-11 w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
                placeholder="Enter engineer name"
              />
            </div>
            <div>
              <RequiredLabel>Engineer Mobile Number</RequiredLabel>
              <Input
                name="engineer_mobile_number"
                value={form.engineer_mobile_number}
                onChange={handleChange}
                className="h-11 w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
                placeholder="Enter engineer mobile number"
              />
            </div>
            <div>
              <RequiredLabel>Drafter name</RequiredLabel>
              <Input
                name="drafter_name"
                value={form.drafter_name}
                onChange={handleChange}
                className="h-11 w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
                placeholder="Enter drafter name"
              />
            </div>
            <div>
              <RequiredLabel>Drafter Mobile Number</RequiredLabel>
              <Input
                name="drafter_mobile_number"
                value={form.drafter_mobile_number}
                onChange={handleChange}
                className="h-11 w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
                placeholder="Enter drafter mobile number"
              />
            </div>
            <div>
              <RequiredLabel>Appraiser name</RequiredLabel>
              <Input
                name="appraiser_name"
                value={form.appraiser_name}
                onChange={handleChange}
                className="h-11 w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
                placeholder="Enter appraiser name"
              />
            </div>
            <div>
              <RequiredLabel>Appraiser Mobile Number</RequiredLabel>
              <Input
                name="appraiser_mobile_number"
                value={form.appraiser_mobile_number}
                onChange={handleChange}
                className="h-11 w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
                placeholder="Enter appraiser mobile number"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateCaseForm;
