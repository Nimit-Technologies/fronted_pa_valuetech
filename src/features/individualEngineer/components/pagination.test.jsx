import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Pagination from "@/features/individualEngineer/components/pagination";

describe("Pagination", () => {
  it("renders default page 1 of 5", () => {
    render(<Pagination />);
    expect(screen.getByText("Page 1 of 5")).toBeInTheDocument();
  });

  it("renders the given current page and total pages", () => {
    render(<Pagination currentPage={3} totalPages={10} />);
    expect(screen.getByText("Page 3 of 10")).toBeInTheDocument();
  });

  it("disables 'Previous' on the first page and 'Next' on the last page", () => {
    render(<Pagination currentPage={1} totalPages={1} />);
    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
  });

  it("enables both buttons on a middle page and calls the handlers", async () => {
    const user = userEvent.setup();
    const onPrev = vi.fn();
    const onNext = vi.fn();
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPrev={onPrev}
        onNext={onNext}
      />,
    );

    const prevButton = screen.getByRole("button", { name: "Previous" });
    const nextButton = screen.getByRole("button", { name: "Next" });
    expect(prevButton).toBeEnabled();
    expect(nextButton).toBeEnabled();

    await user.click(prevButton);
    await user.click(nextButton);
    expect(onPrev).toHaveBeenCalledTimes(1);
    expect(onNext).toHaveBeenCalledTimes(1);
  });
});
