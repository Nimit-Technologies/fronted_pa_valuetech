import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import CreateCase from "@/features/individualCoordinator/pages/CreateCasePage";
import { renderWithRoute } from "@/test/renderWithRouter";

// The form owns the write path and is covered by its own tests; this page is
// the header, the back button and the form.
vi.mock(
  "@/features/individualCoordinator/components/case/CreateCaseForm",
  () => ({ default: () => <div>create case form</div> }),
);

describe("CreateCase page", () => {
  it("renders the heading and the form", () => {
    renderWithRoute(<CreateCase />);

    expect(
      screen.getByRole("heading", { name: /create case/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("create case form")).toBeInTheDocument();
  });

  it("has no remark panel, since the case does not exist yet", () => {
    renderWithRoute(<CreateCase />);

    expect(screen.queryByText("Remark")).not.toBeInTheDocument();
    expect(
      screen.queryByPlaceholderText("Add your comment here"),
    ).not.toBeInTheDocument();
  });
});
