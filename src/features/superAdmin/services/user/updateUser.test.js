import { describe, it, expect } from "vitest";
import { normalizeUpdateUserPayload } from "./updateUser";

describe("normalizeUpdateUserPayload", () => {
  it("maps the form payload to backend update keys and removes UI-only fields", () => {
    const payload = {
      id: "user_123",
      employeeId: "EMP-101",
      firstName: "Rohit",
      lastName: "Sharma",
      email: "rohit@example.com",
      phone: "9876543210",
      aadharNumber: "123456789012",
      branch: { id: "branch_1", name: "Noida" },
      branchId: "branch_1",
      department: { id: "dept_2", name: "Engineering" },
      departmentId: "dept_2",
      role: { id: "role_3", name: "Admin" },
      status: "Active",
      city: "Noida",
      district: "GB Nagar",
      state: "UP",
      pincode: "201301",
      country: "India",
      lane: "Sector 62",
      landmark: "Near Metro",
    };

    expect(normalizeUpdateUserPayload(payload)).toEqual({
      employee_id: "EMP-101",
      first_name: "Rohit",
      last_name: "Sharma",
      email: "rohit@example.com",
      phone: "9876543210",
      aadhaar_number: "123456789012",
      branch_id: "branch_1",
      department_id: "dept_2",
      role_id: "role_3",
      is_active: true,
      address: {
        city: "Noida",
        district: "GB Nagar",
        state: "UP",
        pin_code: "201301",
        country: "India",
        lane: "Sector 62",
        landmark: "Near Metro",
      },
    });
  });
});
