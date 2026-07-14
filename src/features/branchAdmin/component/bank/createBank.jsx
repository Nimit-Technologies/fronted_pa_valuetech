import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const RequiredLabel = ({ children }) => (
  <label className="mb-2 flex items-center gap-0.5 text-sm font-medium capitalize text-foreground">
    {children}
    <span className="text-destructive text-base leading-none">*</span>
  </label>
);

const CreateBank = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    bankName: "",
    branch: "",
    branchCode: "",
    gst: "",
    status: "",

    city: "",
    district: "",
    state: "",
    pincode: "",
    country: "",
    lane: "",
    landmark: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(form);
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 w-full max-w-6xl mx-auto">
      {/* Header */}
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
          Create Bank
        </h1>
      </div>

      {/* Form Card */}
      <div className="bg-card border border-border rounded-md py-6 shadow-sm">
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl w-full mx-auto space-y-8 px-4"
        >
          {/* Bank Details */}
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-foreground capitalize border-b border-border pb-2">
              Bank Details
            </h2>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Bank Name */}
              <div>
                <RequiredLabel>Bank Name</RequiredLabel>

                <Input
                  name="bankName"
                  value={form.bankName}
                  onChange={handleChange}
                  placeholder="Enter bank name"
                  className="h-11 w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              {/* Branch */}
              <div>
                <RequiredLabel>Branch</RequiredLabel>

                <Input
                  name="branch"
                  value={form.branch}
                  onChange={handleChange}
                  placeholder="Enter branch name"
                  className="h-11 w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              {/* Branch Code */}
              <div>
                <RequiredLabel>Branch Code</RequiredLabel>

                <Input
                  name="branchCode"
                  value={form.branchCode}
                  onChange={handleChange}
                  placeholder="Enter branch code"
                  className="h-11 w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              {/* GST */}
              <div>
                <RequiredLabel>GST Number</RequiredLabel>

                <Input
                  name="gst"
                  value={form.gst}
                  onChange={handleChange}
                  placeholder="Enter GST number"
                  className="h-11 w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              {/* Status */}
              <div>
                <RequiredLabel>Status</RequiredLabel>

                <Input
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  placeholder="Enter status"
                  className="h-11 w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>
          </div>

          {/* Address */}
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
                  placeholder="Enter city"
                  className="h-11 w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <RequiredLabel>District</RequiredLabel>

                <Input
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                  placeholder="Enter district"
                  className="h-11 w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <RequiredLabel>State</RequiredLabel>

                <Input
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  placeholder="Enter state"
                  className="h-11 w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <RequiredLabel>Pincode</RequiredLabel>

                <Input
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  placeholder="Enter pincode"
                  className="h-11 w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <RequiredLabel>Country</RequiredLabel>

                <Input
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  placeholder="Enter country"
                  className="h-11 w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                <RequiredLabel>Lane</RequiredLabel>

                <Input
                  name="lane"
                  value={form.lane}
                  onChange={handleChange}
                  placeholder="Enter lane / street"
                  className="h-11 w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                <RequiredLabel>Landmark</RequiredLabel>

                <Input
                  name="landmark"
                  value={form.landmark}
                  onChange={handleChange}
                  placeholder="Enter landmark"
                  className="h-11 w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-2 pb-6">
            <Button
              type="submit"
              className="max-w-xs w-full py-5 text-base capitalize"
            >
              Create Bank
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBank;
