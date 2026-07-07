import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateCase from "@/features/individualCoordinator/pages/createCase";
import { caseData } from "@/features/individualCoordinator/data/case/caseTable";
import { renderRoutes } from "@/test/renderWithRouter";
import { snapshotCaseData, restoreCaseData } from "@/test/resetCaseData";

let snapshot;
beforeEach(() => {
  snapshot = snapshotCaseData();
});
afterEach(() => {
  restoreCaseData(snapshot);
});

function renderCreatePage() {
  return renderRoutes(
    [
      { path: "/coordinator/case/create", element: <CreateCase /> },
      { path: "/coordinator/case", element: <p>case dashboard</p> },
    ],
    { initialEntries: ["/coordinator/case/create"] },
  );
}

describe("CreateCase page", () => {
  it("renders the create form with no pre-existing remarks", () => {
    renderCreatePage();
    expect(
      screen.getByPlaceholderText("Enter file number"),
    ).toBeInTheDocument();
    expect(screen.getByText("No remarks yet.")).toBeInTheDocument();
  });

  it("submits via the page's outer 'Create Case' button and adds the case", async () => {
    const user = userEvent.setup();
    const startingCount = caseData.data.length;
    const { router } = renderCreatePage();

    await user.type(
      screen.getByPlaceholderText("Enter file number"),
      "BANK-77777",
    );
    await user.type(
      screen.getByPlaceholderText("Enter customer name"),
      "New Customer",
    );

    await user.click(screen.getByRole("button", { name: "Create Case" }));

    await waitFor(() => expect(caseData.data.length).toBe(startingCount + 1));
    await waitFor(() =>
      expect(router.state.location.pathname).toBe("/coordinator/case"),
    );
  });
});
