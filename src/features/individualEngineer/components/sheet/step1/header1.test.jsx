import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Header1 from "@/features/individualEngineer/components/sheet/step1/header1";

describe("Header1 (sheet step1)", () => {
  it("renders the engineer file number and case id", () => {
    render(<Header1 />);
    expect(screen.getByText("FILE-0254891")).toBeInTheDocument();
    expect(screen.getByText("CASE-80524NCS")).toBeInTheDocument();
  });
});
