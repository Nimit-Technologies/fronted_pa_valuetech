import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Header2 from "@/features/individualEngineer/components/sheet/step1/header2";

describe("Header2 (sheet step1)", () => {
  it("renders the task file number, assignment date and status", () => {
    render(
      <Header2
        task={{
          file_number: "BANK-12345",
          assigned_at: "2026-01-15 10:30:00",
          status: { code: "visit_in_progress" },
        }}
      />,
    );
    expect(screen.getByText("BANK-12345")).toBeInTheDocument();
    expect(screen.getByText("15 Jan 2026")).toBeInTheDocument();
    expect(screen.getByText("Visit In Progress")).toBeInTheDocument();
    expect(screen.getByText("-")).toBeInTheDocument();
  });
});
