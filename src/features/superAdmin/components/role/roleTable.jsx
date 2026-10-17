import React from "react";
import { Trash2, Loader2, RotateCcw } from "lucide-react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import FilterableTableHead from "@/components/shared/filterableTableHead";
import UpdateRole from "@/features/superAdmin/components/role/UpdateRole";

// Rows use the raw list-API shape, including is_deleted for soft-deleted
// roles and the flattened department / branch { id, name } relations.
//
// `columnFilters` is keyed by header text and carries the props for an
// Excel-style ColumnFilter rendered inside that header cell:
//   { Department: { label, options, selected, onChange }, Branch: { … } }
const RoleTable = ({
  data,
  headers = [],
  isLoading = false,
  columnFilters = {},
  emptyMessage = "No roles found.",
  onEdited,
  onDelete,
  onRestore,
  onToggleStatus,
}) => {
  const rows = data ?? [];
  const colSpan = headers.length || 6;
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
                    Loading roles…
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

            {rows.map((role, index) => (
              <TableRow
                key={role.id}
                className={`transition-colors hover:bg-muted/30 ${
                  role.is_deleted ? "opacity-60" : ""
                }`}
              >
                <TableCell className="text-foreground font-medium">
                  {index + 1}
                </TableCell>
                <TableCell className="capitalize text-foreground">
                  {role.name}
                </TableCell>
                <TableCell className="capitalize text-foreground">
                  {role.department?.name || "N/A"}
                </TableCell>
                <TableCell className="capitalize text-foreground">
                  {role.branch?.name || "N/A"}
                </TableCell>
                <TableCell>
                  {role.is_deleted ? (
                    <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                      Deleted
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onToggleStatus?.(role)}
                      title="Click to toggle status"
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-opacity hover:opacity-80 ${
                        role.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {role.is_active ? "Active" : "Inactive"}
                    </button>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1.5">
                    {role.is_deleted ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                        onClick={() => onRestore?.(role)}
                      >
                        <RotateCcw size={14} />
                        Restore
                      </Button>
                    ) : (
                      <>
                        <UpdateRole
                          defaultName={role.name}
                          roleId={role.id}
                          defaultStatus={role.is_active}
                          defaultDepartment={{
                            id: role.department_id ?? role.department?.id ?? "",
                            name: role.department?.name ?? "",
                          }}
                          onUpdated={onEdited}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => onDelete?.(role)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
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

export default RoleTable;
