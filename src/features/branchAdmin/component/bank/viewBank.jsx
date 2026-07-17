import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { bankData } from "../../data/bank/bankTable";

const InfoRow = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs font-medium text-muted-foreground capitalize">
      {label}
    </span>

    <span className="text-sm font-medium text-foreground">{value || "—"}</span>
  </div>
);

const SectionTitle = ({ children }) => (
  <h2 className="text-base font-semibold text-foreground capitalize border-b border-border pb-2">
    {children}
  </h2>
);

const ViewBank = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const bank = bankData.data.find((item) => item.id === id);

  if (!bank) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-muted-foreground text-sm">Bank not found.</p>

        <Button variant="outline" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon-sm"
          className="h-8 w-8"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} />
        </Button>

        <h1 className="text-lg font-semibold text-foreground capitalize">
          View Bank
        </h1>
      </div>

      {/* Card */}
      <div className="bg-card border border-border rounded-md py-6 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 space-y-8">
          {/* Bank Details */}
          <div className="space-y-4">
            <SectionTitle>Bank Details</SectionTitle>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <InfoRow label="Bank Name" value={bank.bank_name} />

              <InfoRow label="Branch" value={bank.branch} />

              <InfoRow label="Branch Code" value={bank.branch_code} />

              <InfoRow label="GST Number" value={bank.gst} />

              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-muted-foreground">
                  Status
                </span>

                <span
                  className={`inline-flex w-fit items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    bank.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {bank.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-4">
            <SectionTitle>Address</SectionTitle>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <InfoRow label="City" value={bank.city} />

              <InfoRow label="District" value={bank.district} />

              <InfoRow label="State" value={bank.state} />

              <InfoRow label="Pincode" value={bank.pincode} />

              <InfoRow label="Country" value={bank.country} />
              <InfoRow label="Lane / Street" value={bank.lane} />
              <InfoRow label="Landmark" value={bank.landmark} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBank;
