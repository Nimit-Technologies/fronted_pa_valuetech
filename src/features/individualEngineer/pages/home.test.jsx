import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import IndividualEngineerHome from "@/features/individualEngineer/pages/home";

vi.mock("@/features/individualEngineer/services/myTasks", () => ({
  default: vi.fn(),
}));

// The greeting reads the session out of the store; it is not what these
// assertions are about, and the same stand-in is used on the coordinator's home.
vi.mock("@/components/shared/greetingHeader", () => ({
  default: () => <div>greeting</div>,
}));

const getMyTasks = (
  await import("@/features/individualEngineer/services/myTasks")
).default;

const cardValues = (container) =>
  Array.from(container.querySelectorAll('[data-slot="card-title"]')).map(
    (el) => el.textContent,
  );

describe("IndividualEngineerHome", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows total, active and completed task counts from the task list endpoint", async () => {
    getMyTasks.mockResolvedValue({
      success: true,
      data: [],
      totalCount: 42,
      totalActiveCount: 37,
    });

    const { container } = render(<IndividualEngineerHome />);

    await waitFor(() => expect(cardValues(container)).toContain("42"));
    // active, and completed as the exact difference between the two totals
    expect(cardValues(container)).toContain("37");
    expect(cardValues(container)).toContain("5");

    expect(getMyTasks).toHaveBeenCalledWith();
  });

  it("renders the three summary cards", async () => {
    getMyTasks.mockResolvedValue({
      success: true,
      data: [],
      totalCount: 0,
      totalActiveCount: 0,
    });

    const { container } = render(<IndividualEngineerHome />);
    await waitFor(() => expect(cardValues(container)).toContain("0"));

    const cardTitles = Array.from(
      container.querySelectorAll('[data-slot="card-description"]'),
    ).map((el) => el.textContent);

    expect(cardTitles).toContain("Total Tasks");
    expect(cardTitles).toContain("Active Tasks");
    expect(cardTitles).toContain("Completed Tasks");
  });

  it("shows placeholders rather than zeros before the counts arrive", () => {
    getMyTasks.mockReturnValue(new Promise(() => {}));

    const { container } = render(<IndividualEngineerHome />);

    expect(cardValues(container)).toEqual(["—", "—", "—"]);
  });

  it("reports a failed load and retries", async () => {
    const user = userEvent.setup();
    getMyTasks.mockRejectedValueOnce(new Error("Network Error"));

    const { container } = render(<IndividualEngineerHome />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /couldn't load task counts/i,
    );

    getMyTasks.mockResolvedValue({
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
