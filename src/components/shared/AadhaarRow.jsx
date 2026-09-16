import useGetAadhaarByEmployeeId from "@/features/superAdmin/hooks/user/useGetAadhaarByEmployeeId";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import React, { useState } from "react";

const AadhaarRow = ({ maskedValue, employeeId }) => {
  const { getAadhaarByEmployeeId } = useGetAadhaarByEmployeeId();
  const [fullValue, setFullValue] = useState(null);
  const [shown, setShown] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (shown) {
      setShown(false);
      return;
    }
    if (fullValue) {
      setShown(true);
      return;
    }
    if (!employeeId || loading) return;

    setLoading(true);
    const res = await getAadhaarByEmployeeId(employeeId);
    setLoading(false);

    const number = res?.data?.aadhaar_number;
    if (number) {
      setFullValue(number);
      setShown(true);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-muted-foreground capitalize">
        Aadhaar Number
      </span>
      <span className="flex items-center gap-2 text-sm font-medium text-foreground">
        {shown && fullValue ? fullValue : maskedValue || "—"}
        {employeeId && (
          <button
            type="button"
            onClick={handleToggle}
            disabled={loading}
            aria-label={shown ? "Hide Aadhaar number" : "Reveal Aadhaar number"}
            className="text-muted-foreground transition-colors hover:cursor-pointer hover:text-foreground disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : shown ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
      </span>
    </div>
  );
};

export default AadhaarRow;
