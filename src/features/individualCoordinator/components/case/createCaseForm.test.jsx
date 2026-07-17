import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { act, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateCaseForm from "@/features/individualCoordinator/components/case/createCaseForm";
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

function renderCreateForm() {
  return renderRoutes(
    [
      { path: "/coordinator/case/create", element: <CreateCaseForm /> },
      { path: "/coordinator/case", element: <p>case dashboard</p> },
    ],
    { initialEntries: ["/coordinator/case/create"] },
  );
}

describe("CreateCaseForm", () => {
  it("adds a new case to caseData and navigates to the case list on submit", async () => {
    const user = userEvent.setup();
    const startingCount = caseData.data.length;
    const { router } = renderCreateForm();

    await user.type(
      screen.getByPlaceholderText("Enter file number"),
      "BANK-99999",
    );
    await user.type(
      screen.getByPlaceholderText("Enter banker name"),
      "Test Banker",
    );
    await user.type(
      screen.getByPlaceholderText("Enter customer name"),
      "Test Customer",
    );
    await user.type(
      screen.getByPlaceholderText("Enter customer phone number"),
      "9000000000",
    );

    await user.click(screen.getByRole("button", { name: "Select Bank" }));
    // HDFC's name and code are both literally "HDFC", so it renders twice (name + code)
    const hdfcOptions = await screen.findAllByText("HDFC");
    await user.click(hdfcOptions[0]);

    const form = document.getElementById("case-form");
    await act(async () => {
      form.requestSubmit();
    });

    await waitFor(() => {
      expect(caseData.data.length).toBe(startingCount + 1);
    });

    const newCase = caseData.data[caseData.data.length - 1];
    expect(newCase.file_number).toBe("BANK-99999");
    expect(newCase.customer_name).toBe("Test Customer");
    expect(newCase.customer_phone_number).toBe("9000000000");
    expect(newCase.bank.name).toBe("HDFC");
    expect(newCase.status).toBe("OPEN");
    expect(caseData.meta.total_cases).toBe(caseData.data.length);

    await waitFor(() =>
      expect(router.state.location.pathname).toBe("/coordinator/case"),
    );
  });
});
