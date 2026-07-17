import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Step2 from "@/features/individualEngineer/pages/report/steps/step2";
import { sheetData } from "@/features/individualEngineer/data/sheet.js";

describe("Step2 (report wizard)", () => {
  it("renders the person-met-at-site fields and every sheet section", () => {
    render(<Step2 />);

    expect(screen.getByText("Person meet at the site")).toBeInTheDocument();
    expect(screen.getByText("Type of locality")).toBeInTheDocument();
    expect(screen.getByText("Type of colony")).toBeInTheDocument();
    expect(screen.getByText("Type of Ownership")).toBeInTheDocument();
    expect(screen.getByText("Neighborhood classification")).toBeInTheDocument();
    expect(screen.getByText("Type of property")).toBeInTheDocument();
    expect(screen.getByText("Type of Construction")).toBeInTheDocument();
    expect(screen.getByText("Occupation Status")).toBeInTheDocument();
    expect(
      screen.getByText("if rented, details of rented area & rent"),
    ).toBeInTheDocument();
  });

  it("renders every item from sheetData.locality as a checklist option", () => {
    render(<Step2 />);
    sheetData.locality.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });
});
