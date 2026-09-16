import { describe, it, expect } from "vitest";
import branchReducer, {
  branchStart,
  branchSuccess,
  branchFailure,
} from "@/features/superAdmin/slice/branch/branchSlice";

const initialState = {
  branchData: [],
  branchFirstId: null,
  branchLastId: null,
  hasNextPage: false,
  hasPreviousPage: false,
  branchLength: 0,
  dataLimit: null,
  direction: "next",
  searchQuery: "",
  totalCount: 0,
  totalActiveCount: 0,
  loading: false,
  error: null,
  success: null,
};

describe("branchSlice", () => {
  it("returns the initial state", () => {
    expect(branchReducer(undefined, { type: "@@INIT" })).toEqual(initialState);
  });

  describe("branchStart", () => {
    it("sets loading to true, clears error and success", () => {
      const state = branchReducer(
        { ...initialState, error: "old error", success: true },
        branchStart(),
      );
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.success).toBe(false);
    });
  });

  describe("branchFailure", () => {
    it("sets loading to false and stores the error message", () => {
      const state = branchReducer(
        { ...initialState, loading: true },
        branchFailure("Network error"),
      );
      expect(state.loading).toBe(false);
      expect(state.error).toBe("Network error");
      expect(state.success).toBe(false);
    });
  });

  describe("branchSuccess", () => {
    it("populates branch data and pagination fields", () => {
      const payload = {
        data: [{ id: "b1", name: "Mumbai" }],
        branchFirstId: "b1",
        branchLastId: "b1",
        hasNextPage: true,
        hasPreviousPage: false,
        branchLength: 1,
        dataLimit: 10,
        totalCount: 25,
        totalActiveCount: 20,
        direction: "next",
        searchQuery: "mum",
      };
      const state = branchReducer(initialState, branchSuccess(payload));
      expect(state.branchData).toEqual(payload.data);
      expect(state.branchFirstId).toBe("b1");
      expect(state.branchLastId).toBe("b1");
      expect(state.hasNextPage).toBe(true);
      expect(state.hasPreviousPage).toBe(false);
      expect(state.totalCount).toBe(25);
      expect(state.totalActiveCount).toBe(20);
      expect(state.searchQuery).toBe("mum");
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.success).toBe(true);
    });

    it("keeps previous totalCount when the payload does not carry it", () => {
      const prev = { ...initialState, totalCount: 30, totalActiveCount: 25 };
      const state = branchReducer(
        prev,
        branchSuccess({
          data: [],
          direction: "next",
        }),
      );
      // totalCount was not a number in payload → preserved
      expect(state.totalCount).toBe(30);
      expect(state.totalActiveCount).toBe(25);
    });

    it("handles a plain array as the payload", () => {
      const items = [
        { id: "b1", name: "A" },
        { id: "b2", name: "B" },
      ];
      const state = branchReducer(initialState, branchSuccess(items));
      expect(state.branchData).toEqual(items);
    });
  });
});
