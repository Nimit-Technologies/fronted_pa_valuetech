import React from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ColumnFilter from "@/components/shared/columnFilter";

// Header row for the list tables: the header text, plus an Excel-style
// ColumnFilter in the cells named by `columnFilters` (keyed by header text,
// as built by buildColumnFilterProps). A table with no filters passes
// nothing and gets a plain header row.
const FilterableTableHead = ({
  headers = [],
  columnFilters = {},
  disabled = false,
}) => (
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
              {filter ? <ColumnFilter {...filter} disabled={disabled} /> : null}
            </span>
          </TableHead>
        );
      })}
    </TableRow>
  </TableHeader>
);

export default FilterableTableHead;
