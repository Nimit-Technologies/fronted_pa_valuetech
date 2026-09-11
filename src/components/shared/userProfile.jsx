import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import useSession from "@/features/auth/hooks/useSession";
import { ROLES } from "@/features/auth/constants/roles";
import useGetUserById from "@/features/superAdmin/hooks/user/useGetUserById";
import AadhaarRow from "@/components/shared/AadhaarRow";

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

const UserProfile = () => {
  const navigate = useNavigate();
  const { id: paramId } = useParams();
  const { user: sessionUser, role } = useSession();

  const routeId =
    paramId && paramId !== "undefined" && paramId !== "null" ? paramId : null;
  const canViewAnyUser = role === ROLES.SUPER_ADMIN;
  const targetId = canViewAnyUser
    ? (routeId ?? sessionUser?.id)
    : sessionUser?.id;

  const { getUserById } = useGetUserById();

  const [result, setResult] = useState({ id: null, user: null, failed: false });

  useEffect(() => {
    if (!targetId) return;

    let cancelled = false;

    (async () => {
      const res = await getUserById(targetId);
      if (cancelled) return;

      const data = res?.data ?? res ?? null;
      setResult({ id: targetId, user: data, failed: !data });
    })();

    return () => {
      cancelled = true;
    };
  }, [targetId, getUserById]);

  const settled = result.id === targetId;
  const isLoading = Boolean(targetId) && !settled;
  const notFound = !targetId || (settled && result.failed);
  const user = settled ? result.user : null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (notFound || !user) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-muted-foreground text-sm">User profile not found.</p>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    );
  }

  const isOwnProfile = targetId === sessionUser?.id;

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 w-full max-w-4xl mx-auto">
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
          {isOwnProfile ? "My Profile" : "User Profile"}
        </h1>
      </div>

      <div className="bg-card border border-border rounded-md py-6 shadow-sm">
        <div className="max-w-3xl w-full mx-auto space-y-8 px-4">
          <div className="space-y-4">
            <SectionTitle>Personal Details</SectionTitle>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <InfoRow label="Employee ID" value={user.employee_id} />
              <AadhaarRow
                maskedValue={user.aadhaar_number ?? user.adhar_number}
                employeeId={user.employee_id}
              />
              <InfoRow label="First Name" value={user.first_name} />
              <InfoRow label="Last Name" value={user.last_name} />
              <InfoRow label="Email" value={user.email} />
              <InfoRow label="Phone Number" value={user.phone} />
              <InfoRow label="Department" value={user.department?.name} />
              <InfoRow label="Role" value={user.role?.name} />
              <InfoRow label="Branch" value={user.branch?.name} />
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-muted-foreground capitalize">
                  Status
                </span>
                <span
                  className={`inline-flex w-fit items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.is_active
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {user.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <SectionTitle>Address</SectionTitle>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <InfoRow label="City" value={user.address?.city} />
              <InfoRow label="District" value={user.address?.district} />
              <InfoRow label="State" value={user.address?.state} />
              <InfoRow label="Pincode" value={user.address?.pin_code} />
              <InfoRow label="Country" value={user.address?.country} />
              <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                <InfoRow label="Lane / Street" value={user.address?.lane} />
              </div>
              <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                <InfoRow label="Landmark" value={user.address?.landmark} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
