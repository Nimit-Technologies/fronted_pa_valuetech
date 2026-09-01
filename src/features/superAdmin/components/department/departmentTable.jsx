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
// import { useEffect } from "react";
import { Button } from "@/components/ui/button";

import UpdateDepartment from "./updateDepartment";
import Pagination from "@/features/superAdmin/components/pagination";

const DepartmentTable = ({
  data,
  headers = [],
  hasNextPage = false,
  hasPreviousPage = false,
  onNext,
  onPrev,
}) => {
  const rows = data;

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
                colSpan={headers.length || 4}
                className="text-center text-muted-foreground py-12 text-sm"
              >
                No departments found.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((department, index) => (
              <TableRow
                key={department.id}
                className="hover:bg-muted/30 transition-colors"
              >
                <TableCell className="font-medium">{index + 1}</TableCell>

                <TableCell className="capitalize">{department.name}</TableCell>

                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      department.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {department.isActive ? "Active" : "Inactive"}
                  </span>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <UpdateDepartment
                      departmentId={department.id}
                      defaultDepartmentName={department.name}
                      defaultStatus={department.is_active}
                    />

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

      <Pagination
        currentPage={1}
        totalPages={1}
        hasPreviousPage={hasPreviousPage}
        hasNextPage={hasNextPage}
        onPrev={onPrev}
        onNext={onNext}
      />
    </div>
  );
};

export default DepartmentTable;
