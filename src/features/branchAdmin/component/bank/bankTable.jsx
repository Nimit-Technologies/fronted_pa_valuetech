import { Eye, Pencil, Trash2 } from "lucide-react";
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

const BankTable = ({
  data = [],
  headers = [],
  isLoading = false,
  onDelete,
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
                className="capitalize font-semibold text-foreground whitespace-nowrap text-sm"
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
                No banks found.
              </TableCell>
            </TableRow>
          ) : (
            data.map((bank, index) => (
              <TableRow
                key={bank.id}
                className="hover:bg-muted/30 transition-colors"
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
