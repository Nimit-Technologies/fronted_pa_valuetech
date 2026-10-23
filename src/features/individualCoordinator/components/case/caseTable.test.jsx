import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CaseTable from "@/features/individualCoordinator/components/case/CaseTable";
import { caseTableHeader } from "@/features/individualCoordinator/data/case/caseTableHeader";
import { renderWithRoute } from "@/test/renderWithRouter";

// One row exactly as GET /case/all-case returns it (caseListInclude +
// shapeCase + formatCaseResponse): relations are objects, the status is
// { code, name }, and the date column is created_at.
const sampleCase = {
  id: "case_0001",
  file_number: "BANK-12345",
  customer_name: "Rahul Sharma",
  customer_contact_number: "9876543210",
  banker_name: "Praveen Kumar",
  case_type: "Awaas",
  branch: { id: "branch_001", name: "Noida" },
  bank: {
    id: "bank_001",
    name: "HDFC",
    display_name: "HDFC (Sector-18)",
    bank_branch: "Sector-18",
    bank_branch_code: "HDFC001",
  },
  business_type: { id: "bt_001", name: "Retail" },
  status: {
    id: "status_07",
    code: "report_completed",
    name: "report completed",
    is_terminal: false,
  },
  employee: {
    id: "user_010",
    first_name: "Amit",
    last_name: "Singh",
    employee_id: "EMP010",
  },
  address: {
    id: "addr_001",
    lane: "MG Road",
    landmark: "Near City Mall",
    city: "Noida",
    district: "Gautam Budh Nagar",
    state: "Uttar Pradesh",
    pin_code: "201301",
    country: "India",
  },
  is_deleted: false,
  created_at: "2026-01-15 10:30:00",
};

function renderTable(data, props = {}) {
  return renderWithRoute(
    <CaseTable data={data} headers={caseTableHeader} {...props} />,
  );
}

describe("CaseTable", () => {
  it("shows an empty state when there are no cases", () => {
    renderTable([]);
    expect(screen.getByText("No cases found.")).toBeInTheDocument();
  });

  it("shows a loading row instead of the empty state on the first load", () => {
    renderTable([], { isLoading: true });
    expect(screen.getByText(/loading cases/i)).toBeInTheDocument();
    expect(screen.queryByText("No cases found.")).not.toBeInTheDocument();
  });

  it("renders case fields using the list-API keys", () => {
    renderTable([sampleCase]);

    expect(screen.getByText("BANK-12345")).toBeInTheDocument();
    expect(screen.getByText("Rahul Sharma")).toBeInTheDocument();
    // customer_contact_number / banker_name, as the API names them
    expect(screen.getByText("9876543210")).toBeInTheDocument();
    expect(screen.getByText("Praveen Kumar")).toBeInTheDocument();
    expect(screen.getByText("HDFC (Sector-18)")).toBeInTheDocument();
    // "bank branch" is the bank's own branch, not the valuer's branch
    expect(screen.getByText("Sector-18")).toBeInTheDocument();
    // status is a relation now; its display name drives the badge
    expect(screen.getByText("Report Completed")).toBeInTheDocument();
    // date column is created_at, formatted dd Mon yyyy
    expect(screen.getByText("15 Jan 2026")).toBeInTheDocument();
    expect(
      screen.getByText("MG Road, Noida, Uttar Pradesh, 201301"),
    ).toBeInTheDocument();
  });

  it("links row actions to the correct case id", () => {
    renderTable([sampleCase]);

    const links = screen.getAllByRole("link");
    expect(
      links.some(
        (l) => l.getAttribute("href") === "/cordinator/case/view/case_0001",
      ),
    ).toBe(true);
    expect(
      links.some(
        (l) => l.getAttribute("href") === "/cordinator/case/update/case_0001",
      ),
    ).toBe(true);
    expect(
      links.some(
        (l) => l.getAttribute("href") === "/cordinator/report/view/case_0001",
      ),
    ).toBe(true);
  });

  it("falls back to '-' for missing optional fields", () => {
    renderTable([{ id: "case_empty", status: undefined }]);
    const dashes = screen.getAllByText("-");
    expect(dashes.length).toBeGreaterThan(0);
  });

  it("renders a column filter only in the header cells it is given", () => {
    renderTable([sampleCase], {
      columnFilters: {
        bank: { label: "bank", options: [], selected: null },
        "case type": { label: "case type", options: [], selected: null },
      },
    });

    expect(screen.getByLabelText("Filter bank")).toBeInTheDocument();
    expect(screen.getByLabelText("Filter case type")).toBeInTheDocument();
    // Columns without a filter definition keep a plain header.
    expect(screen.queryByLabelText("Filter banker")).not.toBeInTheDocument();
  });

  it("reports the picked values back through the column's onChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    renderTable([sampleCase], {
      columnFilters: {
        "case type": {
          label: "case type",
          options: [
            { value: "Awaas", label: "Awaas" },
            { value: "LAP", label: "LAP" },
          ],
          selected: null,
          onChange,
        },
      },
    });

    await user.click(screen.getByLabelText("Filter case type"));
    // Unfiltered means every value is kept, so unticking one leaves the rest.
    await user.click(screen.getByRole("checkbox", { name: "LAP" }));

    expect(onChange).toHaveBeenCalledWith(["Awaas"]);
  });

  it("disables the filters while a page is loading", () => {
    renderTable([sampleCase], {
      isLoading: true,
      columnFilters: {
        bank: { label: "bank", options: [], selected: null },
      },
    });

    expect(screen.getByLabelText("Filter bank")).toBeDisabled();
  });
});
