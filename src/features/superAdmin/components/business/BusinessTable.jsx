import React from "react";
import { Trash2, Loader2, RotateCcw } from "lucide-react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import FilterableTableHead from "@/components/shared/filterableTableHead";
import UpdateBusiness from "@/features/superAdmin/components/business/UpdateBusiness";

// Rows use the normalized shape from normalizeBusiness, including isDeleted
// for soft-deleted business types.
//
// `columnFilters` is keyed by header text and carries the props for an
// Excel-style ColumnFilter rendered inside that header cell:
//   { Branch: { label, options, selected, onChange } }
const BusinessTable = ({
  data = [],
  headers = [],
  isLoading = false,
  columnFilters = {},
  emptyMessage = "No businesses found.",
  onEdited,
  onDelete,
  onRestore,
  onToggleStatus,
}) => {
  const rows = data ?? [];
  const colSpan = headers.length || 5;
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
                    Loading businesses…
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

            {rows.map((business, index) => (
              <TableRow
                key={business.id}
                className={`transition-colors hover:bg-muted/30 ${
                  business.isDeleted ? "opacity-60" : ""
                }`}
              >
                <TableCell className="text-foreground font-medium">
                  {index + 1}
                </TableCell>
                <TableCell className="capitalize text-foreground">
                  {business.name}
                </TableCell>
                <TableCell className="capitalize text-foreground">
                  {business.branch?.name || "N/A"}
                </TableCell>
                <TableCell>
                  {business.isDeleted ? (
                    <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                      Deleted
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onToggleStatus?.(business)}
                      title="Click to toggle status"
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-opacity hover:opacity-80 ${
                        business.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {business.isActive ? "Active" : "Inactive"}
                    </button>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1.5">
                    {business.isDeleted ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                        onClick={() => onRestore?.(business)}
                      >
                        <RotateCcw size={14} />
                        Restore
                      </Button>
                    ) : (
                      <>
                        <UpdateBusiness
                          defaultName={business.name}
                          businessId={business.id}
                          defaultStatus={business.isActive}
                          defaultBranch={{
                            branch_id:
                              business.branchId ?? business.branch?.id ?? "",
                            name: business.branch?.name ?? "",
                          }}
                          onUpdated={onEdited}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                          aria-label={`Delete ${business.name}`}
                          onClick={() => onDelete?.(business)}
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

export default BusinessTable;
