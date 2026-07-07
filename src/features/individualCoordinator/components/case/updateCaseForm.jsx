import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

const buildFormState = (caseItem) => {
  const address = caseItem.address ?? {};
  const engineer = caseItem.engineer ?? {};

  return {
    file_number: caseItem.file_number || "",
    banker_name: caseItem.banker || "",
    customer_name: caseItem.customer_name || "",
    customer_phone_number: caseItem.customer_phone_number || "",
    case_type: caseItem.case_type || "",
    business_type: caseItem.business_type?.name || "",
    bank: caseItem.bank?.display_name || caseItem.bank?.name || "",
    branch: caseItem.branch?.name || "",
    city: address.city || "",
    district: address.district || "",
    state: address.state || "",
    pincode: address.pin_code || "",
    country: address.country || "",
    lane: address.lane || "",
    landmark: address.landmark || "",
    engineer_name: engineer.name || "",
    engineer_mobile_number: engineer.phone_number || "",
  };
};

const UpdateCaseForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const caseIndex = caseData.data.findIndex((c) => c.id === id);
  const caseItem = caseData.data[caseIndex];

  const [form, setForm] = useState(() =>
    caseItem ? buildFormState(caseItem) : null,
  );

  if (!caseItem || !form) {
    return (
      <div className="bg-card border border-border rounded-md py-12 shadow-sm text-center text-sm text-muted-foreground">
        Case not found.
      </div>
    );
  }

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

    caseData.data[caseIndex] = {
      ...caseItem,
      file_number: form.file_number,
      customer_name: form.customer_name,
      customer_phone_number: form.customer_phone_number,
      banker: form.banker_name,
      case_type: form.case_type,
      business_type: {
        ...caseItem.business_type,
        name: form.business_type,
      },
      bank: {
        ...caseItem.bank,
        display_name: form.bank,
        name: form.bank,
      },
      branch: {
        ...caseItem.branch,
        name: form.branch,
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
      engineer: {
        ...caseItem.engineer,
        name: form.engineer_name,
        phone_number: form.engineer_mobile_number,
      },
      updated_by: [
        ...(caseItem.updated_by || []),
        {
          id: currentUser.id,
          first_name: currentUser.first_name,
          timestamp: now,
        },
      ],
      updated_at: now,
    };

    navigate(`/coordinator/case/view/${id}`);
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
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateCaseForm;
