import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PropertyLocation from "@/features/individualEngineer/components/sheet/step3/propertyLocation";

describe("PropertyLocation (sheet step3)", () => {
  it("renders the section header and a checkbox per item", () => {
    render(<PropertyLocation data={["corner plot", "main road"]} />);

    expect(screen.getByText("Property Location")).toBeInTheDocument();
    expect(screen.getByText("corner plot")).toBeInTheDocument();
    expect(screen.getByText("main road")).toBeInTheDocument();
    expect(screen.getAllByRole("checkbox")).toHaveLength(2);
  });
});
