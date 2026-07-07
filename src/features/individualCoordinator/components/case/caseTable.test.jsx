import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import CaseTable from "@/features/individualCoordinator/components/case/caseTable";
import { caseTableHeader } from "@/features/individualCoordinator/data/case/caseTableHeader";
import { renderWithRoute } from "@/test/renderWithRouter";

const sampleCase = {
  id: "case_0001",
  file_number: "BANK-12345",
  customer_name: "Rahul Sharma",
  customer_phone_number: "9876543210",
  branch: { branch_id: "branch_001", name: "Noida" },
  bank: { bank_id: "bank_001", display_name: "HDFC (Sector-18)", name: "HDFC" },
  banker: "Praveen Kumar",
  case_type: "Awaas",
  address: {
    lane: "MG Road",
    city: "Noida",
    state: "Uttar Pradesh",
    pin_code: "201301",
  },
  status: "REPORT_SUBMITTED",
  created_at: "2026-01-15T10:30:00Z",
};

function renderTable(data) {
  return renderWithRoute(
    <CaseTable data={{ data }} headers={caseTableHeader} />,
  );
}

describe("CaseTable", () => {
  it("shows an empty state when there are no cases", () => {
    renderTable([]);
    expect(screen.getByText("No cases found.")).toBeInTheDocument();
  });

  it("renders case fields using the correct data-model keys", () => {
    renderTable([sampleCase]);

    expect(screen.getByText("BANK-12345")).toBeInTheDocument();
    expect(screen.getByText("Rahul Sharma")).toBeInTheDocument();
    // customer_phone_number, not the old customer_contact_number typo
    expect(screen.getByText("9876543210")).toBeInTheDocument();
    expect(screen.getByText("HDFC (Sector-18)")).toBeInTheDocument();
    // branch.name, not the old bank_branch typo
    expect(screen.getByText("Noida")).toBeInTheDocument();
    expect(screen.getByText("Praveen Kumar")).toBeInTheDocument();
    expect(screen.getByText("Report Submitted")).toBeInTheDocument();
  });

  it("links row actions to the correct case id", () => {
    renderTable([sampleCase]);

    const links = screen.getAllByRole("link");
    expect(
      links.some(
        (l) => l.getAttribute("href") === "/coordinator/case/view/case_0001",
      ),
    ).toBe(true);
    expect(
      links.some(
        (l) => l.getAttribute("href") === "/coordinator/case/update/case_0001",
      ),
    ).toBe(true);
  });

  it("falls back to '-' for missing optional fields", () => {
    renderTable([{ id: "case_empty", status: undefined }]);
    const dashes = screen.getAllByText("-");
    expect(dashes.length).toBeGreaterThan(0);
  });
});
