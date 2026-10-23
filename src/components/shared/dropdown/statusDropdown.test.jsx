import { configureStore } from "@reduxjs/toolkit";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { beforeEach, describe, expect, it, vi } from "vitest";
import authReducer from "@/features/auth/slice/authSlice";
import useGetAllStatus from "@/hooks/status/useGetAllStatus";
import { renderWithRoute } from "@/test/renderWithRouter";
import StatusDropdown from "@/components/shared/dropdown/statusDropdown";

vi.mock("@/hooks/status/useGetAllStatus", () => ({
  default: vi.fn(),
}));

const statuses = [
  { id: "s_open", code: "open", name: "open", is_active: true },
  {
    id: "s_assigned",
    code: "assigned_to_engineer",
    name: "assigned to engineer",
    is_active: true,
  },
  {
    id: "s_visit_schedule",
    code: "visit_schedule",
    name: "visit schedule",
    is_active: true,
  },
  {
    id: "s_visit_hold",
    code: "visit_hold",
    name: "visit hold",
    is_active: true,
  },
  {
    id: "s_visit_in_progress",
    code: "visit_in_progress",
    name: "visit in progress",
    is_active: true,
  },
  {
    id: "s_report_completed",
    code: "report_completed",
    name: "report completed",
    is_active: true,
  },
  {
    id: "s_inactive",
    code: "close",
    name: "close",
    is_active: false,
  },
];

const renderForRole = (role, props = {}) => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: {
      auth: {
        user: { role: { name: role } },
        isAuthenticated: true,
        loading: false,
        error: null,
      },
    },
  });

  return renderWithRoute(
    <Provider store={store}>
      <StatusDropdown {...props} />
    </Provider>,
  );
};

describe("StatusDropdown", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useGetAllStatus).mockReturnValue({
      statuses,
      loading: false,
      error: null,
    });
  });

  it("shows only active statuses allowed for the engineer role", async () => {
    const user = userEvent.setup();
    renderForRole("Engineer");
    await user.click(
      screen.getByRole("button", { name: "Change case status" }),
    );

    expect(
      screen.getByRole("menuitem", { name: "Visit Schedule" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: "Visit Hold" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: "Report Completed" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("menuitem", { name: "Open" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("menuitem", { name: "Close" }),
    ).not.toBeInTheDocument();
  });

  it("returns the selected status record to the caller", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    renderForRole("cordinator", { onSelect });
    await user.click(
      screen.getByRole("button", { name: "Change case status" }),
    );
    await user.click(
      screen.getByRole("menuitem", { name: "Assigned To Engineer" }),
    );

    expect(onSelect).toHaveBeenCalledWith(statuses[1]);
  });

  it("does not render for roles without case transition permissions", () => {
    const { container } = renderForRole("super admin");
    expect(container).toBeEmptyDOMElement();
  });
});
