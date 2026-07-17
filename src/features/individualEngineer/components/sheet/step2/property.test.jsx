import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Property from "@/features/individualEngineer/components/sheet/step2/property";

describe("Property (sheet step2)", () => {
  it("renders the section header and a checkbox per item", () => {
    render(<Property data={["bunglow", "Society", "shop"]} />);

    expect(screen.getByText("Type of property")).toBeInTheDocument();
    expect(screen.getByText("bunglow")).toBeInTheDocument();
    expect(screen.getByText("Society")).toBeInTheDocument();
    expect(screen.getByText("shop")).toBeInTheDocument();
    expect(screen.getAllByRole("checkbox")).toHaveLength(3);
  });
});
