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
import Pagination from "@/features/individualEngineer/components/pagination";
import { Link } from "react-router-dom";
import { formatAddress } from "@/constants/formatAddress";
import { formatDate } from "@/constants/formatDate";
import { formatStatus, STATUS_STYLES } from "@/constants/formatStatus";

const CaseTable = ({ data, headers = [] }) => {
  const rows = data?.data ?? [];

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
          {rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={headers.length || 12}
                className="text-center text-muted-foreground py-12 text-sm"
              >
                No cases found.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((caseItem, index) => (
              <TableRow
                key={caseItem.id}
                className="hover:bg-muted/30 transition-colors"
              >
                <TableCell className="text-foreground font-medium">
                  {index + 1}
                </TableCell>
                <TableCell className="text-foreground whitespace-nowrap">
                  {formatDate(caseItem.created_at)}
                </TableCell>
                <TableCell className="text-foreground">
                  {caseItem.file_number || "-"}
                </TableCell>
                <TableCell className="text-foreground capitalize">
                  {caseItem.case_type || "-"}
                </TableCell>
                <TableCell className="text-foreground">
                  {caseItem.customer_name || "-"}
                </TableCell>
                <TableCell className="text-foreground">
                  {caseItem.customer_phone_number || "-"}
                </TableCell>
                <TableCell className="text-foreground">
                  {caseItem.bank?.display_name || caseItem.bank?.name || "-"}
                </TableCell>
                <TableCell className="text-foreground">
                  {caseItem.coordinator?.first_name || "-"}
                </TableCell>
                <TableCell className="text-foreground">
                  {caseItem.coordinator?.phone_number || "-"}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
                      STATUS_STYLES[caseItem.status] ||
                      "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {formatStatus(caseItem.status)}
                  </span>
                </TableCell>
                <TableCell className="text-foreground whitespace-nowrap">
                  {formatAddress(caseItem.address)}
                </TableCell>

                <TableCell>
                  <div className="flex flex-wrap items-center justify-center gap-1.5">
                    <Button
                      asChild
                      variant="ghost"
                      size="icon-sm"
                      className="h-8 w-fit px-3 py-1 shrink-0 text-muted-foreground hover:text-foreground hover:bg-muted"
                    >
                      <Link
                        className="flex  items-center gap-1.5"
                        to={`/engineer/case/view/${caseItem.id}`}
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
                      className="text-muted-foreground hover:text-foreground hover:bg-muted w-fit px-3 py-1"
                    >
                      <Link
                        className="flex items-center gap-1.5"
                        to={`/engineer/report/view/${caseItem.id}`}
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
      <Pagination />
    </div>
  );
};

export default CaseTable;
