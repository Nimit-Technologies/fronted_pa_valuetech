import { describe, it, expect } from "vitest";
import bankReducer, {
  EMPTY_BANK_FILTERS,
  bankSuccess,
  setBankFilter,
  clearBankFilter,
  clearBankFilters,
} from "@/features/branchAdmin/slice/bank/bankSlice";

const initialState = bankReducer(undefined, { type: "@@INIT" });
const stateWith = (filters) => ({ ...initialState, filters });

describe("bankSlice column filters", () => {
  it("starts with every column unfiltered", () => {
    expect(initialState.filters).toEqual({ name: null });
  });

  it("does not share the frozen defaults with the live state", () => {
    const state = bankReducer(
      undefined,
      setBankFilter({ column: "name", values: ["HDFC"] }),
    );
    expect(state.filters.name).toEqual(["HDFC"]);
    expect(EMPTY_BANK_FILTERS.name).toBeNull();
  });

  describe("setBankFilter", () => {
    it("stores the selected values on the column", () => {
      const state = bankReducer(
        stateWith({ name: null }),
        setBankFilter({ column: "name", values: ["HDFC", "ICICI"] }),
      );
      expect(state.filters.name).toEqual(["HDFC", "ICICI"]);
    });

    it("treats a null selection as unfiltered", () => {
      const state = bankReducer(
        stateWith({ name: ["HDFC"] }),
        setBankFilter({ column: "name", values: null }),
      );
      expect(state.filters.name).toBeNull();
    });

    it("keeps an empty selection, which filters everything out", () => {
      const state = bankReducer(
        stateWith({ name: null }),
        setBankFilter({ column: "name", values: [] }),
      );
      expect(state.filters.name).toEqual([]);
    });

    it("ignores a column the table does not filter on", () => {
      const state = bankReducer(
        stateWith({ name: ["HDFC"] }),
        setBankFilter({ column: "gstNumber", values: ["x"] }),
      );
      expect(state.filters).toEqual({ name: ["HDFC"] });
    });

    it("ignores a malformed payload", () => {
      const state = bankReducer(stateWith({ name: ["HDFC"] }), {
        type: setBankFilter.type,
      });
      expect(state.filters).toEqual({ name: ["HDFC"] });
    });
  });

  describe("clearBankFilter", () => {
    it("unfilters just that column", () => {
      const state = bankReducer(
        stateWith({ name: ["HDFC"] }),
        clearBankFilter("name"),
      );
      expect(state.filters.name).toBeNull();
    });

    it("ignores an unknown column", () => {
      const state = bankReducer(
        stateWith({ name: ["HDFC"] }),
        clearBankFilter("nope"),
      );
      expect(state.filters).toEqual({ name: ["HDFC"] });
    });
  });

  describe("clearBankFilters", () => {
    it("resets every column", () => {
      const state = bankReducer(
        stateWith({ name: ["HDFC"] }),
        clearBankFilters(),
      );
      expect(state.filters).toEqual({ name: null });
    });
  });

  it("survives a page load, since filters outlive the rows", () => {
    const filtered = stateWith({ name: ["HDFC"] });
    const state = bankReducer(
      filtered,
      bankSuccess({ data: [{ id: "k1", name: "ICICI" }] }),
    );
    expect(state.filters).toEqual({ name: ["HDFC"] });
    expect(state.bankData).toHaveLength(1);
  });
});
