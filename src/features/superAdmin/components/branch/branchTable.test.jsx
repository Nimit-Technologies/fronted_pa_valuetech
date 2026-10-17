import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
// The table embeds <UpdateBranch>, whose mutation hook invalidates the cached
// branch list, so rows only render under a Provider.
import { renderWithStore as render } from "@/test/renderWithStore";
import userEvent from "@testing-library/user-event";
import BranchTable from "@/features/superAdmin/components/branch/BranchTable";
import { branchTableHeader } from "@/features/superAdmin/data/branch/branchTableHeader";

const makeBranch = (overrides = {}) => ({
  id: "b1",
  name: "Mumbai",
  isActive: true,
  isDeleted: false,
  ...overrides,
});

describe("BranchTable", () => {
  it("renders column headers", () => {
    render(
      <BranchTable data={[]} headers={branchTableHeader} isLoading={false} />,
    );
    branchTableHeader.forEach((h) => {
      expect(screen.getByText(h)).toBeInTheDocument();
    });
  });

  it('shows "No branches found." when data is empty and not loading', () => {
    render(
      <BranchTable data={[]} headers={branchTableHeader} isLoading={false} />,
    );
    expect(screen.getByText("No branches found.")).toBeInTheDocument();
  });

  it('shows "Loading branches…" during first load', () => {
    render(
      <BranchTable data={[]} headers={branchTableHeader} isLoading={true} />,
    );
    expect(screen.getByText(/Loading branches/)).toBeInTheDocument();
  });

  it("renders a row for each branch", () => {
    const branches = [
      makeBranch({ id: "b1", name: "Mumbai" }),
      makeBranch({ id: "b2", name: "Delhi" }),
    ];
    render(
      <BranchTable
        data={branches}
        headers={branchTableHeader}
        isLoading={false}
      />,
    );
    expect(screen.getByText("Mumbai")).toBeInTheDocument();
    expect(screen.getByText("Delhi")).toBeInTheDocument();
  });

  it('shows "Active" badge for active branches', () => {
    render(
      <BranchTable
        data={[makeBranch({ isActive: true })]}
        headers={branchTableHeader}
        isLoading={false}
      />,
    );
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it('shows "Inactive" badge for inactive branches', () => {
    render(
      <BranchTable
        data={[makeBranch({ isActive: false })]}
        headers={branchTableHeader}
        isLoading={false}
      />,
    );
    expect(screen.getByText("Inactive")).toBeInTheDocument();
  });

  it('shows "Deleted" badge and Restore button for deleted branches', () => {
    render(
      <BranchTable
        data={[makeBranch({ isDeleted: true })]}
        headers={branchTableHeader}
        isLoading={false}
        onRestore={vi.fn()}
      />,
    );
    expect(screen.getByText("Deleted")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /restore/i }),
    ).toBeInTheDocument();
  });

  it("calls onDelete when the delete button is clicked", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    const branch = makeBranch();
    render(
      <BranchTable
        data={[branch]}
        headers={branchTableHeader}
        isLoading={false}
        onDelete={onDelete}
      />,
    );
    // Both row actions are icon-only, so each is named by its title attribute
    // rather than by its label.
    await user.click(screen.getByRole("button", { name: /delete/i }));
    expect(onDelete).toHaveBeenCalledWith(branch);
  });

  it("calls onToggleStatus when status badge is clicked", async () => {
    const user = userEvent.setup();
    const onToggleStatus = vi.fn();
    const branch = makeBranch({ isActive: true });
    render(
      <BranchTable
        data={[branch]}
        headers={branchTableHeader}
        isLoading={false}
        onToggleStatus={onToggleStatus}
      />,
    );
    await user.click(screen.getByText("Active"));
    expect(onToggleStatus).toHaveBeenCalledWith(branch);
  });
});
