import { Eye, Pencil, RotateCcw, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import FilterableTableHead from "@/components/shared/filterableTableHead";

// `columnFilters` is keyed by header text and carries the props for an
// Excel-style ColumnFilter rendered inside that header cell:
//   { "bank name": { label, options, selected, onChange } }
const BankTable = ({
  data = [],
  headers = [],
  isLoading = false,
  columnFilters = {},
  emptyMessage = "No banks found.",
  onDelete,
  onRestore,
  onToggleStatus,
}) => {
  const navigate = useNavigate();

  return (
    <div className="w-full overflow-x-auto rounded-md border border-border bg-card shadow-sm">
      <Table>
        <FilterableTableHead
          headers={headers}
          columnFilters={columnFilters}
          disabled={isLoading}
        />

        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={headers.length}
                className="text-center text-muted-foreground py-12 text-sm"
              >
                Loading banks...
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={headers.length}
                className="text-center text-muted-foreground py-12 text-sm"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((bank, index) => (
              <TableRow
                key={bank.id}
                className={`transition-colors hover:bg-muted/30 ${
                  bank.isDeleted ? "opacity-60" : ""
                }`}
              >
                <TableCell className="text-foreground font-medium">
                  {index + 1}
                </TableCell>

                <TableCell className="capitalize">{bank.name}</TableCell>

                <TableCell>{bank.displayName}</TableCell>

                <TableCell className="capitalize">{bank.bankBranch}</TableCell>

                <TableCell>{bank.bankBranchCode}</TableCell>

                <TableCell>{bank.gstNumber}</TableCell>

                <TableCell>
                  {bank.isDeleted ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                      Deleted
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onToggleStatus?.(bank)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-opacity hover:opacity-80 ${
                        bank.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {bank.isActive ? "Active" : "Inactive"}
                    </button>
                  )}
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                      onClick={() =>
                        navigate(`/branch-admin/bank/view/${bank.id}`)
                      }
                    >
                      <Eye size={16} />
                    </Button>

                    {/* Restore replaces edit and delete on a soft-deleted
                        row: PUT /bank/update/:id answers "Bank is
                        soft-deleted; restore it before updating", so an edit
                        button here would only lead to a rejected save. View
                        stays available either way — getBankById does not
                        filter on deleted_at. */}
                    {bank.isDeleted ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1.5 text-muted-foreground hover:text-foreground hover:bg-muted"
                        onClick={() => onRestore?.(bank)}
                      >
                        <RotateCcw size={14} />
                        Restore
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                          onClick={() =>
                            navigate(`/branch-admin/bank/update/${bank.id}`)
                          }
                        >
                          <Pencil size={16} />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={() => onDelete?.(bank)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default BankTable;
