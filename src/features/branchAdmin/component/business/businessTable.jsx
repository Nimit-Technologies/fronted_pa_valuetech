import { Pencil, RotateCcw, Trash2 } from "lucide-react";
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

const BusinessTable = ({
  data = [],
  headers = [],
  isLoading = false,
  onDelete,
  onRestore,
  onToggleStatus,
}) => {
  const navigate = useNavigate();

  return (
    <div className="w-full overflow-x-auto rounded-md border border-border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            {headers.map((header) => (
              <TableHead
                key={header}
                className="whitespace-nowrap text-sm font-semibold capitalize text-foreground"
              >
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={headers.length}
                className="py-12 text-center text-sm text-muted-foreground"
              >
                Loading businesses...
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={headers.length}
                className="py-12 text-center text-sm text-muted-foreground"
              >
                No businesses found.
              </TableCell>
            </TableRow>
          ) : (
            data.map((business, index) => (
              <TableRow
                key={business.id}
                className={`transition-colors hover:bg-muted/30 ${
                  business.isDeleted ? "opacity-60" : ""
                }`}
              >
                <TableCell className="font-medium text-foreground">
                  {index + 1}
                </TableCell>

                <TableCell className="capitalize">{business.name}</TableCell>

                <TableCell>
                  {business.isDeleted ? (
                    <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                      Deleted
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onToggleStatus?.(business)}
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-opacity hover:opacity-80 ${
                        business.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {business.isActive ? "Active" : "Inactive"}
                    </button>
                  )}
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-1.5">
                    {!business.isDeleted && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                        aria-label={`Edit ${business.name}`}
                        onClick={() =>
                          navigate(
                            `/branch-admin/business/update/${business.id}`,
                          )
                        }
                      >
                        <Pencil size={16} />
                      </Button>
                    )}

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
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        aria-label={`Delete ${business.name}`}
                        onClick={() => onDelete?.(business)}
                      >
                        <Trash2 size={16} />
                      </Button>
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

export default BusinessTable;
