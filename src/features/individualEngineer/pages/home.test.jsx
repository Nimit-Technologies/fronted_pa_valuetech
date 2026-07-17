import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import IndividualEngineerHome from "@/features/individualEngineer/pages/home";
import { caseData } from "@/features/individualEngineer/data/case/caseTable";
import { renderWithRoute } from "@/test/renderWithRouter";

describe("IndividualEngineerHome", () => {
  it("shows total, completed and pending visit counts derived from caseData.meta", () => {
    renderWithRoute(<IndividualEngineerHome />);

    const { total_cases, visit_completed } = caseData.meta;

    expect(screen.getByText(String(total_cases))).toBeInTheDocument();
    expect(screen.getAllByText(String(visit_completed)).length).toBeGreaterThan(
      0,
    );
    expect(
      screen.getByText(String(total_cases - visit_completed)),
    ).toBeInTheDocument();
  });

  it("renders the three summary cards", () => {
    const { container } = renderWithRoute(<IndividualEngineerHome />);
    const cardTitles = Array.from(
      container.querySelectorAll('[data-slot="card-description"]'),
    ).map((el) => el.textContent);

    expect(cardTitles).toContain("Total case");
    expect(cardTitles).toContain("visit completed");
    expect(cardTitles).toContain("visit pending");
  });
});
