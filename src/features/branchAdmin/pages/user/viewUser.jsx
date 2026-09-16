import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { userTableData } from "@/features/branchAdmin/data/user/userTable";

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

const ViewUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = userTableData.data.find((item) => item.id === id);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-muted-foreground text-sm">User not found.</p>

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
          View User
        </h1>
      </div>

      <div className="bg-card border border-border rounded-md py-6 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 space-y-8">
          {/* User Details */}
          <div className="space-y-4">
            <SectionTitle>User Details</SectionTitle>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <InfoRow label="Employee ID" value={user.employee_id} />

              <InfoRow label="First Name" value={user.first_name} />

              <InfoRow label="Last Name" value={user.last_name} />

              <InfoRow label="Email" value={user.email} />

              <InfoRow label="Phone Number" value={user.phone} />

              <InfoRow label="Aadhar Number" value={user.adhar_number} />

              <InfoRow label="Branch" value={user.branch?.name} />

              <InfoRow label="Department" value={user.department?.name} />

              <InfoRow label="Role" value={user.role?.name} />

              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-muted-foreground">
                  Status
                </span>

                <span
                  className={`inline-flex w-fit items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {user.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
          {/* Address */}
          <div className="space-y-4">
            <SectionTitle>Address</SectionTitle>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <InfoRow label="City" value={user.address?.city} />

              <InfoRow label="District" value={user.address?.district} />

              <InfoRow label="State" value={user.address?.state} />

              <InfoRow label="Pincode" value={user.address?.pin_code} />

              <InfoRow label="Country" value={user.address?.country} />

              <InfoRow label="Lane / Street" value={user.address?.lane} />

              <InfoRow label="Landmark" value={user.address?.landmark} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewUser;
