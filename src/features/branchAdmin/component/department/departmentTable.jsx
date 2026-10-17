import React from "react";
import { Loader2 } from "lucide-react";
// import { Eye, Trash2 } from "lucide-react";

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import FilterableTableHead from "@/components/shared/filterableTableHead";

// import { Button } from "@/components/ui/button";

// import UpdateDepartment from "./UpdateDepartment";
// import Pagination from "@/features/branchAdmin/component/Pagination";

// `columnFilters` is keyed by header text and carries the props for an
// Excel-style ColumnFilter rendered inside that header cell:
//   { Branch: { label, options, selected, onChange } }
const DepartmentTable = ({
  data,
  headers = [],
  isLoading = false,
  columnFilters = {},
  emptyMessage = "No departments found.",
}) => {
  const rows = data ?? [];
  const colSpan = headers.length || 4;

  const firstLoad = isLoading && rows.length === 0;
  const paging = isLoading && rows.length > 0;
  return (
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
                  Loading departments…
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
