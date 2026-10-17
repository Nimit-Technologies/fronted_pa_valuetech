import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { ArrowLeft, Eye, EyeOff, Loader2, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import useGetUserById from "@/features/superAdmin/hooks/user/useGetUserById";
import useGetAadhaarByEmployeeId from "@/features/superAdmin/hooks/user/useGetAadhaarByEmployeeId";

const InfoRow = ({ label, value, className = "capitalize" }) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs font-medium text-muted-foreground">{label}</span>
    <span className={`text-sm font-medium text-foreground ${className}`}>
      {value || "N/A"}
    </span>
  </div>
);

const SectionTitle = ({ children }) => (
  <h2 className="text-base font-semibold text-foreground border-b border-border pb-2">
    {children}
  </h2>
);

// Responses only ever carry the last four digits. The full number comes from
// a separate admin-only endpoint that audit-logs every reveal, so it is
// fetched on demand and never kept in the store.
const AadhaarRow = ({ maskedValue, employeeId }) => {
  const { getAadhaarByEmployeeId } = useGetAadhaarByEmployeeId();
  const [revealed, setRevealed] = useState("");
  const [busy, setBusy] = useState(false);

  const toggle = async () => {
    if (revealed) {
      setRevealed("");
      return;
    }
    setBusy(true);
    const response = await getAadhaarByEmployeeId(employeeId);
    setBusy(false);
    if (response?.data?.aadhaar_number) {
      setRevealed(response.data.aadhaar_number);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-muted-foreground">
        Aadhaar Number
      </span>
      <span className="flex items-center gap-2 text-sm font-medium text-foreground">
        <span className="font-mono">{revealed || maskedValue || "N/A"}</span>
        {maskedValue ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            title={revealed ? "Hide" : "Reveal (audit-logged)"}
            onClick={toggle}
            disabled={busy}
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : revealed ? (
              <EyeOff size={14} />
            ) : (
              <Eye size={14} />
            )}
          </Button>
        ) : null}
      </span>
    </div>
  );
};

const ViewUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getUserById } = useGetUserById();

  // The row from the list is shown immediately if we came from there; the
  // authoritative record is fetched so a deep link or refresh also works.
  const cachedUser = useSelector((state) =>
    (state.user.userData || []).find((item) => item.id === id),
  );
  const [fetched, setFetched] = useState({ id: null, user: null, done: false });

  useEffect(() => {
    let cancelled = false;
    getUserById(id).then((response) => {
      if (cancelled) return;
      setFetched({ id, user: response?.data ?? null, done: true });
    });
    return () => {
      cancelled = true;
    };
  }, [id, getUserById]);

  const user = fetched.id === id && fetched.user ? fetched.user : cachedUser;
  const loading = !user && !(fetched.id === id && fetched.done);

  // The list page lives two path segments up (/…/user/view/:id -> /…/user).
  const goToList = () => navigate("../..", { relative: "path" });

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="h-8 w-8"
            onClick={goToList}
          >
            <ArrowLeft size={16} />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">View User</h1>
        </div>
        {user && !user.is_deleted ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() =>
              navigate(`../../update/${user.id}`, { relative: "path" })
            }
          >
            <Pencil size={14} />
            Edit
          </Button>
        ) : null}
      </div>

      <div className="bg-card border border-border rounded-md py-6 shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading user…
          </div>
        ) : !user ? (
          <div className="flex flex-col items-center justify-center gap-4 py-16">
            <p className="text-sm text-muted-foreground">User not found.</p>
            <Button variant="outline" onClick={goToList}>
              Back to users
            </Button>
          </div>
        ) : (
          <div className="max-w-3xl w-full mx-auto space-y-8 px-4">
            <section className="space-y-4">
              <SectionTitle>Employee Details</SectionTitle>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <InfoRow
                  label="Employee ID"
                  value={user.employee_id}
                  className="uppercase"
                />
                <AadhaarRow
                  maskedValue={user.aadhaar_number}
                  employeeId={user.employee_id}
                />
                <InfoRow label="First Name" value={user.first_name} />
                <InfoRow label="Last Name" value={user.last_name} />
                <InfoRow label="Email" value={user.email} className="" />
                <InfoRow label="Phone" value={user.phone} className="" />
                <InfoRow label="Branch" value={user.branch?.name} />
                <InfoRow label="Department" value={user.department?.name} />
                <InfoRow label="Role" value={user.role?.name} />
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-muted-foreground">
                    Status
                  </span>
                  {user.is_deleted ? (
                    <span className="inline-flex w-fit items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                      Deleted
                    </span>
                  ) : (
                    <span
                      className={`inline-flex w-fit items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {user.is_active ? "Active" : "Inactive"}
                    </span>
                  )}
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <SectionTitle>Address</SectionTitle>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <InfoRow label="City" value={user.address?.city} />
                <InfoRow label="District" value={user.address?.district} />
                <InfoRow label="State" value={user.address?.state} />
                <InfoRow
                  label="Pincode"
                  value={user.address?.pin_code}
                  className=""
                />
                <InfoRow label="Country" value={user.address?.country} />
                <div className="sm:col-span-2 lg:col-span-3">
                  <InfoRow label="Lane / Street" value={user.address?.lane} />
                </div>
                <div className="sm:col-span-2 lg:col-span-3">
                  <InfoRow label="Landmark" value={user.address?.landmark} />
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewUser;
