import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import CaseTable from "@/features/individualEngineer/components/case/caseTable";
import { caseTableHeader } from "@/features/individualEngineer/data/case/caseTableHeader";
import { renderWithRoute } from "@/test/renderWithRouter";

const sampleCase = {
  id: "case_0001",
  file_number: "BANK-12345",
  customer_name: "Rahul Sharma",
  customer_phone_number: "9876543210",
  case_type: "Awaas",
  bank: { bank_id: "bank_001", display_name: "HDFC (Noida Sector-18)" },
  coordinator: { first_name: "John", phone_number: "9876543210" },
  address: {
    lane: "MG Road",
    city: "Noida",
    state: "Uttar Pradesh",
    pin_code: "201301",
  },
  status: "ASSIGNED_TO_ENGINEER",
  created_at: "2026-01-15T10:30:00Z",
};

function renderTable(data) {
  return renderWithRoute(
    <CaseTable data={{ data }} headers={caseTableHeader} />,
  );
}

describe("CaseTable (Engineer)", () => {
  it("shows an empty state when there are no cases", () => {
    renderTable([]);
    expect(screen.getByText("No cases found.")).toBeInTheDocument();
  });

  it("renders case fields using the correct data-model keys", () => {
    renderTable([sampleCase]);

    expect(screen.getByText("BANK-12345")).toBeInTheDocument();
    expect(screen.getByText("Rahul Sharma")).toBeInTheDocument();
    // customer_phone_number and coordinator.phone_number are both this value
    expect(screen.getAllByText("9876543210")).toHaveLength(2);
    expect(screen.getByText("HDFC (Noida Sector-18)")).toBeInTheDocument();
    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("Assigned To Engineer")).toBeInTheDocument();
  });

  it("links row actions to the correct case id", () => {
    renderTable([sampleCase]);

    const links = screen.getAllByRole("link");
    expect(
      links.some(
        (l) => l.getAttribute("href") === "/engineer/case/view/case_0001",
      ),
    ).toBe(true);
    expect(
      links.some(
        (l) => l.getAttribute("href") === "/engineer/report/view/case_0001",
      ),
    ).toBe(true);
  });

  it("falls back to '-' for missing optional fields", () => {
    renderTable([{ id: "case_empty", status: undefined }]);
    const dashes = screen.getAllByText("-");
    expect(dashes.length).toBeGreaterThan(0);
  });

  it("renders pagination controls below the table", () => {
    renderTable([sampleCase]);
    expect(screen.getByText(/page 1 of/i)).toBeInTheDocument();
  });
});
