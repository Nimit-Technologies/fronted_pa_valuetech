import React from "react";
import { Trash2, RotateCcw, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import UpdateBranch from "@/features/superAdmin/components/branch/updateBranch";

const BranchTable = ({
  data,
  headers = [],
  isLoading = false,
  onEdited,
  onDelete,
  onRestore,
  onToggleStatus,
}) => {
  const rows = data ?? [];
  const colSpan = headers.length || 4;

  const firstLoad = isLoading && rows.length === 0;
  const paging = isLoading && rows.length > 0;

  return (
    <div className="relative">
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
                <TableCell colSpan={colSpan} className="py-16 text-center">
                  <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading branches…
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
                  No branches found.
                </TableCell>
              </TableRow>
            )}

            {rows.map((branch, index) => (
              <TableRow
                key={branch.id}
                className={`transition-colors hover:bg-muted/30 ${
                  branch.isDeleted ? "opacity-60" : ""
                }`}
              >
                <TableCell className="text-foreground font-medium">
                  {index + 1}
                </TableCell>
                <TableCell className="capitalize text-foreground">
                  {branch.name}
                </TableCell>
                <TableCell>
                  {branch.isDeleted ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                      Deleted
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onToggleStatus?.(branch)}
                      title="Click to toggle status"
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-opacity hover:opacity-80 ${
                        branch.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {branch.isActive ? "Active" : "Inactive"}
                    </button>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1.5">
                    {branch.isDeleted ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1.5 text-muted-foreground hover:text-foreground hover:bg-muted"
                        onClick={() => onRestore?.(branch)}
                      >
                        <RotateCcw size={14} />
                        Restore
                      </Button>
                    ) : (
                      <>
                        <UpdateBranch
                          defaultName={branch.name}
                          branchId={branch.id}
                          defaultStatus={branch.isActive}
                          onUpdated={onEdited}
                        />
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={() => onDelete?.(branch)}
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

export default BranchTable;
