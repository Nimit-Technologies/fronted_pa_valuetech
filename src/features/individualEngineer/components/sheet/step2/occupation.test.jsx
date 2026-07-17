import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Occupation from "@/features/individualEngineer/components/sheet/step2/occupation";

describe("Occupation (sheet step2)", () => {
  it("renders the section header and a checkbox per item", () => {
    render(<Occupation data={["Applicant occupied", "rented", "Vacant"]} />);

    expect(screen.getByText("Occupation Status")).toBeInTheDocument();
    expect(screen.getByText("Applicant occupied")).toBeInTheDocument();
    expect(screen.getByText("rented")).toBeInTheDocument();
    expect(screen.getByText("Vacant")).toBeInTheDocument();
    expect(screen.getAllByRole("checkbox")).toHaveLength(3);
  });
});
