import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { branchAdminData } from "../../data/branch_admin/branchAdminTable"

const InfoRow = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs font-medium text-muted-foreground capitalize">{label}</span>
    <span className="text-sm font-medium text-foreground capitalize">{value || "—"}</span>
  </div>
)

const SectionTitle = ({ children }) => (
  <h2 className="text-base font-semibold text-foreground capitalize border-b border-border pb-2">
    {children}
  </h2>
)

const ViewBranchAdmin = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const admin = branchAdminData.data.find((a) => a.id === id)

  if (!admin) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-muted-foreground text-sm">Branch admin not found.</p>
        <Button variant="outline" onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    )
  }

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
        <h1 className="text-lg font-semibold text-foreground capitalize">View Branch Admin</h1>
      </div>

      <div className="bg-card border border-border rounded-md py-6 shadow-sm">
        <div className="max-w-3xl w-full mx-auto space-y-8 px-4">

          <div className="space-y-4">
            <SectionTitle>Employee Details</SectionTitle>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <InfoRow label="Employee ID" value={admin.employee_id} />
              <InfoRow label="Aadhaar Number" value={admin.adhar_number} />
              <InfoRow label="First Name" value={admin.first_name} />
              <InfoRow label="Last Name" value={admin.last_name} />
              <InfoRow label="Email" value={admin.email} />
              <InfoRow label="Phone Number" value={admin.phone} />
              <InfoRow label="Department" value={admin.department?.name} />
              <InfoRow label="Role" value={admin.role?.name} />
              <InfoRow label="Branch" value={admin.branch?.name} />
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-muted-foreground capitalize">Status</span>
                <span
                  className={`inline-flex w-fit items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    admin.is_active
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {admin.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <SectionTitle>Address</SectionTitle>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <InfoRow label="City" value={admin.address?.city} />
              <InfoRow label="District" value={admin.address?.district} />
              <InfoRow label="State" value={admin.address?.state} />
              <InfoRow label="Pincode" value={admin.address?.pin_code} />
              <InfoRow label="Country" value={admin.address?.country} />
              <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                <InfoRow label="Lane / Street" value={admin.address?.lane} />
              </div>
              <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                <InfoRow label="Landmark" value={admin.address?.landmark} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ViewBranchAdmin
