import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import ViewCaseForm from "@/features/individualEngineer/components/case/viewCaseForm";
import { renderWithRoute } from "@/test/renderWithRouter";

function renderForId(id) {
  return renderWithRoute(<ViewCaseForm />, {
    route: `/engineer/case/view/${id}`,
    path: "/engineer/case/view/:id",
  });
}

describe("ViewCaseForm (Engineer)", () => {
  it("shows 'Case not found.' for an unknown id", () => {
    renderForId("does-not-exist");
    expect(screen.getByText("Case not found.")).toBeInTheDocument();
  });

  it("renders the matched case's fields as disabled inputs", () => {
    renderForId("case_0001");

    expect(screen.getByDisplayValue("BANK-12345")).toBeDisabled();
    expect(screen.getByDisplayValue("Rahul Sharma")).toBeDisabled();
    expect(screen.getByDisplayValue("9876543210")).toBeDisabled();
    expect(screen.getByDisplayValue("Noida")).toBeDisabled();
    expect(screen.getByDisplayValue("Gautam Budh Nagar")).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "HDFC (Noida Sector-18)" }),
    ).toBeDisabled();
  });
});
