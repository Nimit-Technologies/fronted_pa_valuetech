import { describe, expect, it } from "vitest";
import { normalizeUpdateUserPayload } from "@/features/superAdmin/services/user/updateUser";

const baseForm = {
  id: "u1",
  employeeId: "emp01",
  firstName: "A",
  lastName: "B",
  phone: "9999999999",
  branchId: "br1",
  departmentId: "dep1",
  roleId: "role1",
  city: "c",
  district: "d",
  state: "s",
  pincode: "123456",
  country: "India",
  status: "Active",
};

describe("normalizeUpdateUserPayload business_type_id", () => {
  it("sends the id for a coordinator", () => {
    const payload = normalizeUpdateUserPayload({
      ...baseForm,
      role: "cordinator",
      businessTypeId: "bt1",
    });
    expect(payload.business_type_id).toBe("bt1");
  });

  it("normalizes casing and whitespace on the role name", () => {
    const payload = normalizeUpdateUserPayload({
      ...baseForm,
      role: "  Cordinator ",
      businessTypeId: "bt1",
    });
    expect(payload.business_type_id).toBe("bt1");
  });

  it("sends an explicit null for a non-coordinator, surviving the blank strip", () => {
    const payload = normalizeUpdateUserPayload({
      ...baseForm,
      role: "engineer",
      businessTypeId: "bt1",
    });
    expect("business_type_id" in payload).toBe(true);
    expect(payload.business_type_id).toBeNull();
  });

  it("sends null when a coordinator is demoted and the id was cleared", () => {
    const payload = normalizeUpdateUserPayload({
      ...baseForm,
      role: "branch admin",
      businessTypeId: "",
    });
    expect(payload.business_type_id).toBeNull();
  });

  it("omits the key for a coordinator with no id yet, rather than sending null", () => {
    const payload = normalizeUpdateUserPayload({
      ...baseForm,
      role: "cordinator",
      businessTypeId: "",
    });
    expect("business_type_id" in payload).toBe(false);
  });

  it("still strips other blank optionals", () => {
    const payload = normalizeUpdateUserPayload({
      ...baseForm,
      role: "cordinator",
      businessTypeId: "bt1",
      email: "",
    });
    expect("email" in payload).toBe(false);
  });
});
