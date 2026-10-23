import React from "react";
import { Eye, FileSpreadsheetIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { formatAddress } from "@/constants/formatAddress";
import { formatDate, formatTime } from "@/constants/formatDate";
import StatusDropdown from "@/components/shared/dropdown/statusDropdown";

const CaseTable = ({
  tasks = [],
  headers = [],
  loading = false,
  error = "",
  page = 1,
  hasPreviousPage = false,
  hasNextPage = false,
  onPrevious,
  onNext,
  onRetry,
  onStatusSelect,
  updatingCaseId = null,
}) => {
  return (
    <div className="w-full overflow-x-auto rounded-md border border-border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            {headers.map((header) => (
              <TableHead
                key={header}
                className="capitalize font-semibold text-foreground whitespace-nowrap text-sm"
              >
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell
                colSpan={headers.length || 12}
                className="text-center text-muted-foreground py-12 text-sm"
              >
                Loading tasks...
              </TableCell>
            </TableRow>
          ) : error ? (
            <TableRow>
              <TableCell
                colSpan={headers.length || 12}
                className="text-center text-destructive py-12 text-sm"
                role="alert"
              >
                <div className="flex flex-col items-center gap-3">
                  <span>{error}</span>
                  {onRetry && (
                    <Button variant="outline" size="sm" onClick={onRetry}>
                      Retry
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ) : tasks.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={headers.length || 12}
                className="text-center text-muted-foreground py-12 text-sm"
              >
                No tasks found.
              </TableCell>
            </TableRow>
          ) : (
            tasks.map((task, index) => (
              <TableRow
                key={task.task_id}
                className="hover:bg-muted/30 transition-colors"
              >
                <TableCell className="text-foreground font-medium">
                  {index + 1}
                </TableCell>
                <TableCell className="text-foreground whitespace-nowrap ">
                  <p>{formatDate(task.assigned_at)}</p>
                  <p className="text-xs">{formatTime(task.assigned_at)}</p>
                </TableCell>
                <TableCell className="text-foreground">
                  {task.file_number || "-"}
                </TableCell>
                <TableCell className="text-foreground capitalize">
                  {task.case_type || "-"}
                </TableCell>
                <TableCell className="text-foreground">
                  {task.customer_name || "-"}
                </TableCell>
                <TableCell className="text-foreground">
                  {task.customer_contact_number || "-"}
                </TableCell>
                <TableCell className="text-foreground">
                  {task.bank?.display_name || task.bank?.name || "-"}
                </TableCell>
                <TableCell className="text-foreground">
                  {[task.assigned_by?.first_name, task.assigned_by?.last_name]
                    .filter(Boolean)
                    .join(" ") || "-"}
                </TableCell>
                <TableCell className="text-foreground">
                  {task.assigned_by?.phone || "-"}
                </TableCell>
                <TableCell>
                  <StatusDropdown
                    value={task.status}
                    onSelect={(status) =>
                      onStatusSelect?.(task.case_id, status)
                    }
                    disabled={loading || Boolean(updatingCaseId)}
                    placeholder={
                      task.status?.name || task.status?.code || "Change status"
                    }
                  />
                </TableCell>
                <TableCell className="text-foreground whitespace-nowrap">
                  {formatAddress(task.address)}
                </TableCell>

                <TableCell>
                  <div className="flex flex-wrap items-center justify-center gap-1.5">
                    <Button
                      asChild
                      variant="ghost"
                      size="icon-sm"
                      className="h-fit w-fit px-3 py-1 shrink-0 text-muted-foreground hover:text-foreground hover:bg-muted"
                    >
                      <Link
                        className="flex  items-center gap-1.5"
                        to={`/engineer/case/view/${task.case_id}`}
                      >
                        <Eye className="text-blue-500" size={14} />
                        <span className="text-blue-500 hidden text-xs whitespace-nowrap sm:inline">
                          View case
                        </span>
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-foreground hover:bg-muted w-fit h-fit px-3 py-1"
                    >
                      <Link
                        className="flex items-center gap-1.5"
                        to={`/engineer/report/create/${task.task_id}`}
                      >
                        <FileSpreadsheetIcon size={14} />
                        <span className="hidden text-xs whitespace-nowrap sm:inline">
                          Fill Sheet
                        </span>
                      </Link>
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap items-center justify-center gap-1.5">
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-foreground hover:bg-muted w-fit h-fit px-3 py-1"
                    >
                      <Link
                        className="flex items-center gap-1.5"
                        to={`/engineer/report/view/${task.case_id}`}
                      >
                        <FileSpreadsheetIcon size={14} />
                        <span className="hidden text-xs whitespace-nowrap sm:inline">
                          View report
                        </span>
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-3">
        <p className="text-sm font-medium text-muted-foreground">Page {page}</p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onPrevious}
            disabled={!hasPreviousPage || loading}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onNext}
            disabled={!hasNextPage || loading}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CaseTable;
