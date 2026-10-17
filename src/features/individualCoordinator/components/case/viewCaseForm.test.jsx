import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import ViewCaseForm from "@/features/individualCoordinator/components/case/ViewCaseForm";
import { renderWithRoute } from "@/test/renderWithRouter";

// The record as GET /case/:id returns it.
const sampleCase = {
  id: "case_0001",
  file_number: "BANK-12345",
  customer_name: "Rahul Sharma",
  customer_contact_number: "9876543210",
  banker_name: "Praveen Kumar",
  case_type: "Awaas",
  business_type: { id: "bt_001", name: "Retail" },
  bank: {
    id: "bank_001",
    name: "HDFC",
    display_name: "HDFC (Sector-18)",
    bank_branch: "Sector-18",
  },
  branch: { id: "branch_001", name: "Noida" },
  status: { id: "s1", code: "open", name: "open", is_terminal: false },
  employee: {
    id: "user_010",
    first_name: "Amit",
    last_name: "Singh",
    employee_id: "EMP010",
    phone: "9123456789",
  },
  address: {
    lane: "MG Road",
    landmark: "Near City Mall",
    city: "Noida",
    district: "Gautam Budh Nagar",
    state: "Uttar Pradesh",
    pin_code: "201301",
    country: "India",
  },
};

describe("ViewCaseForm", () => {
  it("shows 'Case not found.' when it has no case", () => {
    renderWithRoute(<ViewCaseForm />);
    expect(screen.getByText("Case not found.")).toBeInTheDocument();
  });

  it("renders the case's fields as disabled inputs", () => {
    renderWithRoute(<ViewCaseForm caseItem={sampleCase} />);

    expect(screen.getByDisplayValue("BANK-12345")).toBeDisabled();
    expect(screen.getByDisplayValue("Rahul Sharma")).toBeDisabled();
    expect(screen.getByDisplayValue("9876543210")).toBeDisabled();
    expect(screen.getByDisplayValue("Praveen Kumar")).toBeDisabled();
    // the bank's branch, not the valuer's branch
    expect(screen.getByDisplayValue("Sector-18")).toBeDisabled();
    expect(screen.getByDisplayValue("Gautam Budh Nagar")).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "HDFC (Sector-18)" }),
    ).toBeDisabled();
    // employee { first_name, last_name, phone } backs the allocated-user block
    expect(screen.getByDisplayValue("Amit Singh")).toBeDisabled();
    expect(screen.getByDisplayValue("9123456789")).toBeDisabled();
  });

  it("leaves the allocated-user block blank for an unassigned case", () => {
    renderWithRoute(
      <ViewCaseForm caseItem={{ ...sampleCase, employee: null }} />,
    );

    expect(screen.queryByDisplayValue("Amit Singh")).not.toBeInTheDocument();
    expect(screen.queryByDisplayValue("9123456789")).not.toBeInTheDocument();
  });
});
