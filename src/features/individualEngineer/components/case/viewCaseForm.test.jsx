import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import ViewCaseForm from "@/features/individualEngineer/components/case/viewCaseForm";
import { renderWithRoute } from "@/test/renderWithRouter";

const caseItem = {
  file_number: "BANK-12345",
  customer_name: "Rahul Sharma",
  customer_contact_number: "9876543210",
  case_type: "Awaas",
  bank: { display_name: "HDFC (Noida Sector-18)" },
  employee: {
    first_name: "Ravi",
    last_name: "Kumar",
    phone: "9876500000",
  },
  address: {
    city: "Noida",
    district: "Gautam Budh Nagar",
    state: "Uttar Pradesh",
    pin_code: "201301",
  },
};

describe("ViewCaseForm (Engineer)", () => {
  it("shows 'Case not found.' when no case is provided", () => {
    renderWithRoute(<ViewCaseForm />);
    expect(screen.getByText("Case not found.")).toBeInTheDocument();
  });

  it("renders the case and assigned engineer fields as disabled inputs", () => {
    renderWithRoute(<ViewCaseForm caseItem={caseItem} />);

    expect(screen.getByDisplayValue("BANK-12345")).toBeDisabled();
    expect(screen.getByDisplayValue("Rahul Sharma")).toBeDisabled();
    expect(screen.getByDisplayValue("9876543210")).toBeDisabled();
    expect(screen.getByDisplayValue("Ravi Kumar")).toBeDisabled();
    expect(screen.getByDisplayValue("9876500000")).toBeDisabled();
    expect(screen.getByDisplayValue("Noida")).toBeDisabled();
    expect(screen.getByDisplayValue("Gautam Budh Nagar")).toBeDisabled();
    expect(screen.getByDisplayValue("HDFC (Noida Sector-18)")).toBeDisabled();
  });
});
