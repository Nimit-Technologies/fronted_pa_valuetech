import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import useGetBankById from "@/features/branchAdmin/hooks/bank/useGetBankById";

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

const SectionTitle = ({ children }) => (
  <h2 className="text-base font-semibold text-foreground capitalize border-b border-border pb-2">
    {children}
  </h2>
);

const ViewBank = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { getBankById } = useGetBankById();

  const [fetched, setFetched] = useState({ id: null, bank: null, done: false });

  useEffect(() => {
    let cancelled = false;
    getBankById(id).then((result) => {
      if (cancelled) return;
      setFetched({ id, bank: result ?? null, done: true });
    });
    return () => {
      cancelled = true;
    };
  }, [id, getBankById]);

  const bank = fetched.id === id ? fetched.bank : null;
  const loading = !(fetched.id === id && fetched.done);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

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
          View Bank
        </h1>
      </div>

      <div className="bg-card border border-border rounded-md py-6 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 space-y-8">
          <div className="space-y-4">
            <SectionTitle>Bank Details</SectionTitle>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <InfoRow label="Bank Name" value={bank.name} />

              <InfoRow label="Display Bank Name" value={bank.displayName} />

              <InfoRow label="Bank Branch" value={bank.bankBranch} />

              <InfoRow label="Branch Code" value={bank.bankBranchCode} />

              <InfoRow label="GST Number" value={bank.gstNumber} />

              <InfoRow label="Office Branch" value={bank.branchName} />

              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-muted-foreground">
                  Status
                </span>

                <span
                  className={`inline-flex w-fit items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    bank.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {bank.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <SectionTitle>Address</SectionTitle>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <InfoRow label="City" value={bank.address.city} />

              <InfoRow label="District" value={bank.address.district} />

              <InfoRow label="State" value={bank.address.state} />

              <InfoRow label="Pin Code" value={bank.address.pinCode} />

              <InfoRow label="Country" value={bank.address.country} />

              <InfoRow label="Lane / Street" value={bank.address.lane} />

              <InfoRow label="Landmark" value={bank.address.landmark} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBank;
