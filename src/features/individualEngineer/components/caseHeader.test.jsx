import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CaseHeader from "@/features/individualEngineer/components/caseHeader";

const caseItem = {
  coordinator: { first_name: "John", phone_number: "9876543210" },
  created_at: "2026-01-15T10:30:00Z",
  status: "ASSIGNED_TO_ENGINEER",
};

describe("CaseHeader", () => {
  it("renders the coordinator name, phone number, assigned date and status", () => {
    render(<CaseHeader caseItem={caseItem} />);

    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("9876543210")).toBeInTheDocument();
    expect(screen.getByText("15 Jan 2026")).toBeInTheDocument();
    expect(screen.getByText("Assigned To Engineer")).toBeInTheDocument();
  });

  it("falls back to '-' when caseItem is missing", () => {
    render(<CaseHeader />);
    const dashes = screen.getAllByText("-");
    expect(dashes.length).toBeGreaterThan(0);
  });
});
