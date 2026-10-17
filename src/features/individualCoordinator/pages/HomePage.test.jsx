import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import IndividualCoordinatorHome from "@/features/individualCoordinator/pages/HomePage";

vi.mock("@/features/individualCoordinator/services/case/allCases", () => ({
  default: vi.fn(),
}));

// The greeting reads the session; it is not what these assertions are about.
vi.mock("@/components/shared/greetingHeader", () => ({
  default: () => <div>greeting</div>,
}));

const AllCaseAPI = (
  await import("@/features/individualCoordinator/services/case/allCases")
).default;

const cardValues = (container) =>
  Array.from(container.querySelectorAll('[data-slot="card-title"]')).map(
    (el) => el.textContent,
  );

describe("IndividualCoordinatorHome", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("counts every case in scope, including the finished ones", async () => {
    AllCaseAPI.mockResolvedValue({
      success: true,
      data: [],
      totalCount: 42,
      totalActiveCount: 37,
    });

    const { container } = render(<IndividualCoordinatorHome />);

    await waitFor(() => expect(cardValues(container)).toContain("42"));
    // active, and finished as the exact difference between the two totals
    expect(cardValues(container)).toContain("37");
    expect(cardValues(container)).toContain("5");

    expect(AllCaseAPI).toHaveBeenCalledWith({ include_finished: "true" });
  });

  it("shows placeholders rather than zeros before the counts arrive", () => {
    AllCaseAPI.mockReturnValue(new Promise(() => {}));

    const { container } = render(<IndividualCoordinatorHome />);

    expect(cardValues(container)).toEqual(["—", "—", "—"]);
  });

  it("reports a failed load and retries", async () => {
    const user = userEvent.setup();
    AllCaseAPI.mockRejectedValueOnce(new Error("Network Error"));

    const { container } = render(<IndividualCoordinatorHome />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /couldn't load case counts/i,
    );

    AllCaseAPI.mockResolvedValue({
      success: true,
      data: [],
      totalCount: 3,
      totalActiveCount: 3,
    });
    await user.click(screen.getByRole("button", { name: /retry/i }));

    await waitFor(() => expect(cardValues(container)).toContain("3"));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
