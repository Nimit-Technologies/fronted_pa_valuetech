import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SuperAdminCard from "@/features/superAdmin/components/superAdminCard";

describe("SuperAdminCard", () => {
  it("renders the title and numeric value", () => {
    render(<SuperAdminCard title="Total Branches" value={12} />);
    expect(screen.getByText("Total Branches")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
  });

  it("shows an em dash when value is null", () => {
    render(<SuperAdminCard title="Total Branches" value={null} />);
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("shows an em dash when value is undefined", () => {
    render(<SuperAdminCard title="Total Branches" />);
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("renders 0 as a valid value instead of falling back", () => {
    render(<SuperAdminCard title="Active Branches" value={0} />);
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("shows a loading skeleton when loading is true", () => {
    render(<SuperAdminCard title="Total Branches" value={5} loading />);
    expect(screen.getByLabelText("Loading")).toBeInTheDocument();
    expect(screen.queryByText("5")).not.toBeInTheDocument();
  });

  it("does not show the loading skeleton when loading is false", () => {
    render(<SuperAdminCard title="Total Branches" value={5} loading={false} />);
    expect(screen.queryByLabelText("Loading")).not.toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });
});
