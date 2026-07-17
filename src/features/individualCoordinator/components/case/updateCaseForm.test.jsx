import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { act, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UpdateCaseForm from "@/features/individualCoordinator/components/case/updateCaseForm";
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
      { path: "/coordinator/case/update/:id", element: <UpdateCaseForm /> },
      { path: "/coordinator/case/view/:id", element: <p>viewed case</p> },
    ],
    { initialEntries: [`/coordinator/case/update/${id}`] },
  );
}

describe("UpdateCaseForm", () => {
  it("shows 'Case not found.' for an unknown id", () => {
    renderForId("does-not-exist");
    expect(screen.getByText("Case not found.")).toBeInTheDocument();
  });

  it("prefills the form with the matched case's data", () => {
    renderForId("case_0001");
    expect(screen.getByDisplayValue("BANK-12345")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Rahul Sharma")).toBeInTheDocument();
    expect(screen.getByDisplayValue("9876543210")).toBeInTheDocument();
  });

  it("persists edits into caseData and navigates to the view route on submit", async () => {
    const user = userEvent.setup();
    const { router } = renderForId("case_0001");

    const customerNameInput = screen.getByDisplayValue("Rahul Sharma");
    await user.clear(customerNameInput);
    await user.type(customerNameInput, "Rahul Sharma Updated");

    // case_0001 already has a bank prefilled, so the trigger shows its display name
    await user.click(screen.getByRole("button", { name: "HDFC (Sector-18)" }));
    await user.click(await screen.findByText("ICICI"));

    // the page renders the submit button outside this component (form="case-form"),
    // so submit the form directly to exercise the same onSubmit handler.
    const form = document.getElementById("case-form");
    await act(async () => {
      form.requestSubmit();
    });

    await waitFor(() => {
      const updated = caseData.data.find((c) => c.id === "case_0001");
      expect(updated.customer_name).toBe("Rahul Sharma Updated");
      expect(updated.bank.name).toBe("ICICI");
      expect(updated.bank.display_name).toBe("ICICI");
    });

    await waitFor(() =>
      expect(router.state.location.pathname).toBe(
        "/coordinator/case/view/case_0001",
      ),
    );
  });
});
