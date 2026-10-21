import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/store/slice/user/userSlice";
import ViewUser from "@/features/superAdmin/components/user/ViewUser";
import { renderRoutes } from "@/test/renderWithRouter";

vi.mock("@/features/superAdmin/services/user/getUserById", () => ({
  default: vi.fn(),
}));

vi.mock("@/features/superAdmin/services/user/getAadhaarByEmployeeId", () => ({
  default: vi.fn(),
}));

const getUserByIdAPI = (
  await import("@/features/superAdmin/services/user/getUserById")
).default;

const USER_ID = "user_0001";

const baseUser = {
  id: USER_ID,
  employee_id: "emp12345",
  first_name: "meera",
  last_name: "nair",
  email: "meera@example.com",
  phone: "9876543210",
  aadhaar_number: "XXXXXXXX9014",
  is_active: true,
  branch: { id: "b1", name: "noida" },
  department: { id: "d1", name: "cordination" },
  role: { id: "r1", name: "cordinator" },
  business_type_id: "bt1",
  business_type: { id: "bt1", name: "awaas" },
  address: { city: "noida", state: "uttar pradesh", pin_code: "201301" },
};

function renderViewUser() {
  const store = configureStore({
    reducer: { user: userReducer },
    preloadedState: { user: { userData: [] } },
  });

  return renderRoutes(
    [
      {
        path: "/super-admin/user/view/:id",
        element: (
          <Provider store={store}>
            <ViewUser />
          </Provider>
        ),
      },
    ],
    { initialEntries: [`/super-admin/user/view/${USER_ID}`] },
  );
}

describe("ViewUser business type", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows the business type name for a coordinator", async () => {
    getUserByIdAPI.mockResolvedValue({ data: baseUser });

    renderViewUser();

    expect(await screen.findByText("Business Type")).toBeInTheDocument();
    expect(screen.getByText("awaas")).toBeInTheDocument();
  });

  // The column is null for every other role, so the row would only ever read
  // "N/A" there.
  it("omits the row for a role that carries no business type", async () => {
    getUserByIdAPI.mockResolvedValue({
      data: {
        ...baseUser,
        role: { id: "r2", name: "engineer" },
        business_type_id: null,
        business_type: null,
      },
    });

    renderViewUser();

    await waitFor(() =>
      expect(screen.getByText("engineer")).toBeInTheDocument(),
    );
    expect(screen.queryByText("Business Type")).not.toBeInTheDocument();
  });

  // A coordinator without one cannot see any case at all — resolveCaseScope
  // fails closed — so the row stays, reading "N/A", rather than disappearing.
  it("keeps the row for a coordinator whose business type is unset", async () => {
    getUserByIdAPI.mockResolvedValue({
      data: { ...baseUser, business_type_id: null, business_type: null },
    });

    renderViewUser();

    expect(await screen.findByText("Business Type")).toBeInTheDocument();
    expect(screen.getAllByText("N/A").length).toBeGreaterThan(0);
  });
});
