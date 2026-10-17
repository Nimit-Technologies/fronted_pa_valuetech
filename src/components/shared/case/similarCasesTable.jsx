import { Eye, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

// The cases that may already be the one being filed, as returned by
// POST /case/similar: { id, file_number, business_type_name } and nothing else.
// A match in another business line is not the viewer's to read beyond its file
// number, which is why there is no customer or address column to render.
//
// Presentational on purpose — the rows, the paging flags and the fetch belong
// to the caller (see useSimilarCases). That is what lets the same table serve
// the coordinator's create form and any later screen with only `viewPathFor`
// changing.
//
// `type="button"` on Load more is load-bearing: this renders inside the create
// form, where a default-type button would submit it.
const DEFAULT_VIEW_PATH = (id) => `/cordinator/case/view/${id}`;

const SimilarCasesTable = ({
  cases = [],
  viewPathFor = DEFAULT_VIEW_PATH,
  hasNextPage = false,
  loadingMore = false,
  onLoadMore,
  emptyMessage = "No similar cases.",
  className = "",
}) => {
  const rows = cases ?? [];

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Table brings its own overflow-x-auto, so the narrow viewport that
          cannot fit four columns scrolls instead of squashing them. */}
      <div className="overflow-hidden rounded-md border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-12 text-xs font-semibold capitalize sm:text-sm">
                S.No
              </TableHead>
              <TableHead className="text-xs font-semibold capitalize sm:text-sm">
                File Number
              </TableHead>
              <TableHead className="text-xs font-semibold capitalize sm:text-sm">
                Business Type
              </TableHead>
              <TableHead className="w-16 text-right text-xs font-semibold capitalize sm:text-sm">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-8 text-center text-sm text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((match, index) => (
                <TableRow
                  key={match.id}
                  className="transition-colors hover:bg-muted/30"
                >
                  <TableCell className="text-xs font-medium text-foreground sm:text-sm">
                    {index + 1}
                  </TableCell>
                  <TableCell className="text-xs text-foreground sm:text-sm">
                    {match.file_number || "-"}
                  </TableCell>
                  <TableCell className="text-xs capitalize text-foreground sm:text-sm">
                    {match.business_type_name || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                      {/* Labelled on the link itself: the text is dropped on
                          phones to keep the row from scrolling, so the icon
                          alone would otherwise have no accessible name. */}
                      <Link
                        to={viewPathFor(match.id)}
                        aria-label={`View case ${match.file_number || match.id}`}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">View</span>
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {hasNextPage ? (
        <div className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={loadingMore}
            onClick={onLoadMore}
          >
            {loadingMore ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading
              </>
            ) : (
              "Load more"
            )}
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default SimilarCasesTable;
