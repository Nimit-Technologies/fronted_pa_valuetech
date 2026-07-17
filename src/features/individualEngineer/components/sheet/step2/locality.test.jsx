import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Locality from "@/features/individualEngineer/components/sheet/step2/locality";

describe("Locality (sheet step2)", () => {
  it("renders the section header and a checkbox per item", () => {
    render(<Locality data={["residential", "commercial", "industrial"]} />);

    expect(screen.getByText("Type of locality")).toBeInTheDocument();
    expect(screen.getByText("residential")).toBeInTheDocument();
    expect(screen.getByText("commercial")).toBeInTheDocument();
    expect(screen.getByText("industrial")).toBeInTheDocument();
    expect(screen.getAllByRole("checkbox")).toHaveLength(3);
  });
});
