import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import Step1 from "@/features/individualEngineer/pages/report/steps/step1";
import { renderWithRoute } from "@/test/renderWithRouter";
import engineerTaskReducer from "@/features/individualEngineer/slice/engineerTaskSlice";
import authReducer from "@/features/auth/slice/authSlice";

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

function renderForId(id) {
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
      <Step1 />
    </Provider>,
    {
      route: `/engineer/report/create/${id}`,
      path: "/engineer/report/create/:id",
    },
  );
}

describe("Step1 (report wizard)", () => {
  it("populates the headers and case section from the selected task", () => {
    renderForId("allocation_0001");

    expect(screen.getByText("case_0001")).toBeInTheDocument();
    expect(screen.getByText("Visit In Progress")).toBeInTheDocument();
    expect(screen.getByDisplayValue("BANK-12345")).not.toBeDisabled();
    expect(screen.getByDisplayValue("Rahul Sharma")).not.toBeDisabled();
    expect(screen.getByDisplayValue("9876543210")).not.toBeDisabled();
    expect(screen.getAllByDisplayValue("Noida")).toHaveLength(2);
  });

  it("shows 'Task not found.' for an unknown task id", () => {
    renderForId("does-not-exist");
    expect(screen.getByText("Task not found.")).toBeInTheDocument();
  });
});
