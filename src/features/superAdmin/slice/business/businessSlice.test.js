import { describe, it, expect } from "vitest";
import businessReducer, {
  businessStart,
  businessSuccess,
  businessFailure,
  setBusinessFilter,
  clearBusinessFilter,
  clearBusinessFilters,
} from "@/features/superAdmin/slice/business/businessSlice";
import {
  selectBusinessActiveCount,
  selectBusinessFilters,
  selectBusinessTotalCount,
} from "@/features/superAdmin/slice/business/businessSelectors";

const initialState = {
  businessData: [],
  filters: { branch: null },
  businessFirstId: null,
  businessLastId: null,
  hasNextPage: false,
  hasPreviousPage: false,
  businessLength: 0,
  dataLimit: null,
  direction: "next",
  totalCount: 0,
  totalActiveCount: 0,
  loading: false,
  error: null,
  success: null,
};

const row = (overrides = {}) => ({
  id: "bt1",
  name: "retail banks",
  branchId: "br1",
  isActive: true,
  isDeleted: false,
  ...overrides,
});

describe("businessSlice", () => {
  it("returns the initial state", () => {
    expect(businessReducer(undefined, { type: "@@INIT" })).toEqual(
      initialState,
    );
  });

  describe("businessStart", () => {
    it("sets loading, clears error and success", () => {
      const state = businessReducer(
        { ...initialState, error: "old error", success: true },
        businessStart(),
      );
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.success).toBe(false);
    });
  });

  describe("businessFailure", () => {
    it("stores the message and stops loading", () => {
      const state = businessReducer(
        { ...initialState, loading: true },
        businessFailure("boom"),
      );
      expect(state).toMatchObject({
        loading: false,
        success: false,
        error: "boom",
      });
    });
  });

  describe("businessSuccess", () => {
    it("stores rows and pagination from the payload", () => {
      const rows = [row(), row({ id: "bt2" })];
      const state = businessReducer(
        initialState,
        businessSuccess({
          data: rows,
          businessFirstId: "bt1",
          businessLastId: "bt2",
          hasNextPage: true,
          hasPreviousPage: false,
          dataLimit: 10,
          businessLength: 2,
          direction: "next",
        }),
      );
      expect(state.businessData).toEqual(rows);
      expect(state).toMatchObject({
        businessFirstId: "bt1",
        businessLastId: "bt2",
        hasNextPage: true,
        hasPreviousPage: false,
        dataLimit: 10,
        businessLength: 2,
        loading: false,
        error: null,
        success: true,
      });
    });

    it("accepts a bare array payload as the rows", () => {
      const rows = [row()];
      const state = businessReducer(initialState, businessSuccess(rows));
      expect(state.businessData).toEqual(rows);
      expect(state.businessLength).toBe(1);
    });

    it("falls back to the row count when businessLength is absent", () => {
      const state = businessReducer(
        initialState,
        businessSuccess({ data: [row(), row({ id: "bt2" })] }),
      );
      expect(state.businessLength).toBe(2);
    });

    it("keeps the previous dataLimit when the payload omits it", () => {
      const state = businessReducer(
        { ...initialState, dataLimit: 10 },
        businessSuccess({ data: [row()] }),
      );
      expect(state.dataLimit).toBe(10);
    });

    // The business list endpoint never sends these two, so the guard below is
    // what stops an absent total from zeroing a previously known one.
    it("keeps existing totals when the payload omits them", () => {
      const state = businessReducer(
        { ...initialState, totalCount: 7, totalActiveCount: 5 },
        businessSuccess({ data: [row()] }),
      );
      expect(state.totalCount).toBe(7);
      expect(state.totalActiveCount).toBe(5);
    });

    it("adopts totals only when they are numbers", () => {
      const state = businessReducer(
        { ...initialState, totalCount: 7, totalActiveCount: 5 },
        businessSuccess({
          data: [row()],
          totalCount: 0,
          totalActiveCount: null,
        }),
      );
      expect(state.totalCount).toBe(0);
      expect(state.totalActiveCount).toBe(5);
    });

    it("leaves the column filters alone when new rows arrive", () => {
      const state = businessReducer(
        { ...initialState, filters: { branch: ["br1"] } },
        businessSuccess({ data: [row()] }),
      );
      expect(state.filters).toEqual({ branch: ["br1"] });
    });
  });

  describe("column filters", () => {
    it("stores the selected branch ids", () => {
      const state = businessReducer(
        initialState,
        setBusinessFilter({ column: "branch", values: ["br1", "br2"] }),
      );
      expect(state.filters.branch).toEqual(["br1", "br2"]);
    });

    it("treats a null value as no filter on that column", () => {
      const state = businessReducer(
        { ...initialState, filters: { branch: ["br1"] } },
        setBusinessFilter({ column: "branch", values: null }),
      );
      expect(state.filters.branch).toBeNull();
    });

    it("keeps an empty selection, which filters every row out", () => {
      const state = businessReducer(
        initialState,
        setBusinessFilter({ column: "branch", values: [] }),
      );
      expect(state.filters.branch).toEqual([]);
    });

    it("ignores a column the table cannot filter", () => {
      const state = businessReducer(
        initialState,
        setBusinessFilter({ column: "department", values: ["d1"] }),
      );
      expect(state.filters).toEqual({ branch: null });
    });

    it("survives an action with no payload", () => {
      const state = businessReducer(initialState, setBusinessFilter());
      expect(state.filters).toEqual({ branch: null });
    });

    it("clears one column", () => {
      const state = businessReducer(
        { ...initialState, filters: { branch: ["br1"] } },
        clearBusinessFilter("branch"),
      );
      expect(state.filters.branch).toBeNull();
    });

    it("clears every column", () => {
      const state = businessReducer(
        { ...initialState, filters: { branch: ["br1"] } },
        clearBusinessFilters(),
      );
      expect(state.filters).toEqual({ branch: null });
    });
  });
});

describe("businessSelectors count fallbacks", () => {
  it("counts the loaded page when the API sends no totals", () => {
    const business = {
      ...initialState,
      businessData: [
        row(),
        row({ id: "bt2", isActive: false }),
        row({ id: "bt3", isDeleted: true }),
      ],
    };
    expect(selectBusinessTotalCount({ business })).toBe(3);
    expect(selectBusinessActiveCount({ business })).toBe(1);
  });

  it("prefers the API totals when present", () => {
    const business = {
      ...initialState,
      businessData: [row()],
      totalCount: 42,
      totalActiveCount: 30,
    };
    expect(selectBusinessTotalCount({ business })).toBe(42);
    expect(selectBusinessActiveCount({ business })).toBe(30);
  });

  it("reads the column filters off the slice", () => {
    const business = { ...initialState, filters: { branch: ["br1"] } };
    expect(selectBusinessFilters({ business })).toEqual({ branch: ["br1"] });
  });

  it("excludes inactive and soft-deleted rows from the active count", () => {
    const business = {
      ...initialState,
      businessData: [
        row({ id: "a", isActive: true, isDeleted: false }),
        row({ id: "b", isActive: true, isDeleted: true }),
        row({ id: "c", isActive: false, isDeleted: false }),
      ],
    };
    expect(selectBusinessActiveCount({ business })).toBe(1);
  });
});
