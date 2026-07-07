import React from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Pagination from "@/features/individualCoordinator/components/pagination";
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
                  colSpan={headers.length || 10}
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
                    {caseItem.branch?.name || "-"}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {caseItem.banker || "-"}
                  </TableCell>
                  <TableCell className="text-foreground capitalize">
                    {caseItem.case_type || "-"}
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
                    <div className="flex gap-1.5">
                      <Button
                        asChild
                        variant="ghost"
                        size="icon-sm"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                      >
                        <Link
                          to={`/coordinator/case/view/${caseItem.id}`}
                        >
                          <Eye size={14} />
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant="ghost"
                        size="icon-sm"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                      >
                        <Link
                          to={`/coordinator/case/update/${caseItem.id}`}
                        >
                          <Pencil size={14} />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 size={14} />
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
