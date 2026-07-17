import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Neighborhood from "@/features/individualEngineer/components/sheet/step2/neighborhood";

describe("Neighborhood (sheet step2)", () => {
  it("renders the section header and a checkbox per item", () => {
    render(<Neighborhood data={["posh", "good", "poor"]} />);

    expect(screen.getByText("Neighborhood classification")).toBeInTheDocument();
    expect(screen.getByText("posh")).toBeInTheDocument();
    expect(screen.getByText("good")).toBeInTheDocument();
    expect(screen.getByText("poor")).toBeInTheDocument();
    expect(screen.getAllByRole("checkbox")).toHaveLength(3);
  });
});
