import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Step3 from "@/features/individualEngineer/pages/report/steps/step3";
import { sheetData } from "@/features/individualEngineer/data/sheet.js";

describe("Step3 (report wizard)", () => {
  it("renders every sheet section for this step", () => {
    render(<Step3 />);

    expect(screen.getByText("Property Usage")).toBeInTheDocument();
    expect(screen.getByText("Property Location")).toBeInTheDocument();
    expect(screen.getByText("How it cover on (Direction)")).toBeInTheDocument();
    expect(screen.getByText("Facilities")).toBeInTheDocument();
    expect(screen.getByText("Road condition")).toBeInTheDocument();
  });

  it("renders every item from sheetData.coverage as an input field", () => {
    render(<Step3 />);
    sheetData.coverage.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });
});
