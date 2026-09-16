import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SuperAdminSearchbar from "@/features/superAdmin/components/superAdminSearchbar";

describe("SuperAdminSearchbar", () => {
  it("renders a search input with the default placeholder", () => {
    render(<SuperAdminSearchbar onSearch={vi.fn()} />);
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  });

  it("renders a custom placeholder", () => {
    render(
      <SuperAdminSearchbar onSearch={vi.fn()} placeholder="Search branch..." />,
    );
    expect(screen.getByPlaceholderText("Search branch...")).toBeInTheDocument();
  });

  it("disables the input when disabled is true", () => {
    render(<SuperAdminSearchbar onSearch={vi.fn()} disabled />);
    expect(screen.getByPlaceholderText("Search...")).toBeDisabled();
  });
});
