import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Ownership from "@/features/individualEngineer/components/sheet/step2/ownership";

describe("Ownership (sheet step2)", () => {
  it("renders the section header and a checkbox per item", () => {
    render(<Ownership data={["Freehold", "Leasehold"]} />);

    expect(screen.getByText("Type of Ownership")).toBeInTheDocument();
    expect(screen.getByText("Freehold")).toBeInTheDocument();
    expect(screen.getByText("Leasehold")).toBeInTheDocument();
    expect(screen.getAllByRole("checkbox")).toHaveLength(2);
  });
});
