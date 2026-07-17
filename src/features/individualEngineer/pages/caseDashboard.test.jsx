import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CaseDashboard from "@/features/individualEngineer/pages/caseDashboard";
import { caseData } from "@/features/individualEngineer/data/case/caseTable";
import { renderWithRoute } from "@/test/renderWithRouter";

describe("CaseDashboard (Engineer)", () => {
  it("shows total case and visit-completed counts from caseData.meta", () => {
    const { container } = renderWithRoute(<CaseDashboard />);

    const cardTitles = Array.from(
      container.querySelectorAll('[data-slot="card-description"]'),
    ).map((el) => el.textContent);
    const cardValues = Array.from(
      container.querySelectorAll('[data-slot="card-title"]'),
    ).map((el) => el.textContent);

    expect(cardTitles).toContain("Total Case");
    expect(cardTitles).toContain("Visit Completed");
    expect(cardValues).toContain(String(caseData.meta.total_cases));
    expect(cardValues).toContain(String(caseData.meta.visit_completed));
  });

  it("renders one row per case in caseData", () => {
    renderWithRoute(<CaseDashboard />);
    caseData.data.forEach((c) => {
      expect(screen.getByText(c.customer_name)).toBeInTheDocument();
    });
  });

  it("filters rows by search query across name, file number, banker and bank", async () => {
    const user = userEvent.setup();
    renderWithRoute(<CaseDashboard />);

    const searchInput = screen.getByPlaceholderText(/search/i);
    await user.type(searchInput, "Priya");

    expect(screen.getByText("Priya Verma")).toBeInTheDocument();
    expect(screen.queryByText("Rahul Sharma")).not.toBeInTheDocument();
  });

  it("shows a 'no cases found' state when the search matches nothing", async () => {
    const user = userEvent.setup();
    renderWithRoute(<CaseDashboard />);

    const searchInput = screen.getByPlaceholderText(/search/i);
    await user.type(searchInput, "no-such-customer-xyz");

    expect(screen.getByText("No cases found.")).toBeInTheDocument();
  });
});
