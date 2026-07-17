import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Step6 from "@/features/individualEngineer/pages/report/steps/step6";
import { sheetData } from "@/features/individualEngineer/data/sheet.js";

describe("Step6 (report wizard)", () => {
  it("renders every item from sheetData.step6", () => {
    render(<Step6 />);
    sheetData.step6.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });
});
