import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { bankData } from "@/features/branchAdmin/data/bank/bankTable";

const RequiredLabel = ({ children }) => (
  <label className="mb-2 flex items-center gap-0.5 text-sm font-medium capitalize text-foreground">
    {children}
    <span className="text-destructive text-base leading-none">*</span>
  </label>
);

const UpdateBank = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const bank = bankData.data.find((item) => item.id === id);

  const [form, setForm] = useState({
    bankName: bank?.bank_name ?? "",
    branch: bank?.branch ?? "",
    branchCode: bank?.branch_code ?? "",
    gst: bank?.gst ?? "",
    status: bank?.status ?? "",

    city: bank?.city ?? "",
    district: bank?.district ?? "",
    state: bank?.state ?? "",
    pincode: bank?.pincode ?? "",
    country: bank?.country ?? "",
    lane: bank?.lane ?? "",
    landmark: bank?.landmark ?? "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Updated Bank :", id, form);
  };

  if (!bank) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-muted-foreground">Bank not found.</p>

        <Button variant="outline" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 w-full max-w-6xl mx-auto">
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

        <h1 className="text-lg font-semibold">Update Bank</h1>
      </div>

      {/* Card */}
      <div className="bg-card border border-border rounded-md py-6 shadow-sm">
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl w-full mx-auto space-y-8 px-4"
        >
          {/* Bank Details */}
          <div className="space-y-4">
            <h2 className="text-base font-semibold border-b border-border pb-2">
              Bank Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <RequiredLabel>Bank Name</RequiredLabel>

                <Input
                  name="bankName"
                  value={form.bankName}
                  onChange={handleChange}
                  placeholder="Enter Bank Name"
                  className="h-11"
                  className="h-11 bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <RequiredLabel>Branch</RequiredLabel>

                <Input
                  name="branch"
                  value={form.branch}
                  onChange={handleChange}
                  placeholder="Enter Branch"
                  className="h-11"
                  className="h-11 bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <RequiredLabel>Branch Code</RequiredLabel>

                <Input
                  name="branchCode"
                  value={form.branchCode}
                  onChange={handleChange}
                  placeholder="Enter Branch Code"
                  className="h-11"
                  className="h-11 bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <RequiredLabel>GST Number</RequiredLabel>

                <Input
                  name="gst"
                  value={form.gst}
                  onChange={handleChange}
                  placeholder="Enter GST Number"
                  className="h-11"
                  className="h-11 bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <RequiredLabel>Status</RequiredLabel>

                <Input
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  placeholder="Active / Inactive"
                  className="h-11"
                  className="h-11 bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-4">
            <h2 className="text-base font-semibold border-b border-border pb-2">
              Address
            </h2>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <RequiredLabel>City</RequiredLabel>

                <Input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Enter City"
                  className="h-11"
                  className="h-11 bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <RequiredLabel>District</RequiredLabel>

                <Input
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                  placeholder="Enter District"
                  className="h-11"
                  className="h-11 bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <RequiredLabel>State</RequiredLabel>

                <Input
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  placeholder="Enter State"
                  className="h-11"
                  className="h-11 bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <RequiredLabel>Pincode</RequiredLabel>

                <Input
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  placeholder="Enter Pincode"
                  className="h-11"
                  className="h-11 bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <RequiredLabel>Country</RequiredLabel>

                <Input
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  placeholder="Enter Country"
                  className="h-11"
                  className="h-11 bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                <RequiredLabel>Lane</RequiredLabel>

                <Input
                  name="lane"
                  value={form.lane}
                  onChange={handleChange}
                  placeholder="Enter Lane"
                  className="h-11"
                  className="h-11 bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                <RequiredLabel>Landmark</RequiredLabel>

                <Input
                  name="landmark"
                  value={form.landmark}
                  onChange={handleChange}
                  placeholder="Enter Landmark"
                  className="h-11"
                  className="h-11 bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>
          </div>

          {/* Button */}
          <div className="flex justify-center pt-2 pb-6">
            <Button type="submit" className="max-w-xs w-full py-5 text-base">
              Update Bank
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateBank;
