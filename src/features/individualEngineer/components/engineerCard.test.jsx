import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import EngineerCard from "@/features/individualEngineer/components/engineerCard";

describe("EngineerCard", () => {
  it("renders the title and value", () => {
    render(<EngineerCard title="Total Case" value={5} />);
    expect(screen.getByText("Total Case")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("shows an em dash when value is not provided", () => {
    render(<EngineerCard title="Total Case" />);
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("renders a value of 0 instead of falling back to the placeholder", () => {
    render(<EngineerCard title="Visit Pending" value={0} />);
    expect(screen.getByText("0")).toBeInTheDocument();
  });
});
