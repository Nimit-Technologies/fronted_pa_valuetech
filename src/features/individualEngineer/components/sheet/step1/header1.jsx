import React from "react";
import { IdCardLanyard, FileArchiveIcon } from "lucide-react";
const Header1 = ({ task, user }) => {
  return (
    <div className="flex w-full flex-col gap-3 rounded-none border border-border bg-card px-4 py-6 shadow-xs sm:flex-row sm:items-center sm:justify-between sm:px-5">
      {/* Left side: Engineer Info */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <FileArchiveIcon size={15} className="shrink-0 text-primary" />
        <span className="capitalize">
          Engineer -{" "}
          {[user?.first_name, user?.last_name].filter(Boolean).join(" ") || "-"}
        </span>
      </div>

      {/* Right side: Case ID */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <IdCardLanyard size={15} className="shrink-0 text-primary" />
        <span>
          Case Id{" - "}
          <span className="font-medium text-foreground">
            {task?.case_id || "-"}
          </span>
        </span>
      </div>
    </div>
  );
};

export default Header1;
