import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import SuperAdminTableHeader from "@/features/superAdmin/components/superAdminTableHeader";

describe("SuperAdminTableHeader", () => {
  it("renders the search bar and the create button slot", () => {
    const createBtn = <button type="button">Create Branch</button>;
    render(
      <SuperAdminTableHeader
        onSearch={vi.fn()}
        createButton={createBtn}
        placeholder="Search branch..."
      />,
    );
    expect(screen.getByPlaceholderText("Search branch...")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Create Branch" }),
    ).toBeInTheDocument();
  });

  it("passes disabled to the search bar", () => {
    render(
      <SuperAdminTableHeader
        onSearch={vi.fn()}
        createButton={null}
        disabled
        placeholder="Search..."
      />,
    );
    expect(screen.getByPlaceholderText("Search...")).toBeDisabled();
  });
});
