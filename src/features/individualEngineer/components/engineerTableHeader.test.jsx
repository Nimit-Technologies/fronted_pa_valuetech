import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EngineerTableHeader from "@/features/individualEngineer/components/engineerTableHeader";

describe("EngineerTableHeader", () => {
  it("renders the search bar", () => {
    render(<EngineerTableHeader />);
    expect(screen.getByPlaceholderText("Search branch...")).toBeInTheDocument();
  });

  it("forwards search input to onSearch", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<EngineerTableHeader onSearch={onSearch} />);

    await user.type(screen.getByPlaceholderText("Search branch..."), "x");
    expect(onSearch).toHaveBeenCalledWith("x");
  });
});
