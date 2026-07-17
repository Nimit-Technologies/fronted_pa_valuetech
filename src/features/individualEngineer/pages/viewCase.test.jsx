import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ViewCase from "@/features/individualEngineer/pages/viewCase";
import { caseData } from "@/features/individualEngineer/data/case/caseTable";
import { renderWithRoute } from "@/test/renderWithRouter";
import {
  snapshotEngineerCaseData,
  restoreEngineerCaseData,
} from "@/test/resetEngineerCaseData";

let snapshot;
beforeEach(() => {
  snapshot = snapshotEngineerCaseData();
});
afterEach(() => {
  restoreEngineerCaseData(snapshot);
});

function renderForId(id) {
  return renderWithRoute(<ViewCase />, {
    route: `/engineer/case/view/${id}`,
    path: "/engineer/case/view/:id",
  });
}

describe("ViewCase page (Engineer)", () => {
  it("shows the coordinator, assigned date and status for the case", () => {
    renderForId("case_0001");

    expect(screen.getAllByText("John").length).toBeGreaterThan(0);
    expect(screen.getByText("15 Jan 2026")).toBeInTheDocument();
    expect(screen.getByText("Assigned To Engineer")).toBeInTheDocument();
  });

  it("shows the case's existing remarks in the Comment section", () => {
    renderForId("case_0001");
    expect(screen.getByText("Initial case created.")).toBeInTheDocument();
  });

  it("links the 'Fill Sheet' action to the report creation route for the case", () => {
    renderForId("case_0001");
    const links = screen.getAllByRole("link");
    expect(
      links.some(
        (l) => l.getAttribute("href") === "/engineer/report/create/case_0001",
      ),
    ).toBe(true);
  });

  it("persists a newly added remark into caseData for that case", async () => {
    const user = userEvent.setup();
    renderForId("case_0001");

    await user.type(
      screen.getByPlaceholderText("Add your comment here"),
      "Site visit completed.",
    );
    await user.click(screen.getByRole("button", { name: "Add Comment" }));

    const updated = caseData.data.find((c) => c.id === "case_0001");
    expect(updated.remarks.at(-1).comment).toBe("Site visit completed.");
  });
});
