import React from "react";
import { Loader2 } from "lucide-react";
// import { Eye, Trash2 } from "lucide-react";

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import FilterableTableHead from "@/components/shared/filterableTableHead";

// `columnFilters` is keyed by header text and carries the props for an
// Excel-style ColumnFilter rendered inside that header cell:
//   { Department: { label, options, selected, onChange } }
const RoleTable = ({
  data,
  headers = [],
  isLoading = false,
  columnFilters = {},
  emptyMessage = "No roles found.",
}) => {
  const rows = data ?? [];
  const colSpan = headers.length || 5;

  const firstLoad = isLoading && rows.length === 0;
  const paging = isLoading && rows.length > 0;

  return (
    <div>
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
            {firstLoad ? (
              <TableRow>
                <TableCell colSpan={colSpan} className="py-16 text-center">
                  <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading roles…
                  </span>
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={colSpan}
                  className="text-center text-muted-foreground py-12"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((role, index) => (
                <TableRow
                  key={role.id}
                  className={`hover:bg-muted/30 ${
                    role.is_deleted ? "opacity-60" : ""
                  }`}
                >
                  {/* S.No */}
                  <TableCell className="font-medium">{index + 1}</TableCell>

                  {/* Role Name */}
                  <TableCell className="capitalize">{role.name}</TableCell>

                  {/* Department */}
                  <TableCell className="capitalize">
                    {role.department?.name || "—"}
                  </TableCell>

                  {/* Status — the list API returns soft-deleted roles so the
                      superAdmin table can restore them. This screen is
                      read-only (restore is super-admin only), but a deleted
                      row still has to read as deleted rather than inactive. */}
                  <TableCell>
                    {role.is_deleted ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                        Deleted
                      </span>
                    ) : (
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          role.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {role.is_active ? "Active" : "Inactive"}
                      </span>
                    )}
                  </TableCell>

                  {/* Action */}
                  {/* <TableCell> */}
                  {/* <div className="flex items-center gap-1.5"> */}
                  {/* <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye size={16} />
                      </Button> */}

                  {/* <UpdateRole
                        roleId={role.id}

                        defaultRoleName={role.name}

                        defaultDepartment={role.department?.id}

                        defaultStatus={role.is_active}
                      /> */}

                  {/* <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:text-destructive"
                      >
                        <Trash2 size={16} />
                      </Button> */}
                  {/* </div> */}
                  {/* </TableCell> */}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* <Pagination /> */}
      </div>
    </div>
  );
};

export default RoleTable;
