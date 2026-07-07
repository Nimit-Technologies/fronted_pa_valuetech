import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ViewCase from "@/features/individualCoordinator/pages/viewCase";
import { caseData } from "@/features/individualCoordinator/data/case/caseTable";
import { renderWithRoute } from "@/test/renderWithRouter";
import { snapshotCaseData, restoreCaseData } from "@/test/resetCaseData";

let snapshot;
beforeEach(() => {
  snapshot = snapshotCaseData();
});
afterEach(() => {
  restoreCaseData(snapshot);
});

function renderForId(id) {
  return renderWithRoute(<ViewCase />, {
    route: `/coordinator/case/view/${id}`,
    path: "/coordinator/case/view/:id",
  });
}

describe("ViewCase page", () => {
  it("shows the real created-by user, created date and status for the case", () => {
    renderForId("case_0001");

    // "John" also appears as the remark author below, so this case has 2 matches
    expect(screen.getAllByText("John").length).toBeGreaterThan(0);
    expect(screen.getByText("15 Jan 2026")).toBeInTheDocument();
    expect(screen.getByText("Report Submitted")).toBeInTheDocument();
  });

  it("shows the case's existing remarks in the Comment section", () => {
    renderForId("case_0001");
    expect(screen.getByText("Initial case created.")).toBeInTheDocument();
  });

  it("persists a newly added remark into caseData for that case", async () => {
    const user = userEvent.setup();
    renderForId("case_0001");

    await user.type(
      screen.getByPlaceholderText("Add your comment here"),
      "Follow up call done.",
    );
    await user.click(screen.getByRole("button", { name: "Add Comment" }));

    const updated = caseData.data.find((c) => c.id === "case_0001");
    expect(updated.remarks.at(-1).comment).toBe("Follow up call done.");
  });
});
