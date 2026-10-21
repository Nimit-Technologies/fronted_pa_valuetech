import React from "react";
import BankDropDown from "@/components/shared/dropdown/engineerDropDown";
import { Input } from "@/components/ui/input";

const RequiredLabel = ({ children }) => (
  <label className="mb-2 flex items-center gap-0.5 text-sm font-medium capitalize text-foreground">
    {children}
    <span className="text-destructive text-base leading-none">*</span>
  </label>
);

const ReadOnlyField = ({ label, value, className = "" }) => (
  <div className={className}>
    <RequiredLabel>{label}</RequiredLabel>
    <Input
      value={value || ""}
      disabled
      className="h-11 w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
    />
  </div>
);

// `caseItem` is the record as GET /case/:id returns it (or the matching row
// from the list page's store, which carries the same fields bar remarks and
// update_history). The page owns loading and not-found; by the time this
// renders there is a case to show.
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
            <ReadOnlyField label="File Number" value={caseItem.file_number} />
            <ReadOnlyField label="Banker Name" value={caseItem.banker_name} />
            <ReadOnlyField
              label="Customer Name"
              value={caseItem.customer_name}
            />
            <ReadOnlyField
              label="Customer Contact Number"
              value={caseItem.customer_contact_number}
            />
            <ReadOnlyField label="Case Type" value={caseItem.case_type} />
            <ReadOnlyField
              label="Business type"
              value={caseItem.business_type?.name}
            />

            <div>
              <RequiredLabel>Bank</RequiredLabel>
              <BankDropDown
                value={caseItem.bank?.display_name || caseItem.bank?.name}
                disabled
              />
            </div>

            {/* The bank's own branch, not the valuer's branch. */}
            <ReadOnlyField
              label="Bank Branch"
              value={caseItem.bank?.bank_branch}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-base font-semibold text-foreground capitalize border-b border-border pb-2">
            Address
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <ReadOnlyField label="City" value={address.city} />
            <ReadOnlyField label="District" value={address.district} />
            <ReadOnlyField label="State" value={address.state} />
            <ReadOnlyField label="Pincode" value={address.pin_code} />
            <ReadOnlyField label="Country" value={address.country} />
            <ReadOnlyField
              label="Lane"
              value={address.lane}
              className="col-span-1 sm:col-span-2 lg:col-span-3"
            />
            <ReadOnlyField
              label="Landmark"
              value={address.landmark}
              className="col-span-1 sm:col-span-2 lg:col-span-3"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-base font-semibold text-foreground capitalize border-b border-border pb-2">
            Allocated User
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* A case can sit unassigned (status "open"), so these are blank
                until an engineer is allocated. */}
            <ReadOnlyField label="Engineer Name" value={engineerName} />
            <ReadOnlyField
              label="Engineer Mobile Number"
              value={engineer.phone}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default ViewCaseForm;
