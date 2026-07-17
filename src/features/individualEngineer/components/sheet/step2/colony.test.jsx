import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Colony from "@/features/individualEngineer/components/sheet/step2/colony";

describe("Colony (sheet step2)", () => {
  it("renders the section header and a checkbox per item", () => {
    render(<Colony data={["authorized", "unauthorized", "MCD"]} />);

    expect(screen.getByText("Type of colony")).toBeInTheDocument();
    expect(screen.getByText("authorized")).toBeInTheDocument();
    expect(screen.getByText("unauthorized")).toBeInTheDocument();
    expect(screen.getByText("MCD")).toBeInTheDocument();
    expect(screen.getAllByRole("checkbox")).toHaveLength(3);
  });
});
