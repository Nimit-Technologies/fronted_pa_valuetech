import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UpdateCase from "@/features/individualCoordinator/pages/updateCase";
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

function renderForId(id) {
  return renderRoutes(
    [
      { path: "/coordinator/case/update/:id", element: <UpdateCase /> },
      { path: "/coordinator/case/view/:id", element: <p>viewed case</p> },
    ],
    { initialEntries: [`/coordinator/case/update/${id}`] },
  );
}

describe("UpdateCase page", () => {
  it("shows the case's existing remarks in the Comment section", () => {
    renderForId("case_0001");
    expect(screen.getByText("Initial case created.")).toBeInTheDocument();
  });

  it("submits via the page's outer 'Update Case' button and navigates to the view route", async () => {
    const user = userEvent.setup();
    const { router } = renderForId("case_0001");

    const customerNameInput = screen.getByDisplayValue("Rahul Sharma");
    await user.clear(customerNameInput);
    await user.type(customerNameInput, "Renamed Customer");

    await user.click(screen.getByRole("button", { name: "Update Case" }));

    await waitFor(() => {
      const updated = caseData.data.find((c) => c.id === "case_0001");
      expect(updated.customer_name).toBe("Renamed Customer");
    });
    await waitFor(() =>
      expect(router.state.location.pathname).toBe(
        "/coordinator/case/view/case_0001",
      ),
    );
  });
});
