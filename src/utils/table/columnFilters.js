// Excel-style column filters, shared by the superAdmin and branchAdmin list
// tables.
//
// A table describes its filterable columns with a definition map:
//
//   { branch: { label: "Branch", getId: (row) => …, getLabel: (row) => … } }
//
// `label` must match the table's header text, because that is the key a
// table uses to place the ColumnFilter control in the right header cell. A
// column whose header text is not presentable on its own — a lowercased
// header that CSS title-cases, say — adds `header` with that exact text and
// keeps `label` for what the popover and the filter chips show.
// `getId` reads the value off a raw list-API row; rows whose relation is
// missing resolve to "" and are left out of the options.
//
// The filter state itself lives in the feature's slice: `null` means the
// column is unfiltered, an array lists the relation ids to keep.

// Distinct values of one column across `rows`, ready for ColumnFilter.
export const buildFilterOptions = (rows = [], column, columns) => {
  const { getId, getLabel } = columns[column];
  const seen = new Map();
  for (const row of rows) {
    const id = getId(row);
    if (!id || seen.has(id)) continue;
    seen.set(id, { value: id, label: getLabel(row) || "N/A" });
  }
  return [...seen.values()].sort((a, b) => a.label.localeCompare(b.label));
};

// Keeps a row only if every filtered column includes the row's value.
export const applyColumnFilters = (rows = [], filters, columns) =>
  rows.filter((row) =>
    Object.entries(columns).every(([column, { getId }]) => {
      const selected = filters?.[column];
      return selected == null || selected.includes(getId(row));
    }),
  );

// ColumnFilter props for every filterable column, keyed by header text so a
// table can look them up while rendering its header row. Like Excel, each
// column lists the values still available after the OTHER columns' filters,
// so a choice in one column narrows the next.
export const buildColumnFilterProps = ({
  rows = [],
  filters,
  columns,
  onChange,
}) =>
  Object.fromEntries(
    Object.entries(columns).map(([column, { label, header = label }]) => [
      header,
      {
        label,
        options: buildFilterOptions(
          applyColumnFilters(rows, { ...filters, [column]: null }, columns),
          column,
          columns,
        ),
        selected: filters?.[column] ?? null,
        onChange: (values) => onChange?.(column, values),
      },
    ]),
  );
