import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Transport from "@/features/individualEngineer/components/sheet/step3/transport";

describe("Transport (sheet step3)", () => {
  it("renders the section header and a checkbox per item", () => {
    render(<Transport data={["railway", "bus stand", "hospital"]} />);

    expect(screen.getByText("Facilities")).toBeInTheDocument();
    expect(screen.getByText("railway")).toBeInTheDocument();
    expect(screen.getByText("bus stand")).toBeInTheDocument();
    expect(screen.getByText("hospital")).toBeInTheDocument();
    expect(screen.getAllByRole("checkbox")).toHaveLength(3);
  });
});
