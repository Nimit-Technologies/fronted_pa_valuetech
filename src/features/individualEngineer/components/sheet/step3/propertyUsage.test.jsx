import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PropertyUsage from "@/features/individualEngineer/components/sheet/step3/propertyUsage";

describe("PropertyUsage (sheet step3)", () => {
  it("renders the section header and a checkbox per item", () => {
    render(<PropertyUsage data={["residential", "commercial"]} />);

    expect(screen.getByText("Property Usage")).toBeInTheDocument();
    expect(screen.getByText("residential")).toBeInTheDocument();
    expect(screen.getByText("commercial")).toBeInTheDocument();
    expect(screen.getAllByRole("checkbox")).toHaveLength(2);
  });
});
