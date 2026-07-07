import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Comment from "@/components/shared/comment";

const sampleRemarks = [
  {
    user: { first_name: "John", role: { name: "Super Admin" } },
    comment: "Initial case created.",
    date: "2026-07-03",
    time: "10:30 AM",
  },
];

describe("Comment", () => {
  it("shows an empty state when there are no remarks", () => {
    render(<Comment />);
    expect(screen.getByText("No remarks yet.")).toBeInTheDocument();
  });

  it("renders remarks passed in via props", () => {
    render(<Comment remarks={sampleRemarks} />);
    expect(screen.getByText("Initial case created.")).toBeInTheDocument();
    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("Super Admin")).toBeInTheDocument();
  });

  it("adds a new remark and reports it via onAddComment", async () => {
    const user = userEvent.setup();
    const onAddComment = vi.fn();
    render(<Comment onAddComment={onAddComment} />);

    await user.type(
      screen.getByPlaceholderText("Add your comment here"),
      "Please call before visiting.",
    );
    await user.click(screen.getByRole("button", { name: "Add Comment" }));

    expect(
      screen.getByText("Please call before visiting."),
    ).toBeInTheDocument();
    expect(onAddComment).toHaveBeenCalledTimes(1);
    expect(onAddComment.mock.calls[0][0]).toMatchObject({
      comment: "Please call before visiting.",
    });
  });

  it("does not add a remark when the input is blank", async () => {
    const user = userEvent.setup();
    const onAddComment = vi.fn();
    render(<Comment onAddComment={onAddComment} />);

    await user.click(screen.getByRole("button", { name: "Add Comment" }));

    expect(onAddComment).not.toHaveBeenCalled();
    expect(screen.getByText("No remarks yet.")).toBeInTheDocument();
  });

  it("clears the input when Cancel is clicked", async () => {
    const user = userEvent.setup();
    render(<Comment />);

    const input = screen.getByPlaceholderText("Add your comment here");
    await user.type(input, "Draft comment");
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(input).toHaveValue("");
  });
});
