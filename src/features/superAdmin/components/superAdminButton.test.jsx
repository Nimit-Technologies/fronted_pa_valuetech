import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SuperAdminButton from "@/features/superAdmin/components/superAdminButton";

describe("SuperAdminButton", () => {
  it('renders "Submit" as default children', () => {
    render(<SuperAdminButton />);
    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });

  it("renders custom children text", () => {
    render(<SuperAdminButton>Create Branch</SuperAdminButton>);
    expect(
      screen.getByRole("button", { name: "Create Branch" }),
    ).toBeInTheDocument();
  });

  it('defaults to type="submit"', () => {
    render(<SuperAdminButton />);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("accepts a custom type prop", () => {
    render(<SuperAdminButton type="button" />);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <SuperAdminButton type="button" onClick={handleClick}>
        Click me
      </SuperAdminButton>,
    );
    await user.click(screen.getByRole("button", { name: "Click me" }));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it("applies the capitalize class", () => {
    render(<SuperAdminButton />);
    expect(screen.getByRole("button").className).toMatch(/capitalize/);
  });
});
