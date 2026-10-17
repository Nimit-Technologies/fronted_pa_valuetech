import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import BranchAdminCard from "@/features/branchAdmin/component/BranchAdminCard";
import SuperAdminCard from "@/features/superAdmin/components/SuperAdminCard";

// Both dashboards' cards must behave identically — the branch-admin one only
// grew a loading state so the two could not drift.
describe.each([
  ["BranchAdminCard", BranchAdminCard],
  ["SuperAdminCard", SuperAdminCard],
])("%s", (_name, Card) => {
  it("shows the value when not loading", () => {
    render(<Card title="Total Users" value={12} />);
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.queryByLabelText("Loading")).not.toBeInTheDocument();
  });

  it("shows a placeholder instead of the value while loading", () => {
    render(<Card title="Total Users" value={12} loading />);
    expect(screen.getByLabelText("Loading")).toBeInTheDocument();
    expect(screen.queryByText("12")).not.toBeInTheDocument();
  });

  it('renders an em dash for an unknown value, not "0"', () => {
    render(<Card title="Total Users" value={null} />);
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("renders a real zero rather than the em dash", () => {
    render(<Card title="Active Users" value={0} />);
    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.queryByText("—")).not.toBeInTheDocument();
  });

  it("still renders the title while loading", () => {
    render(<Card title="Total Departments" value={undefined} loading />);
    expect(screen.getByText("Total Departments")).toBeInTheDocument();
  });
});
