import { configureStore } from "@reduxjs/toolkit";
import { screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { describe, expect, it, vi } from "vitest";
import authReducer from "@/features/auth/slice/authSlice";
import engineerTaskReducer from "@/features/individualEngineer/slice/engineerTaskSlice";
import { renderWithRoute } from "@/test/renderWithRouter";
import getMySubmittedReport from "@/features/individualEngineer/services/getMySubmittedReport";
import SubmittedReport from "@/features/individualEngineer/pages/report/submittedReport";

vi.mock("@/features/individualEngineer/services/getMySubmittedReport", () => ({
  default: vi.fn(),
}));

describe("SubmittedReport", () => {
  it("renders the saved report in a read-only view", async () => {
    vi.mocked(getMySubmittedReport).mockResolvedValue({
      success: true,
      data: {
        report: {
          submittedAt: "2026-10-23T10:00:00.000Z",
          formData: {
            step1: {
              caseInfo: {
                file_number: "FILE-100",
                customer_name: "Ravi Sharma",
              },
              addressAsPerInitiation: { city: "Initiation city" },
            },
            step2: {
              locality: { residential: true },
              personInfo: { name: "Site contact" },
            },
            step5: { landmark: "City Mall" },
          },
        },
        task: {
          task_id: "allocation_1",
          case_id: "case_1",
          file_number: "FILE-100",
          customer_name: "Ravi Sharma",
          customer_contact_number: "9876543210",
          address: { city: "Noida" },
          status: { code: "visit_in_progress" },
        },
      },
    });

    const store = configureStore({
      reducer: {
        auth: authReducer,
        engineerTask: engineerTaskReducer,
      },
      preloadedState: {
        auth: {
          user: { first_name: "Engineer", last_name: "One" },
          isAuthenticated: true,
          loading: false,
          error: null,
        },
        engineerTask: {
          ...engineerTaskReducer(undefined, { type: "@@INIT" }),
          engineerTaskData: [],
        },
      },
    });

    renderWithRoute(
      <Provider store={store}>
        <SubmittedReport />
      </Provider>,
      {
        route: "/engineer/report/view/case_1",
        path: "/engineer/report/view/:id",
      },
    );

    expect(
      await screen.findByRole("heading", {
        name: "Submitted Site Visit Report",
      }),
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue("FILE-100")).toBeDisabled();
    expect(screen.getByDisplayValue("City Mall")).toBeDisabled();
    expect(
      screen.getByRole("heading", { name: "Address as per initiation" }),
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue("Initiation city")).toBeDisabled();
    expect(screen.getByText(/This report is read-only/i)).toBeInTheDocument();
    expect(getMySubmittedReport).toHaveBeenCalledWith("case_1");
  });
});
