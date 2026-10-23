import React from "react";
import { CalendarDays, FileArchiveIcon } from "lucide-react";
import { formatStatus, STATUS_STYLES } from "@/constants/formatStatus";
import { formatDate, formatTime } from "@/constants/formatDate";

const Header2 = ({ task }) => {
  const status = task?.status?.code;

  return (
    <div className="flex w-full flex-col gap-3 rounded-none border border-border bg-card px-4 py-6 shadow-xs sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-5">
        {/* File Number */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileArchiveIcon size={15} className="shrink-0 text-primary" />
          <span>
            File Number{" "}
            <span className="font-medium text-foreground">
              {task?.file_number || "-"}
            </span>
          </span>
        </div>

        {/* Assigned On */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="flex  items-center justify-center gap-1">
            <CalendarDays size={15} className="shrink-0 text-primary" />
            <p>Assigned on </p>
            <div className="flex gap-1.5">
              <p>{formatDate(task?.assigned_at)}</p>
              <p>{formatTime(task?.assigned_at)}</p>
            </div>
          </div>
        </div>

        {/* Visit Date */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays size={15} className="shrink-0 text-primary" />
          <span>
            Visit Date{" "}
            <span className="font-medium text-foreground">
              {formatDate(task?.visit_date)}
            </span>
          </span>
        </div>
      </div>

      {/* Status Badge */}
      <span
        className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ${
          STATUS_STYLES[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {formatStatus(status)}
      </span>
    </div>
  );
};

export default Header2;
