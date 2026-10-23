import React from "react";
import { Input } from "@/components/ui/input";

const RequiredLabel = ({ children }) => (
  <label className="mb-2 flex items-center gap-0.5 text-sm font-medium capitalize text-foreground">
    {children}
    <span className="text-destructive text-base leading-none">*</span>
  </label>
);

const ViewCaseForm = ({ caseItem }) => {
  if (!caseItem) {
    return (
      <div className="bg-card border border-border rounded-md py-12 shadow-sm text-center text-sm text-muted-foreground">
        Case not found.
      </div>
    );
  }

  const address = caseItem.address ?? {};
  const engineer = caseItem.employee ?? {};
  const engineerName =
    `${engineer.first_name ?? ""} ${engineer.last_name ?? ""}`.trim();

  return (
    <div className="bg-card border border-border rounded-md py-6 shadow-sm">
      <form id="case-form" className="max-w-3xl w-full mx-auto space-y-8 px-4">
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-foreground capitalize border-b border-border pb-2">
            Case Details
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <RequiredLabel>File Number</RequiredLabel>
              <Input
                value={caseItem.file_number || ""}
                disabled
                className="h-11 w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <RequiredLabel>Customer Name</RequiredLabel>
              <Input
                value={caseItem.customer_name || ""}
                disabled
                className="h-11 w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <RequiredLabel>Customer Contact Number</RequiredLabel>
              <Input
                value={caseItem.customer_contact_number || ""}
                disabled
                className="h-11 w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <RequiredLabel>Case Type</RequiredLabel>
              <Input
                value={caseItem.case_type || ""}
                disabled
                className="h-11 w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <RequiredLabel>Bank</RequiredLabel>
              <Input
                value={caseItem.bank?.display_name || caseItem.bank?.name || ""}
                disabled
                className="h-11 w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
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
                value={address.city || ""}
                disabled
                className="h-11 w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <RequiredLabel>District</RequiredLabel>
              <Input
                value={address.district || ""}
                disabled
                className="h-11 w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <RequiredLabel>State</RequiredLabel>
              <Input
                value={address.state || ""}
                disabled
                className="h-11 w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <RequiredLabel>Pincode</RequiredLabel>
              <Input
                value={address.pin_code || ""}
                disabled
                className="h-11 w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <RequiredLabel>Country</RequiredLabel>
              <Input
                value={address.country || ""}
                disabled
                className="h-11 w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="col-span-1 sm:col-span-2 lg:col-span-3">
              <RequiredLabel>Lane</RequiredLabel>
              <Input
                value={address.lane || ""}
                disabled
                className="h-11 w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="col-span-1 sm:col-span-2 lg:col-span-3">
              <RequiredLabel>Landmark</RequiredLabel>
              <Input
                value={address.landmark || ""}
                disabled
                className="h-11 w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-base font-semibold text-foreground capitalize border-b border-border pb-2">
            Assigned Engineer
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <RequiredLabel>Engineer Name</RequiredLabel>
              <Input
                value={engineerName}
                disabled
                className="h-11 w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div>
              <RequiredLabel>Engineer Contact Number</RequiredLabel>
              <Input
                value={engineer.phone || ""}
                disabled
                className="h-11 w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ViewCaseForm;
