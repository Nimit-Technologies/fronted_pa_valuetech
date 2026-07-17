import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Step4 from "@/features/individualEngineer/pages/report/steps/step4";

describe("Step4 (report wizard)", () => {
  it("renders a table row for every floor and a column for every field", () => {
    render(<Step4 />);

    expect(screen.getByText("Floor wise : Built up area")).toBeInTheDocument();
    [
      "Basement",
      "Stilt",
      "Ground floor",
      "First floor",
      "Second floor",
      "Third floor",
      "Fourth floor & above",
      "Mezzanine",
    ].forEach((floor) => {
      expect(screen.getByText(floor)).toBeInTheDocument();
    });

    expect(screen.getByText("Accommodation")).toBeInTheDocument();
    expect(screen.getByText("Carpet / covered")).toBeInTheDocument();
    expect(screen.getByText("Occupancy")).toBeInTheDocument();
    expect(screen.getByText("Purpose")).toBeInTheDocument();
  });

  it("updates a floor's cell value when the user types into it", async () => {
    const user = userEvent.setup();
    render(<Step4 />);

    const groundFloorRow = screen.getByText("Ground floor").closest("tr");
    const accommodationInput = groundFloorRow.querySelectorAll("input")[0];

    await user.type(accommodationInput, "2BHK");
    expect(accommodationInput).toHaveValue("2BHK");
  });

  it("keeps each floor's inputs independent", async () => {
    const user = userEvent.setup();
    render(<Step4 />);

    const groundFloorRow = screen.getByText("Ground floor").closest("tr");
    const firstFloorRow = screen.getByText("First floor").closest("tr");

    await user.type(
      groundFloorRow.querySelectorAll("input")[0],
      "Ground value",
    );

    expect(firstFloorRow.querySelectorAll("input")[0]).toHaveValue("");
  });
});
