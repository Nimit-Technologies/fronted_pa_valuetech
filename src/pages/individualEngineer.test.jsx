import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import IndividualEngineer from "@/pages/individualEngineer";
import { renderWithRoute } from "@/test/renderWithRouter";

describe("IndividualEngineer page", () => {
  it("renders the engineer layout with its sidebar navigation", () => {
    renderWithRoute(<IndividualEngineer />);

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Case management")).toBeInTheDocument();
  });
});
