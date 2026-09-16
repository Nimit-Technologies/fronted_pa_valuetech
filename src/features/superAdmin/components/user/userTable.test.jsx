import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UserTable from "@/features/superAdmin/components/user/userTable";
import { renderWithRoute } from "@/test/renderWithRouter";

const makeUser = (overrides = {}) => ({
  id: "u1",
  employee_id: "EMP001",
  first_name: "Ravi",
  last_name: "Kumar",
  phone: "9876543210",
  aadhaar_number: "XXXX1234",
  branch: { id: "b1", name: "Mumbai" },
  department: { id: "d1", name: "Engineering" },
  role: { id: "r1", name: "Engineer" },
  is_active: true,
  is_deleted: false,
  ...overrides,
});

const headers = [
  "s.no",
  "employee id",
  "name",
  "phone",
  "aadhaar",
  "branch",
  "department",
  "role",
  "status",
  "Action",
];

describe("UserTable", () => {
  it("renders column headers", () => {
    renderWithRoute(
      <UserTable data={[]} headers={headers} isLoading={false} />,
    );
    headers.forEach((h) => {
      expect(screen.getByText(h)).toBeInTheDocument();
    });
  });

  it('shows "No users found." when data is empty and not loading', () => {
    renderWithRoute(
      <UserTable data={[]} headers={headers} isLoading={false} />,
    );
    expect(screen.getByText("No users found.")).toBeInTheDocument();
  });

  it("shows a custom empty message", () => {
    renderWithRoute(
      <UserTable
        data={[]}
        headers={headers}
        isLoading={false}
        emptyMessage="Nothing here."
      />,
    );
    expect(screen.getByText("Nothing here.")).toBeInTheDocument();
  });

  it('shows "Loading users…" during first load', () => {
    renderWithRoute(
      <UserTable data={[]} headers={headers} isLoading={true} />,
    );
    expect(screen.getByText(/Loading users/)).toBeInTheDocument();
  });

  it("renders user data in cells", () => {
    renderWithRoute(
      <UserTable data={[makeUser()]} headers={headers} isLoading={false} />,
    );
    expect(screen.getByText("EMP001")).toBeInTheDocument();
    expect(screen.getByText("Ravi Kumar")).toBeInTheDocument();
    expect(screen.getByText("9876543210")).toBeInTheDocument();
    expect(screen.getByText("Mumbai")).toBeInTheDocument();
    expect(screen.getByText("Engineering")).toBeInTheDocument();
    expect(screen.getByText("Engineer")).toBeInTheDocument();
  });

  it('shows "Active" status badge for active users', () => {
    renderWithRoute(
      <UserTable
        data={[makeUser({ is_active: true })]}
        headers={headers}
        isLoading={false}
      />,
    );
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it('shows "Inactive" status badge for inactive users', () => {
    renderWithRoute(
      <UserTable
        data={[makeUser({ is_active: false })]}
        headers={headers}
        isLoading={false}
      />,
    );
    expect(screen.getByText("Inactive")).toBeInTheDocument();
  });

  it('shows "Deleted" badge and Restore button for deleted users', () => {
    renderWithRoute(
      <UserTable
        data={[makeUser({ is_deleted: true })]}
        headers={headers}
        isLoading={false}
        onRestore={vi.fn()}
      />,
    );
    expect(screen.getByText("Deleted")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /restore/i }),
    ).toBeInTheDocument();
  });

  it("shows N/A for missing user fields", () => {
    const user = makeUser({
      first_name: null,
      last_name: null,
      phone: null,
      aadhaar_number: null,
      branch: null,
      department: null,
      role: null,
    });
    renderWithRoute(
      <UserTable data={[user]} headers={headers} isLoading={false} />,
    );
    // Multiple N/A cells expected
    expect(screen.getAllByText("N/A").length).toBeGreaterThanOrEqual(4);
  });
});
