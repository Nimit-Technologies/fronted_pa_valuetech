import { describe, it, expect } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import businessReducer from "@/features/superAdmin/slice/business/businessSlice";
import useBusinessFilters from "@/features/superAdmin/hooks/business/useBusinessFilters";

// Rows are the normalized shape the list page holds, so these cover the
// camelCase reads that differ from the department / role column maps.
const BUSINESSES = [
  {
    id: "bt1",
    name: "retail banks",
    branchId: "br2",
    branch: { id: "br2", name: "indore" },
  },
  {
    id: "bt2",
    name: "cooperative banks",
    branchId: "br1",
    branch: { id: "br1", name: "bhopal" },
  },
  {
    id: "bt3",
    name: "nbfc",
    branchId: "br2",
    branch: { id: "br2", name: "indore" },
  },
];

const renderBusinessFilters = () => {
  const store = configureStore({ reducer: { business: businessReducer } });
  const wrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  );
  return { ...renderHook(useBusinessFilters, { wrapper }), store };
};

describe("useBusinessFilters", () => {
  it("starts unfiltered and keeps every row", () => {
    const { result } = renderBusinessFilters();

    expect(result.current.isFiltered).toBe(false);
    expect(result.current.apply(BUSINESSES)).toHaveLength(3);
  });

  it("offers the branches on the page under the Branch header", () => {
    const { result } = renderBusinessFilters();

    expect(result.current.buildProps(BUSINESSES).Branch.options).toEqual([
      { value: "br1", label: "bhopal" },
      { value: "br2", label: "indore" },
    ]);
  });

  it("keeps only the selected branch's rows", () => {
    const { result } = renderBusinessFilters();

    act(() => result.current.setFilter("branch", ["br2"]));

    expect(result.current.activeColumns).toEqual(["branch"]);
    expect(result.current.apply(BUSINESSES).map((row) => row.id)).toEqual([
      "bt1",
      "bt3",
    ]);
  });

  // normalizeBusiness keeps branchId even when the branch include is absent,
  // so such a row still groups under its real branch instead of dropping out
  // of the table the moment that branch is selected.
  it("falls back to branchId when the branch relation is missing", () => {
    const rows = [
      ...BUSINESSES,
      { id: "bt4", name: "mfi", branchId: "br2", branch: null },
    ];
    const { result } = renderBusinessFilters();

    act(() => result.current.setFilter("branch", ["br2"]));

    expect(result.current.apply(rows).map((row) => row.id)).toEqual([
      "bt1",
      "bt3",
      "bt4",
    ]);
  });

  it("clears back to every row", () => {
    const { result } = renderBusinessFilters();

    act(() => result.current.setFilter("branch", ["br2"]));
    act(() => result.current.clearAll());

    expect(result.current.isFiltered).toBe(false);
    expect(result.current.apply(BUSINESSES)).toHaveLength(3);
  });
});
