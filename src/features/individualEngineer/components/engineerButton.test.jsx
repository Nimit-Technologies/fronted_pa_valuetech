import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EngineerButton from "@/features/individualEngineer/components/engineerButton";

describe("EngineerButton", () => {
  it("renders default 'Submit' label and type", () => {
    render(<EngineerButton />);
    const button = screen.getByRole("button", { name: "Submit" });
    expect(button).toHaveAttribute("type", "submit");
  });

  it("renders custom children and respects the type prop", () => {
    render(<EngineerButton type="button">Save</EngineerButton>);
    expect(screen.getByRole("button", { name: "Save" })).toHaveAttribute(
      "type",
      "button",
    );
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<EngineerButton onClick={onClick}>Go</EngineerButton>);

    await user.click(screen.getByRole("button", { name: "Go" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
