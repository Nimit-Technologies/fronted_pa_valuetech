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
import Pagination from "@/features/superAdmin/components/pagination";

const RoleTable = ({
  data = [],
  headers = [],
  hasNextPage = false,
  hasPreviousPage = false,
  onNext,
  onPrev,
}) => {
  const rows = data ?? [];

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
                  colSpan={headers.length || 5}
                  className="text-center text-muted-foreground py-12"
                >
                  No roles found.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((role, index) => (
                <TableRow key={role.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="capitalize">{role.name}</TableCell>
                  <TableCell className="capitalize">
                    {role.department?.name || "—"}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        role.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {role.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <UpdateRole
                        roleId={role.id}
                        defaultRoleName={role.name}
                        defaultDepartment={role.department?.id}
                        defaultDepartmentName={role.department?.name}
                        defaultStatus={role.isActive}
                      />

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:text-destructive"
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

        <Pagination
          currentPage={1}
          totalPages={1}
          hasPreviousPage={hasPreviousPage}
          hasNextPage={hasNextPage}
          onPrev={onPrev}
          onNext={onNext}
        />
      </div>
    </div>
  );
};

export default RoleTable;
