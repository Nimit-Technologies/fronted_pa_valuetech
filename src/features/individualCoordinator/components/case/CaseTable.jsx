import React from "react";
import { Eye, Pencil, Loader2, FileSpreadsheetIcon } from "lucide-react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import FilterableTableHead from "@/components/shared/filterableTableHead";
import { formatAddress } from "@/constants/formatAddress";
import { formatDate } from "@/constants/formatDate";
import { formatStatus, STATUS_STYLES } from "@/constants/formatStatus";

// `data` is the raw list-API page (GET /case/all-case): an array of rows with
// file_number, customer_name, customer_contact_number, banker_name, case_type,
// bank { display_name, name, bank_branch }, status { code, name },
// address { lane, city, state, pin_code, ... } and created_at, which is the
// date column. The endpoint never returns soft-deleted cases, so there is no
// deleted/restore state to render here.
//
// Paging lives on the page (shared Pagination + usePaginationController), not
// inside the table, so the list route owns the cursor.
//
// `columnFilters` is keyed by header text and carries the props for an
// Excel-style ColumnFilter rendered inside that header cell:
//   { bank: { label, options, selected, onChange }, "case type": { … } }
const CaseTable = ({
  data,
  headers = [],
  isLoading = false,
  columnFilters = {},
  emptyMessage = "No cases found.",
}) => {
  const rows = data ?? [];
  const colSpan = headers.length || 12;

  const firstLoad = isLoading && rows.length === 0;
  const paging = isLoading && rows.length > 0;

  return (
    <div className="relative">
      <div className="w-full overflow-x-auto rounded-md border border-border bg-card shadow-sm">
        <Table>
          <FilterableTableHead
            headers={headers}
            columnFilters={columnFilters}
            disabled={isLoading}
          />
          <TableBody
            className={
              paging
                ? "opacity-50 pointer-events-none transition-opacity"
                : "transition-opacity"
            }
          >
            {firstLoad && (
              <TableRow>
                <TableCell colSpan={colSpan} className="py-16 text-center">
                  <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading cases…
                  </span>
                </TableCell>
              </TableRow>
            )}

            {!isLoading && rows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={colSpan}
                  className="text-center text-muted-foreground py-12 text-sm"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}

            {rows.map((caseItem, index) => {
              const statusCode = caseItem.status?.code;

              return (
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
                  <TableCell className="capitalize text-foreground">
                    {caseItem.customer_name || "-"}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {caseItem.customer_contact_number || "-"}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {caseItem.bank?.display_name || caseItem.bank?.name || "-"}
                  </TableCell>
                  <TableCell className="capitalize text-foreground">
                    {caseItem.bank?.bank_branch || "-"}
                  </TableCell>
                  <TableCell className="capitalize text-foreground">
                    {caseItem.banker_name || "-"}
                  </TableCell>
                  <TableCell className="text-foreground capitalize">
                    {caseItem.case_type || "-"}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
                        STATUS_STYLES[statusCode] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {formatStatus(caseItem.status?.name || statusCode)}
                    </span>
                  </TableCell>
                  <TableCell className="capitalize text-foreground whitespace-nowrap">
                    {formatAddress(caseItem.address)}
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-1.5">
                      <Button
                        asChild
                        variant="ghost"
                        size="icon-sm"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                        title="View"
                      >
                        <Link to={`/cordinator/case/view/${caseItem.id}`}>
                          <Eye size={14} />
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant="ghost"
                        size="icon-sm"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                        title="Edit"
                      >
                        <Link to={`/cordinator/case/update/${caseItem.id}`}>
                          <Pencil size={14} />
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
                          to={`/cordinator/report/view/${caseItem.id}`}
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
              );
            })}
          </TableBody>
        </Table>
      </div>

      {paging && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-md bg-card/50">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
};

export default CaseTable;
