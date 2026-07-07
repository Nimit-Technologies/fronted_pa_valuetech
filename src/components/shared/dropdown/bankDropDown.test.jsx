import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BankDropDown from "@/components/shared/dropdown/bankDropDown";

describe("BankDropDown", () => {
  it("shows a placeholder when no bank is selected", () => {
    render(<BankDropDown />);
    expect(
      screen.getByRole("button", { name: "Select Bank" }),
    ).toBeInTheDocument();
  });

  it("shows the selected bank name as the trigger label", () => {
    render(<BankDropDown value="HDFC" />);
    expect(screen.getByRole("button", { name: "HDFC" })).toBeInTheDocument();
  });

  it("disables the trigger when disabled is true", () => {
    render(<BankDropDown value="HDFC" disabled />);
    expect(screen.getByRole("button", { name: "HDFC" })).toBeDisabled();
  });

  it("calls onSelect with the bank name when an option is picked", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<BankDropDown onSelect={onSelect} />);

    await user.click(screen.getByRole("button", { name: "Select Bank" }));
    await user.click(await screen.findByText("ICICI"));

    expect(onSelect).toHaveBeenCalledWith("ICICI");
  });

  it("filters bank options by search term", async () => {
    const user = userEvent.setup();
    render(<BankDropDown />);

    await user.click(screen.getByRole("button", { name: "Select Bank" }));
    await user.type(screen.getByPlaceholderText("Search banks..."), "SBI");

    // SBI's name and code are both literally "SBI", so it renders twice (name + code)
    expect(screen.getAllByText("SBI").length).toBeGreaterThan(0);
    expect(screen.queryByText("HDFC")).not.toBeInTheDocument();
  });
});
