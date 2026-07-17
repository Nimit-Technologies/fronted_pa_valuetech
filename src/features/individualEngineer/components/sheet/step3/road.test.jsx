import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Road from "@/features/individualEngineer/components/sheet/step3/road";

describe("Road (sheet step3)", () => {
  it("renders the section header and a checkbox per item", () => {
    render(<Road data={["developed", "undeveloped"]} />);

    expect(screen.getByText("Road condition")).toBeInTheDocument();
    expect(screen.getByText("developed")).toBeInTheDocument();
    expect(screen.getByText("undeveloped")).toBeInTheDocument();
    expect(screen.getAllByRole("checkbox")).toHaveLength(2);
  });
});
