import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Construction from "@/features/individualEngineer/components/sheet/step2/construction";

describe("Construction (sheet step2)", () => {
  it("renders the section header and a checkbox per item", () => {
    render(<Construction data={["RCC Framed Structure", "Tin shed"]} />);

    expect(screen.getByText("Type of Construction")).toBeInTheDocument();
    expect(screen.getByText("RCC Framed Structure")).toBeInTheDocument();
    expect(screen.getByText("Tin shed")).toBeInTheDocument();
    expect(screen.getAllByRole("checkbox")).toHaveLength(2);
  });
});
