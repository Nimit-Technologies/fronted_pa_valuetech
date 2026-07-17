import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import Step1 from "@/features/individualEngineer/pages/report/steps/step1";
import { renderWithRoute } from "@/test/renderWithRouter";

function renderForId(id) {
  return renderWithRoute(<Step1 />, {
    route: `/engineer/report/create/${id}`,
    path: "/engineer/report/create/:id",
  });
}

describe("Step1 (report wizard)", () => {
  it("renders the header banners and the case section for a known id", () => {
    renderForId("case_0001");

    expect(screen.getByText("CASE-80524NCS")).toBeInTheDocument();
    expect(screen.getByText("VISIT_IN_PROGRESS")).toBeInTheDocument();
    expect(screen.getByDisplayValue("BANK-12345")).not.toBeDisabled();
  });

  it("shows 'Case not found.' in the section for an unknown id", () => {
    renderForId("does-not-exist");
    expect(screen.getByText("Case not found.")).toBeInTheDocument();
  });
});
