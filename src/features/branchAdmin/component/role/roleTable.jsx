import React from "react";
import { Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import UpdateRole from "./updateRole";
import Pagination from "../pagination";

const RoleTable = ({ data, headers = [] }) => {
  const rows = data?.data ?? [];

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
                  colSpan={headers.length || 4}
                  className="text-center text-muted-foreground py-12 text-sm"
                >
                  No roles found.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((role, index) => (
                <TableRow
                  key={role.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="text-foreground font-medium">
                    {index + 1}
                  </TableCell>

                  <TableCell className="capitalize text-foreground">
                    {role.name}
                  </TableCell>

                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${role.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-500 text-white"
                        }`}
                    >
                      {role.is_active ? "Active" : "Inactive"}
                    </span>
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-1.5">
                      <UpdateRole
                        roleId={role.id}
                        defaultName={role.name}
                        defaultDepartment={role.departmentId}
                      />

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
    </div>
  );
};

export default RoleTable;