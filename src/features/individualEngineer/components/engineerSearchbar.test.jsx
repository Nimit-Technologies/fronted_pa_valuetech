import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EngineerSearchbar from "@/features/individualEngineer/components/engineerSearchbar";

describe("EngineerSearchbar", () => {
  it("renders the default placeholder", () => {
    render(<EngineerSearchbar />);
    expect(screen.getByPlaceholderText("Search branch...")).toBeInTheDocument();
  });

  it("renders a custom placeholder", () => {
    render(<EngineerSearchbar placeholder="Search cases..." />);
    expect(screen.getByPlaceholderText("Search cases...")).toBeInTheDocument();
  });

  it("calls onSearch with the typed value", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<EngineerSearchbar onSearch={onSearch} />);

    await user.type(screen.getByPlaceholderText("Search branch..."), "abc");
    expect(onSearch).toHaveBeenCalledTimes(3);
    expect(onSearch).toHaveBeenLastCalledWith("abc");
  });

  it("does not throw when onSearch is not provided", async () => {
    const user = userEvent.setup();
    render(<EngineerSearchbar />);
    await user.type(screen.getByPlaceholderText("Search branch..."), "a");
  });
});
