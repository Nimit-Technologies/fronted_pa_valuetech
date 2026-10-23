import { describe, it, expect } from "vitest";
import { logout } from "@/features/auth/slice/authSlice";
import caseReducer, {
  caseStart,
  caseFailure,
  setCase,
  updateCaseInList,
  setQuery,
  setDirection,
  setCaseFilter,
  clearCaseFilter,
  clearCaseFilters,
} from "@/store/slice/case/caseSlice";

const initial = caseReducer(undefined, { type: "@@INIT" });

const page = (overrides = {}) => ({
  data: [{ id: "c1" }, { id: "c2" }],
  caseFirstId: "c1",
  caseLastId: "c2",
  hasNextPage: true,
  hasPreviousPage: false,
  caseLength: 2,
  dataLimit: 10,
  totalCount: 20,
  totalActiveCount: 18,
  direction: "next",
  searchQuery: "",
  ...overrides,
});

describe("caseSlice", () => {
  it("starts with an empty page and no request in flight", () => {
    expect(initial.caseData).toEqual([]);
    expect(initial.loading).toBe(false);
    expect(initial.error).toBeNull();
  });

  it("clears case data when the user logs out", () => {
    const loaded = caseReducer(initial, setCase(page()));
    const state = caseReducer(loaded, logout());

    expect(state.caseData).toEqual([]);
    expect(state.filters).toEqual({ bank: null, caseType: null });
    expect(state.loading).toBe(false);
  });

  it("marks a request in flight and clears the previous error", () => {
    const errored = caseReducer(initial, caseFailure("Network Error"));
    const state = caseReducer(errored, caseStart());

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
    expect(state.success).toBe(false);
  });

  it("keeps the rows already loaded while the next request is in flight", () => {
    const loaded = caseReducer(initial, setCase(page()));
    const state = caseReducer(loaded, caseStart());

    // What lets the list render through a background refresh instead of
    // emptying itself first.
    expect(state.caseData).toHaveLength(2);
  });

  it("stores a page with its cursors and clears loading", () => {
    const state = caseReducer(initial, setCase(page()));

    expect(state.caseData.map((row) => row.id)).toEqual(["c1", "c2"]);
    expect(state.caseFirstId).toBe("c1");
    expect(state.caseLastId).toBe("c2");
    expect(state.hasNextPage).toBe(true);
    expect(state.hasPreviousPage).toBe(false);
    expect(state.loading).toBe(false);
    expect(state.success).toBe(true);
    expect(state.error).toBeNull();
  });

  it("accepts a bare array as the payload", () => {
    const state = caseReducer(initial, setCase([{ id: "c9" }]));

    expect(state.caseData).toEqual([{ id: "c9" }]);
    expect(state.caseLength).toBe(1);
  });

  it("derives caseLength from the rows when the API omits it", () => {
    const state = caseReducer(
      initial,
      setCase(page({ caseLength: undefined })),
    );
    expect(state.caseLength).toBe(2);
  });

  it("holds dataLimit over a response that does not repeat it", () => {
    const loaded = caseReducer(initial, setCase(page()));
    const next = caseReducer(loaded, setCase(page({ dataLimit: undefined })));

    expect(next.dataLimit).toBe(10);
  });

  it("only overwrites the totals when the response carries numbers", () => {
    const loaded = caseReducer(initial, setCase(page()));
    const next = caseReducer(
      loaded,
      setCase(page({ totalCount: undefined, totalActiveCount: undefined })),
    );

    expect(next.totalCount).toBe(20);
    expect(next.totalActiveCount).toBe(18);
  });

  it("accepts zero as a total rather than treating it as missing", () => {
    const loaded = caseReducer(initial, setCase(page()));
    const next = caseReducer(
      loaded,
      setCase(page({ totalCount: 0, totalActiveCount: 0 })),
    );

    expect(next.totalCount).toBe(0);
    expect(next.totalActiveCount).toBe(0);
  });

  it("records a failure without discarding the rows on screen", () => {
    const loaded = caseReducer(initial, setCase(page()));
    const state = caseReducer(loaded, caseFailure("Failed to load cases"));

    expect(state.error).toBe("Failed to load cases");
    expect(state.loading).toBe(false);
    expect(state.success).toBe(false);
    expect(state.caseData).toHaveLength(2);
  });

  it("replaces one row in place after an update", () => {
    const loaded = caseReducer(initial, setCase(page()));
    const state = caseReducer(
      loaded,
      updateCaseInList({ id: "c2", customer_name: "renamed" }),
    );

    expect(state.caseData[1]).toEqual({ id: "c2", customer_name: "renamed" });
    // Order and the rest of the page are untouched.
    expect(state.caseData.map((row) => row.id)).toEqual(["c1", "c2"]);
  });

  it("merges the update into the row rather than swapping it out", () => {
    const loaded = caseReducer(
      initial,
      setCase({
        data: [{ id: "c1", customer_name: "radha", case_type: "flat" }],
      }),
    );
    const state = caseReducer(
      loaded,
      updateCaseInList({ id: "c1", customer_name: "renamed" }),
    );

    // A write response carries the case but not everything the row renders,
    // so fields it leaves out survive.
    expect(state.caseData[0]).toEqual({
      id: "c1",
      customer_name: "renamed",
      case_type: "flat",
    });
  });

  it("ignores an update for a case that is not on the loaded page", () => {
    const loaded = caseReducer(initial, setCase(page()));
    const state = caseReducer(
      loaded,
      updateCaseInList({ id: "not-on-this-page", customer_name: "x" }),
    );

    // Appending it would put a row where the cursor says it does not belong.
    expect(state.caseData.map((row) => row.id)).toEqual(["c1", "c2"]);
  });

  it("ignores an update with no id", () => {
    const loaded = caseReducer(initial, setCase(page()));
    const state = caseReducer(loaded, updateCaseInList(undefined));

    expect(state.caseData).toHaveLength(2);
  });

  it("tracks the search term and the paging direction", () => {
    const searched = caseReducer(initial, setQuery("rahul"));
    expect(searched.searchQuery).toBe("rahul");

    const paged = caseReducer(searched, setDirection("previous"));
    expect(paged.direction).toBe("previous");
  });

  describe("column filters", () => {
    it("starts with every column unfiltered", () => {
      expect(initial.filters).toEqual({ bank: null, caseType: null });
    });

    it("stores the picked values per column", () => {
      const banked = caseReducer(
        initial,
        setCaseFilter({ column: "bank", values: ["bank_001"] }),
      );
      const state = caseReducer(
        banked,
        setCaseFilter({ column: "caseType", values: ["Awaas"] }),
      );

      expect(state.filters).toEqual({
        bank: ["bank_001"],
        caseType: ["Awaas"],
      });
    });

    it("treats a null value list as 'this column is unfiltered'", () => {
      const filtered = caseReducer(
        initial,
        setCaseFilter({ column: "bank", values: ["bank_001"] }),
      );
      const state = caseReducer(
        filtered,
        setCaseFilter({ column: "bank", values: null }),
      );

      expect(state.filters.bank).toBeNull();
    });

    it("ignores a column the table does not filter on", () => {
      const state = caseReducer(
        initial,
        setCaseFilter({ column: "status", values: ["x"] }),
      );

      expect(state.filters).toEqual({ bank: null, caseType: null });
      expect(state.filters.status).toBeUndefined();
    });

    it("clears one column without touching the others", () => {
      const filtered = caseReducer(
        caseReducer(
          initial,
          setCaseFilter({ column: "bank", values: ["bank_001"] }),
        ),
        setCaseFilter({ column: "caseType", values: ["Awaas"] }),
      );
      const state = caseReducer(filtered, clearCaseFilter("bank"));

      expect(state.filters).toEqual({ bank: null, caseType: ["Awaas"] });
    });

    it("clears every column at once", () => {
      const filtered = caseReducer(
        caseReducer(
          initial,
          setCaseFilter({ column: "bank", values: ["bank_001"] }),
        ),
        setCaseFilter({ column: "caseType", values: ["Awaas"] }),
      );
      const state = caseReducer(filtered, clearCaseFilters());

      expect(state.filters).toEqual({ bank: null, caseType: null });
    });

    it("keeps the filters when a new page of rows arrives", () => {
      const filtered = caseReducer(
        initial,
        setCaseFilter({ column: "bank", values: ["bank_001"] }),
      );
      const state = caseReducer(filtered, setCase(page()));

      // Paging and refetching must not silently drop what the user picked.
      expect(state.filters.bank).toEqual(["bank_001"]);
    });
  });
});
