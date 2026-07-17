import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Step5 from "@/features/individualEngineer/pages/report/steps/step5";
import { sheetData } from "@/features/individualEngineer/data/sheet.js";

describe("Step5 (report wizard)", () => {
  it("renders every item from sheetData.step5", () => {
    render(<Step5 />);
    sheetData.step5.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });
});
