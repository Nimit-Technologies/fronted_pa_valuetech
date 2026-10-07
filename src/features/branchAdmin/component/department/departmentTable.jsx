import React from "react";
// import { Eye, Trash2 } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// import { Button } from "@/components/ui/button";

// import UpdateDepartment from "./updateDepartment";
// import Pagination from "@/features/branchAdmin/component/pagination";

const DepartmentTable = ({ data, headers = [], isLoading = false }) => {
  const rows = data ?? [];
  const colSpan = headers.length || 4;

  const firstLoad = isLoading && rows.length === 0;
  const paging = isLoading && rows.length > 0;
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

        <TableBody
          className={
            paging
              ? "opacity-50 pointer-events-none transition-opacity"
              : "transition-opacity"
          }
        >
          {firstLoad && (
            <TableRow>
              <TableCell
                colSpan={headers.length || 4}
                className="text-center text-muted-foreground py-12 text-sm"
              >
                No departments found.
              </TableCell>
            </TableRow>
          )}

          {!isLoading && rows.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={colSpan}
                className="text-center text-muted-foreground py-12 text-sm"
              >
                No departments found.
              </TableCell>
            </TableRow>
          )}

          {rows.map((department, index) => (
            <TableRow
              key={department.id}
              className={`transition-colors hover:bg-muted/30 ${
                department.is_deleted ? "opacity-60" : ""
              }`}
            >
              <TableCell className="text-foreground font-medium">
                {index + 1}
              </TableCell>
              <TableCell className="capitalize text-foreground">
                {department.name}
              </TableCell>
              <TableCell className="capitalize text-foreground">
                {department.branch?.name || "N/A"}
              </TableCell>
              <TableCell>
                {department.is_deleted ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                    Deleted
                  </span>
                ) : (
                  <button
                    type="button"
                    // onClick={() => onToggleStatus?.(department)}
                    title="Click to toggle status"
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-opacity hover:opacity-80 ${
                      department.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {department.is_active ? "Active" : "Inactive"}
                  </button>
                )}
              </TableCell>
              {/* <TableCell>
                  <div className="flex gap-1.5">
                    {department.is_deleted ? (
                      // <Button
                      //   variant="ghost"
                      //   size="sm"
                      //   className="h-8 gap-1.5 text-muted-foreground hover:text-foreground hover:bg-muted"
                      //   onClick={() => onRestore?.(department)}
                      // >
                      //   <RotateCcw size={14} />
                      //   Restore
                      // </Button>
                    ) : (
                      <>
                        {/* <UpdateDepartment
                          defaultName={department.name}
                          departmentId={department.id}
                          defaultStatus={department.is_active}
                          defaultBranch={{
                            branch_id:
                              department.branch_id ??
                              department.branch?.id ??
                              "",
                            name: department.branch?.name ?? "",
                          }}
                          onUpdated={onEdited}
                        /> */}
              {/* <Button
                          variant="ghost"
                          size="icon-sm"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={() => onDelete?.(department)}
                        >
                          <Trash2 size={14} />
                        </Button> */}
              {/* </> */}

              {/* // </div> */}
              {/* // </TableCell>  */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DepartmentTable;
