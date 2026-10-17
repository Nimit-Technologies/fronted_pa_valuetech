import { describe, it, expect } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import departmentReducer from "@/store/slice/department/departmentSlice";
import roleReducer from "@/store/slice/role/roleSlice";
import useDepartmentFilters from "@/hooks/filters/useDepartmentFilters";
import useRoleFilters from "@/hooks/filters/useRoleFilters";

// Covers the shared hook through its two real consumers, so the slice
// reducers, the column maps and the filtering helpers are exercised the way
// the department and role list pages wire them up.

const DEPARTMENTS = [
  { id: "d1", name: "sales", branch: { id: "b2", name: "indore" } },
  { id: "d2", name: "support", branch: { id: "b1", name: "bhopal" } },
  { id: "d3", name: "hr", branch: { id: "b2", name: "indore" } },
];

const ROLES = [
  {
    id: "r1",
    name: "manager",
    department: { id: "d1", name: "sales" },
    branch: { id: "b2", name: "indore" },
  },
  {
    id: "r2",
    name: "engineer",
    department: { id: "d2", name: "support" },
    branch: { id: "b1", name: "bhopal" },
  },
  {
    id: "r3",
    name: "lead",
    department: { id: "d1", name: "sales" },
    branch: { id: "b2", name: "indore" },
  },
];

const renderFilters = (hook, reducer) => {
  const store = configureStore({ reducer });
  const wrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  );
  return { ...renderHook(hook, { wrapper }), store };
};

const renderDepartmentFilters = () =>
  renderFilters(useDepartmentFilters, { department: departmentReducer });

const renderRoleFilters = () =>
  renderFilters(useRoleFilters, { role: roleReducer });

describe("useDepartmentFilters", () => {
  it("starts unfiltered and keeps every row", () => {
    const { result } = renderDepartmentFilters();

    expect(result.current.isFiltered).toBe(false);
    expect(result.current.activeColumns).toEqual([]);
    expect(result.current.apply(DEPARTMENTS)).toHaveLength(3);
  });

  it("offers the branches on the page, keyed by the Branch header", () => {
    const { result } = renderDepartmentFilters();

    expect(result.current.buildProps(DEPARTMENTS).Branch.options).toEqual([
      { value: "b1", label: "bhopal" },
      { value: "b2", label: "indore" },
    ]);
  });

  it("keeps only the selected branch's rows", () => {
    const { result } = renderDepartmentFilters();

    act(() => result.current.setFilter("branch", ["b2"]));

    expect(result.current.isFiltered).toBe(true);
    expect(result.current.activeColumns).toEqual(["branch"]);
    expect(result.current.apply(DEPARTMENTS).map((row) => row.id)).toEqual([
      "d1",
      "d3",
    ]);
  });

  it("clears back to every row", () => {
    const { result } = renderDepartmentFilters();

    act(() => result.current.setFilter("branch", ["b2"]));
    act(() => result.current.clearFilter("branch"));

    expect(result.current.isFiltered).toBe(false);
    expect(result.current.apply(DEPARTMENTS)).toHaveLength(3);
  });

  it("ignores a column the slice does not know", () => {
    const { result, store } = renderDepartmentFilters();

    act(() => result.current.setFilter("role", ["x1"]));

    expect(store.getState().department.filters).toEqual({ branch: null });
    expect(result.current.isFiltered).toBe(false);
  });
});

describe("useRoleFilters", () => {
  it("filters on department and branch together", () => {
    const { result } = renderRoleFilters();

    act(() => result.current.setFilter("department", ["d1"]));
    act(() => result.current.setFilter("branch", ["b1"]));

    expect(result.current.activeColumns).toEqual(["department", "branch"]);
    // No role is in d1 and b1 at once.
    expect(result.current.apply(ROLES)).toEqual([]);
  });

  it("narrows the branch options once a department is chosen", () => {
    const { result } = renderRoleFilters();

    act(() => result.current.setFilter("department", ["d1"]));

    const props = result.current.buildProps(ROLES);
    expect(props.Branch.options).toEqual([{ value: "b2", label: "indore" }]);
    // The chosen column still lists everything, or the choice could not be
    // widened again.
    expect(props.Department.options.map((option) => option.value)).toEqual([
      "d1",
      "d2",
    ]);
  });

  it("clears both columns at once", () => {
    const { result, store } = renderRoleFilters();

    act(() => result.current.setFilter("department", ["d1"]));
    act(() => result.current.setFilter("branch", ["b2"]));
    act(() => result.current.clearAll());

    expect(store.getState().role.filters).toEqual({
      department: null,
      branch: null,
    });
    expect(result.current.apply(ROLES)).toHaveLength(3);
  });
});
