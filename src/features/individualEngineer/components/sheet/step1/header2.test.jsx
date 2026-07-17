import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Header2 from "@/features/individualEngineer/components/sheet/step1/header2";

describe("Header2 (sheet step1)", () => {
  it("renders the file number, assigned date, visit date and status badge", () => {
    render(<Header2 />);
    expect(screen.getByText("FILE-0254891")).toBeInTheDocument();
    expect(screen.getByText("25-July-2026")).toBeInTheDocument();
    expect(screen.getByText("28-July-2026")).toBeInTheDocument();
    expect(screen.getByText("VISIT_IN_PROGRESS")).toBeInTheDocument();
  });
});
