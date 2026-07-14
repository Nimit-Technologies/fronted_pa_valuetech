import React from "react";
import { Eye, Trash2, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import Pagination from "@/features/superAdmin/components/pagination";

const BankTable = ({ data, headers = [] }) => {
  const rows = data?.data ?? [];
  const navigate = useNavigate();

  return (
    <div>
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
                  colSpan={headers.length}
                  className="text-center text-muted-foreground py-12 text-sm"
                >
                  No Banks Found.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((bank, index) => (
                <TableRow
                  key={bank.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  {/* S.No */}
                  <TableCell className="text-foreground font-medium">
                    {index + 1}
                  </TableCell>

                  {/* Bank Name */}
                  <TableCell className="capitalize">{bank.bank_name}</TableCell>

                  {/* Branch */}
                  <TableCell>{bank.branch}</TableCell>

                  {/* Branch Code */}
                  <TableCell>{bank.branch_code}</TableCell>

                  {/* GST */}
                  <TableCell>{bank.gst}</TableCell>

                  {/* Status */}
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        bank.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {bank.is_active ? "Active" : "Inactive"}
                    </span>
                  </TableCell>

                  {/* Action */}
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {/* View */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                        onClick={() =>
                          navigate(`/branch-admin/bank/view/${bank.id}`)
                        }
                      >
                        <Eye size={16} />
                      </Button>

                      {/* Update */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                        onClick={() =>
                          navigate(`/branch-admin/bank/update/${bank.id}`)
                        }
                      >
                        <Pencil size={16} />
                      </Button>

                      {/* Delete */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 size={16} />
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
    </div>
  );
};

export default BankTable;
