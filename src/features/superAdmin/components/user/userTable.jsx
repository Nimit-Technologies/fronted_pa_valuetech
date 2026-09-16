import React from "react";
import { Eye, Pencil, Trash2, RotateCcw, Loader2 } from "lucide-react";
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
import ColumnFilter from "@/components/shared/columnFilter";

// Rows are the raw list-API shape: id, employee_id, first_name, last_name,
// phone, aadhaar_number (masked to the last 4 digits), is_active, is_deleted,
// branch/department/role { id, name }. Create, view and update are full pages,
// so the row actions navigate relative to the list route instead of opening
// popovers.
//
// `columnFilters` is keyed by header text and carries the props for an
// Excel-style ColumnFilter rendered inside that header cell:
//   { Branch: { label, options, selected, onChange }, ... }
const UserTable = ({
  data,
  headers = [],
  isLoading = false,
  columnFilters = {},
  emptyMessage = "No users found.",
  onDelete,
  onRestore,
  onToggleStatus,
}) => {
  const rows = data ?? [];
  const colSpan = headers.length || 10;
  const navigate = useNavigate();

  const firstLoad = isLoading && rows.length === 0;
  const paging = isLoading && rows.length > 0;

  return (
    <div className="relative">
      <div className="w-full overflow-x-auto rounded-md border border-border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              {headers.map((header) => {
                const filter = columnFilters[header];
                return (
                  <TableHead
                    key={header}
                    className="capitalize font-semibold text-foreground whitespace-nowrap text-sm"
                  >
                    <span className="inline-flex items-center">
                      {header}
                      {filter ? (
                        <ColumnFilter {...filter} disabled={isLoading} />
                      ) : null}
                    </span>
                  </TableHead>
                );
              })}
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
                <TableCell colSpan={colSpan} className="py-16 text-center">
                  <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading users…
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

            {rows.map((user, index) => (
              <TableRow
                key={user.id}
                className={`transition-colors hover:bg-muted/30 ${
                  user.is_deleted ? "opacity-60" : ""
                }`}
              >
                <TableCell className="text-foreground font-medium">
                  {index + 1}
                </TableCell>
                <TableCell className="uppercase text-foreground">
                  {user.employee_id}
                </TableCell>
                <TableCell className="capitalize text-foreground">
                  {`${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() ||
                    "N/A"}
                </TableCell>
                <TableCell className="text-foreground">
                  {user.phone || "N/A"}
                </TableCell>
                <TableCell className="text-foreground">
                  {user.aadhaar_number || "N/A"}
                </TableCell>
                <TableCell className="capitalize text-foreground">
                  {user.branch?.name || "N/A"}
                </TableCell>
                <TableCell className="capitalize text-foreground">
                  {user.department?.name || "N/A"}
                </TableCell>
                <TableCell className="capitalize text-foreground">
                  {user.role?.name || "N/A"}
                </TableCell>
                <TableCell>
                  {user.is_deleted ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                      Deleted
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onToggleStatus?.(user)}
                      title="Click to toggle status"
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-opacity hover:opacity-80 ${
                        user.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {user.is_active ? "Active" : "Inactive"}
                    </button>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1.5">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                      title="View"
                      onClick={() => navigate(`view/${user.id}`)}
                    >
                      <Eye size={14} />
                    </Button>
                    {user.is_deleted ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1.5 text-muted-foreground hover:text-foreground hover:bg-muted"
                        onClick={() => onRestore?.(user)}
                      >
                        <RotateCcw size={14} />
                        Restore
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                          title="Edit"
                          onClick={() => navigate(`update/${user.id}`)}
                        >
                          <Pencil size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          title="Delete"
                          onClick={() => onDelete?.(user)}
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

export default UserTable;
