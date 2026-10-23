import { beforeEach, describe, it, expect, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import CaseDashboard from "@/features/individualEngineer/pages/caseDashboard";
import { renderWithRoute } from "@/test/renderWithRouter";
import engineerTaskReducer from "@/features/individualEngineer/slice/engineerTaskSlice";

const { getMyTasksMock } = vi.hoisted(() => ({ getMyTasksMock: vi.fn() }));

vi.mock("@/features/individualEngineer/services/myTasks", () => ({
  default: getMyTasksMock,
}));

const sampleTask = {
  task_id: "allocation_001",
  case_id: "case_0001",
  assigned_at: "2026-01-15 10:30:00",
  file_number: "BANK-12345",
  case_type: "Awaas",
  customer_name: "Rahul Sharma",
  customer_contact_number: "9876543210",
  bank: { display_name: "HDFC (Noida Sector-18)" },
  assigned_by: {
    first_name: "John",
    last_name: "Smith",
    phone: "9876500000",
  },
  status: { code: "assigned_to_engineer" },
  address: {
    lane: "MG Road",
    city: "Noida",
    state: "Uttar Pradesh",
    pin_code: "201301",
  },
};

beforeEach(() => {
  getMyTasksMock.mockReset();
  getMyTasksMock.mockResolvedValue({
    data: [sampleTask],
    taskFirstId: "allocation_001",
    taskLastId: "allocation_001",
    hasPreviousPage: false,
    hasNextPage: false,
    totalCount: 1,
    totalActiveCount: 1,
  });
});

const renderDashboard = () => {
  const store = configureStore({
    reducer: { engineerTask: engineerTaskReducer },
  });
  const result = renderWithRoute(
    <Provider store={store}>
      <CaseDashboard />
    </Provider>,
  );

  return { ...result, store };
};

describe("CaseDashboard (Engineer)", () => {
  it("shows task counts returned by the API", async () => {
    const { container } = renderDashboard();

    const cardTitles = Array.from(
      container.querySelectorAll('[data-slot="card-description"]'),
    ).map((el) => el.textContent);

    expect(cardTitles).toContain("Total Tasks");
    expect(cardTitles).toContain("Active Tasks");
    await waitFor(() => {
      const cardValues = Array.from(
        container.querySelectorAll('[data-slot="card-title"]'),
      ).map((el) => el.textContent);
      expect(cardValues).toEqual(expect.arrayContaining(["1"]));
    });
  });

  it("renders the assignment and case details from the API", async () => {
    renderDashboard();

    expect(await screen.findByText("Rahul Sharma")).toBeInTheDocument();
    expect(screen.getByText("BANK-12345")).toBeInTheDocument();
    expect(screen.getByText("9876543210")).toBeInTheDocument();
    expect(screen.getByText("John Smith")).toBeInTheDocument();
    expect(screen.getByText("9876500000")).toBeInTheDocument();
    expect(screen.getByText("HDFC (Noida Sector-18)")).toBeInTheDocument();
  });

  it("sends the search term to the task list API", async () => {
    const user = userEvent.setup();
    renderDashboard();

    const searchInput = screen.getByPlaceholderText(/search/i);
    await user.type(searchInput, "Rahul");

    await waitFor(() => {
      expect(getMyTasksMock).toHaveBeenLastCalledWith(
        expect.objectContaining({ search: "Rahul" }),
      );
    });
  });

  it("shows an empty state when the API returns no tasks", async () => {
    getMyTasksMock.mockResolvedValue({ data: [], totalCount: 0 });
    renderDashboard();

    expect(await screen.findByText("No tasks found.")).toBeInTheDocument();
  });

  it("stores the task response and pagination metadata in Redux", async () => {
    const { store } = renderDashboard();

    await waitFor(() => {
      expect(store.getState().engineerTask).toMatchObject({
        engineerTaskData: [sampleTask],
        taskFirstId: "allocation_001",
        taskLastId: "allocation_001",
        totalCount: 1,
        totalActiveCount: 1,
        loading: false,
        success: true,
      });
    });
  });
});
