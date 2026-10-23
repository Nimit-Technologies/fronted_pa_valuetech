import { describe, it, expect, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import authReducer from "@/features/auth/slice/authSlice";
import engineerTaskReducer from "@/features/individualEngineer/slice/engineerTaskSlice";
import Report from "@/features/individualEngineer/pages/report/report";
import { renderWithRoute } from "@/test/renderWithRouter";
import saveReport from "@/features/individualEngineer/services/saveReport";
import getMyReport from "@/features/individualEngineer/services/getMyReport";

vi.mock("@/features/individualEngineer/services/saveReport", () => ({
  default: vi.fn(),
}));
vi.mock("@/features/individualEngineer/services/getMyReport", () => ({
  default: vi.fn(),
}));

const task = {
  task_id: "allocation_0001",
  case_id: "case_0001",
  file_number: "BANK-12345",
  customer_name: "Rahul Sharma",
  customer_contact_number: "9876543210",
  assigned_at: "2026-01-15 10:30:00",
  status: { code: "visit_in_progress" },
  address: {
    city: "Noida",
    district: "Gautam Budh Nagar",
    state: "Uttar Pradesh",
    pin_code: "201301",
    country: "India",
    lane: "MG Road",
    landmark: "Near City Mall",
  },
};

function renderForId(id, report = null) {
  vi.mocked(getMyReport).mockResolvedValue({ success: true, data: report });
  const store = configureStore({
    reducer: {
      engineerTask: engineerTaskReducer,
      auth: authReducer,
    },
    preloadedState: {
      engineerTask: {
        ...engineerTaskReducer(undefined, { type: "@@INIT" }),
        engineerTaskData: [task],
      },
      auth: {
        user: { first_name: "Ravi", last_name: "Kumar" },
        isAuthenticated: true,
        loading: false,
        error: null,
      },
    },
  });

  return renderWithRoute(
    <Provider store={store}>
      <Report />
    </Provider>,
    {
      route: `/engineer/report/create/${id}`,
      path: "/engineer/report/create/:id",
    },
  );
}

describe("Report (wizard page)", () => {
  it("shows one step at a time and advances through the wizard on Next", async () => {
    const user = userEvent.setup();
    renderForId("allocation_0001");

    await screen.findByText(/page 1 of 7/i);
    // Step1 is visible; Step2 stays mounted (to preserve its state) but hidden.
    expect(screen.getByText(/page 1 of 7/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue("BANK-12345")).not.toBeDisabled();
    expect(
      screen.getByText("Type of colony").closest(".hidden"),
    ).not.toBeNull();

    await user.click(screen.getByRole("button", { name: "Next" }));
    // Step2
    expect(screen.getByText("Type of colony").closest(".hidden")).toBeNull();

    await user.click(screen.getByRole("button", { name: "Next" }));
    // Step3
    expect(screen.getByText("Property Usage")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Next" }));
    // Step4
    expect(screen.getByText("Floor wise : Built up area")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Next" }));
    // Step5
    expect(screen.getByText("landmark")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Next" }));
    // Step6
    expect(
      screen.getByText("negative remarks which affect the value of property"),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Next" }));
    // Step7 - the final action saves a draft.
    expect(screen.getByText(/page 7 of 7/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Save Draft" }),
    ).toBeInTheDocument();
  });

  it("saves all report fields as a draft without sending photos", async () => {
    const user = userEvent.setup();
    vi.mocked(saveReport).mockResolvedValue({ success: true });
    renderForId("allocation_0001");
    await screen.findByText(/page 1 of 7/i);

    // Edit a Step1 field, then navigate all the way to the last step.
    const fileNumberInput = screen.getByDisplayValue("BANK-12345");
    await user.clear(fileNumberInput);
    await user.type(fileNumberInput, "BANK-99999");

    for (let i = 0; i < 6; i++) {
      await user.click(screen.getByRole("button", { name: "Next" }));
    }

    await user.click(screen.getByRole("button", { name: "Save Draft" }));

    await waitFor(() =>
      expect(saveReport).toHaveBeenCalledWith(
        "allocation_0001",
        expect.objectContaining({
          action: "draft",
          currentStep: 7,
          completedSteps: [1, 2, 3, 4, 5, 6],
          stepData: expect.objectContaining({
            step1: expect.objectContaining({
              caseInfo: expect.objectContaining({ file_number: "BANK-99999" }),
            }),
            step6: expect.any(Object),
          }),
        }),
      ),
    );
    expect(saveReport.mock.calls[0][1].stepData).not.toHaveProperty("step7");
  });

  it("submits the completed report", async () => {
    const user = userEvent.setup();
    vi.mocked(saveReport).mockResolvedValue({ success: true });
    renderForId("allocation_0001");
    await screen.findByText(/page 1 of 7/i);

    await user.click(screen.getByRole("button", { name: "Next" }));
    await user.type(
      screen.getByText("Pearson Name").parentElement.querySelector("input"),
      "Site contact",
    );
    await user.type(
      screen
        .getByText("Pearson contact number")
        .parentElement.querySelector("input"),
      "9876543210",
    );
    await user.type(
      screen
        .getByText("relation with client")
        .parentElement.querySelector("input"),
      "Owner",
    );

    for (let i = 0; i < 5; i++) {
      await user.click(screen.getByRole("button", { name: "Next" }));
    }

    await user.click(screen.getByRole("button", { name: "Submit Report" }));

    await waitFor(() =>
      expect(saveReport).toHaveBeenCalledWith(
        "allocation_0001",
        expect.objectContaining({
          action: "submit",
          currentStep: 7,
          completedSteps: [1, 2, 3, 4, 5, 6, 7],
        }),
      ),
    );
  });

  it("restores a saved draft and its checkbox and Other values", async () => {
    renderForId("allocation_0001", {
      isDraft: true,
      currentStep: 2,
      completedSteps: [1],
      formData: {
        step1: { caseInfo: { file_number: "DRAFT-123" } },
        step2: {
          locality: {
            residential: true,
            other: true,
            otherText: "Garden locality",
          },
        },
      },
    });

    expect(await screen.findByText(/page 2 of 7/i)).toBeInTheDocument();
    expect(
      screen
        .getAllByRole("checkbox", { name: "residential" })
        .some((checkbox) => checkbox.checked),
    ).toBe(true);
    expect(screen.getByRole("textbox", { name: "Other locality" })).toHaveValue(
      "Garden locality",
    );
  });
});
