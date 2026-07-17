import React from "react";
import { User, CalendarDays, PhoneCallIcon } from "lucide-react";
import { STATUS_STYLES, formatStatus } from "@/constants/formatStatus";
import { formatDate } from "@/constants/formatDate";

const CaseHeader = ({ caseItem }) => {
  return (
    <div className="flex  w-full flex-col gap-3 rounded-lg border border-border bg-card px-4 py-6 shadow-xs sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-5">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User size={15} className="shrink-0 text-primary" />
          <span>
            Coordinator{" "}
            <span className="font-medium text-foreground">
              {caseItem?.coordinator?.first_name || "-"}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <PhoneCallIcon size={15} className="shrink-0 text-primary" />
          <span>
            Coordinator Phone Number{" "}
            <span className="font-medium text-foreground">
              {caseItem?.coordinator?.phone_number || "-"}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays size={15} className="shrink-0 text-primary" />
          <span>
            Assigned on{" "}
            <span className="font-medium text-foreground">
              {formatDate(caseItem?.created_at)}
            </span>
          </span>
        </div>
      </div>

      <span
        className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ${
          STATUS_STYLES[caseItem?.status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {formatStatus(caseItem?.status)}
      </span>
    </div>
  );
};

export default CaseHeader;
