import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Header1 from "@/features/individualEngineer/components/sheet/step1/header1";

describe("Header1 (sheet step1)", () => {
  it("renders the engineer name and selected task case id", () => {
    render(
      <Header1
        user={{ first_name: "Ravi", last_name: "Kumar" }}
        task={{ case_id: "case_0001" }}
      />,
    );
    expect(screen.getByText("Engineer - Ravi Kumar")).toBeInTheDocument();
    expect(screen.getByText("case_0001")).toBeInTheDocument();
  });
});
