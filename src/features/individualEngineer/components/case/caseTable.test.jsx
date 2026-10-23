import { describe, it, expect, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { formatStatus } from "@/constants/formatStatus";
import CaseTable from "@/features/individualEngineer/components/case/engineerCaseTable";
import { caseTableHeader } from "@/features/individualEngineer/data/case/caseTableHeader";
import { renderWithRoute } from "@/test/renderWithRouter";

vi.mock("@/components/shared/dropdown/statusDropdown", () => ({
  default: ({ value, onSelect, disabled, placeholder }) => (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onSelect({ id: "status_1", code: "visit_schedule" })}
    >
      {formatStatus(value?.code || placeholder)}
    </button>
  ),
}));

const sampleCase = {
  task_id: "allocation_001",
  case_id: "case_0001",
  assigned_at: "2026-01-15 10:30:00",
  file_number: "BANK-12345",
  customer_name: "Rahul Sharma",
  customer_contact_number: "9876543210",
  case_type: "Awaas",
  bank: { id: "bank_001", display_name: "HDFC (Noida Sector-18)" },
  assigned_by: {
    first_name: "John",
    last_name: "Smith",
    phone: "9876500000",
  },
  address: {
    lane: "MG Road",
    city: "Noida",
    state: "Uttar Pradesh",
    pin_code: "201301",
  },
  status: { code: "assigned_to_engineer" },
};

function renderTable(data, props = {}) {
  return renderWithRoute(
    <CaseTable tasks={data} headers={caseTableHeader} {...props} />,
  );
}

describe("CaseTable (Engineer)", () => {
  it("shows an empty state when there are no cases", () => {
    renderTable([]);
    expect(screen.getByText("No tasks found.")).toBeInTheDocument();
  });

  it("renders task and assignment fields using the API response keys", () => {
    renderTable([sampleCase]);

    expect(screen.getByText("BANK-12345")).toBeInTheDocument();
    expect(screen.getByText("10:30 AM")).toBeInTheDocument();
    expect(screen.getByText("Rahul Sharma")).toBeInTheDocument();
    expect(screen.getByText("9876543210")).toBeInTheDocument();
    expect(screen.getByText("HDFC (Noida Sector-18)")).toBeInTheDocument();
    expect(screen.getByText("John Smith")).toBeInTheDocument();
    expect(screen.getByText("9876500000")).toBeInTheDocument();
    expect(screen.getByText("Assigned To Engineer")).toBeInTheDocument();
    expect(
      screen.getByText("MG Road, Noida, Uttar Pradesh, 201301"),
    ).toBeInTheDocument();
  });

  it("passes the selected status and case ID to the dashboard handler", () => {
    const onStatusSelect = vi.fn();
    renderTable([sampleCase], { onStatusSelect });

    fireEvent.click(
      screen.getByRole("button", { name: "Assigned To Engineer" }),
    );

    expect(onStatusSelect).toHaveBeenCalledWith("case_0001", {
      id: "status_1",
      code: "visit_schedule",
    });
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
    renderTable([{ task_id: "task_empty", case_id: "case_empty" }]);
    const dashes = screen.getAllByText("-");
    expect(dashes.length).toBeGreaterThan(0);
  });

  it("renders pagination controls below the table", () => {
    renderTable([sampleCase]);
    expect(screen.getByText("Page 1")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
  });
});
