import { describe, it, expect } from "vitest";
import {
  normalizeBranch,
  normalizeBranches,
} from "@/features/superAdmin/services/branch/normalizeBranch";

describe("normalizeBranch", () => {
  it("returns null for a falsy input", () => {
    expect(normalizeBranch(null)).toBeNull();
    expect(normalizeBranch(undefined)).toBeNull();
  });

  it("maps standard API fields to the internal shape", () => {
    const raw = {
      id: "b1",
      name: "Mumbai",
      code: "MUM",
      is_active: true,
      is_deleted: false,
    };
    expect(normalizeBranch(raw)).toEqual({
      id: "b1",
      name: "Mumbai",
      code: "MUM",
      isActive: true,
      isDeleted: false,
    });
  });

  it("falls back to alternate key names", () => {
    const raw = {
      branch_id: "b2",
      branch_name: "Delhi",
      branch_code: "DEL",
      status: "ACTIVE",
      deleted_at: null,
    };
    expect(normalizeBranch(raw)).toEqual({
      id: "b2",
      name: "Delhi",
      code: "DEL",
      isActive: true,
      isDeleted: false,
    });
  });

  it("falls back to _id when neither id nor branch_id exist", () => {
    const raw = { _id: "b3", name: "Pune" };
    expect(normalizeBranch(raw).id).toBe("b3");
  });

  it('defaults name to "N/A" and code to empty string', () => {
    const raw = { id: "b4" };
    const result = normalizeBranch(raw);
    expect(result.name).toBe("N/A");
    expect(result.code).toBe("");
  });

  it("treats a non-null deleted_at as isDeleted = true", () => {
    const raw = { id: "b5", name: "Test", deleted_at: "2025-01-01" };
    expect(normalizeBranch(raw).isDeleted).toBe(true);
  });

  it("unwraps a nested .data wrapper", () => {
    const raw = { data: { id: "b6", name: "Nested", code: "N" } };
    expect(normalizeBranch(raw)).toEqual({
      id: "b6",
      name: "Nested",
      code: "N",
      isActive: undefined,
      isDeleted: false,
    });
  });
});

describe("normalizeBranches", () => {
  it("returns an empty array for a non-array input", () => {
    expect(normalizeBranches(null)).toEqual([]);
    expect(normalizeBranches(undefined)).toEqual([]);
    expect(normalizeBranches("not-an-array")).toEqual([]);
  });

  it("normalizes every item in the array", () => {
    const raw = [
      { id: "b1", name: "A" },
      { id: "b2", name: "B" },
    ];
    const result = normalizeBranches(raw);
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe("A");
    expect(result[1].name).toBe("B");
  });
});
