import { describe, it, expect, vi } from "vitest";
import {
  buildFilterOptions,
  applyColumnFilters,
  buildColumnFilterProps,
} from "@/utils/table/columnFilters";

// Stands in for a feature's column map: two relations read off a raw row.
const COLUMNS = {
  department: {
    label: "Department",
    getId: (row) => row.department?.id ?? "",
    getLabel: (row) => row.department?.name ?? "",
  },
  branch: {
    label: "Branch",
    getId: (row) => row.branch?.id ?? "",
    getLabel: (row) => row.branch?.name ?? "",
  },
};

const ROWS = [
  {
    id: "r1",
    department: { id: "d1", name: "sales" },
    branch: { id: "b2", name: "indore" },
  },
  {
    id: "r2",
    department: { id: "d2", name: "support" },
    branch: { id: "b1", name: "bhopal" },
  },
  {
    id: "r3",
    department: { id: "d1", name: "sales" },
    branch: { id: "b2", name: "indore" },
  },
];

describe("buildFilterOptions", () => {
  it("lists each value once, sorted by label", () => {
    expect(buildFilterOptions(ROWS, "branch", COLUMNS)).toEqual([
      { value: "b1", label: "bhopal" },
      { value: "b2", label: "indore" },
    ]);
  });

  it("skips rows whose relation is missing", () => {
    const options = buildFilterOptions(
      [...ROWS, { id: "r4", department: null, branch: null }],
      "branch",
      COLUMNS,
    );
    expect(options.map((option) => option.value)).toEqual(["b1", "b2"]);
  });

  it("falls back to N/A when the row has an id but no name", () => {
    expect(
      buildFilterOptions([{ branch: { id: "b9" } }], "branch", COLUMNS),
    ).toEqual([{ value: "b9", label: "N/A" }]);
  });

  it("handles no rows at all", () => {
    expect(buildFilterOptions(undefined, "branch", COLUMNS)).toEqual([]);
  });
});

describe("applyColumnFilters", () => {
  it("keeps every row while no column is filtered", () => {
    const filters = { department: null, branch: null };
    expect(applyColumnFilters(ROWS, filters, COLUMNS)).toHaveLength(3);
  });

  it("keeps only the rows whose value is selected", () => {
    const filters = { department: null, branch: ["b2"] };
    expect(
      applyColumnFilters(ROWS, filters, COLUMNS).map((row) => row.id),
    ).toEqual(["r1", "r3"]);
  });

  it("ANDs the filtered columns together", () => {
    const filters = { department: ["d1"], branch: ["b1"] };
    expect(applyColumnFilters(ROWS, filters, COLUMNS)).toEqual([]);
  });

  it("drops everything when a column is filtered to nothing", () => {
    const filters = { department: null, branch: [] };
    expect(applyColumnFilters(ROWS, filters, COLUMNS)).toEqual([]);
  });
});

describe("buildColumnFilterProps", () => {
  const filters = { department: null, branch: null };

  it("keys the props by header text so a table can look them up", () => {
    const props = buildColumnFilterProps({
      rows: ROWS,
      filters,
      columns: COLUMNS,
    });
    expect(Object.keys(props)).toEqual(["Department", "Branch"]);
    expect(props.Branch.label).toBe("Branch");
  });

  it("keys by `header` when it differs from the popover label", () => {
    const columns = {
      branch: { ...COLUMNS.branch, header: "branch name" },
    };
    const props = buildColumnFilterProps({ rows: ROWS, filters, columns });
    expect(Object.keys(props)).toEqual(["branch name"]);
    expect(props["branch name"].label).toBe("Branch");
  });

  it("passes the column's own selection through", () => {
    const props = buildColumnFilterProps({
      rows: ROWS,
      filters: { department: null, branch: ["b2"] },
      columns: COLUMNS,
    });
    expect(props.Branch.selected).toEqual(["b2"]);
    expect(props.Department.selected).toBeNull();
  });

  it("narrows a column's options by the OTHER columns' filters", () => {
    const props = buildColumnFilterProps({
      rows: ROWS,
      filters: { department: ["d1"], branch: null },
      columns: COLUMNS,
    });
    // Only d1 rows survive, and they all sit in b2.
    expect(props.Branch.options).toEqual([{ value: "b2", label: "indore" }]);
    // Department still offers both, or its own choice could not be widened.
    expect(props.Department.options.map((option) => option.value)).toEqual([
      "d1",
      "d2",
    ]);
  });

  it("reports the column a change came from", () => {
    const onChange = vi.fn();
    const props = buildColumnFilterProps({
      rows: ROWS,
      filters,
      columns: COLUMNS,
      onChange,
    });

    props.Branch.onChange(["b1"]);
    expect(onChange).toHaveBeenCalledWith("branch", ["b1"]);
  });
});
