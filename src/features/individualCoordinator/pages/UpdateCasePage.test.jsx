import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import caseReducer from "@/store/slice/case/caseSlice";
import UpdateCase from "@/features/individualCoordinator/pages/UpdateCasePage";
import { renderRoutes } from "@/test/renderWithRouter";

vi.mock("@/features/individualCoordinator/services/case/getCaseById", () => ({
  default: vi.fn(),
}));
vi.mock("@/features/individualCoordinator/services/case/updateCase", () => ({
  default: vi.fn(),
}));
vi.mock(
  "@/features/individualCoordinator/services/remark/createRemark",
  () => ({
    default: vi.fn(),
  }),
);
vi.mock("@/features/individualCoordinator/services/bank/allBanks", () => ({
  default: vi.fn(),
}));

const getCaseByIdAPI = (
  await import("@/features/individualCoordinator/services/case/getCaseById")
).default;
const updateCaseAPI = (
  await import("@/features/individualCoordinator/services/case/updateCase")
).default;
const createRemarkAPI = (
  await import("@/features/individualCoordinator/services/remark/createRemark")
).default;
const allBanksAPI = (
  await import("@/features/individualCoordinator/services/bank/allBanks")
).default;

const BANK = {
  id: "bank_001",
  name: "hdfc",
  display_name: "hdfc sector 18",
  bank_branch: "sector 18 noida",
};

const CASE_ID = "cmv7vu8pq0004iwp0iqgjagrh";

const CASE = {
  id: CASE_ID,
  file_number: "ABC/2026/101",
  banker_name: "durga",
  customer_name: "radha",
  customer_contact_number: "7536987452",
  case_type: "building",
  business_type: { id: "bt_001", name: "national" },
  bank: BANK,
  status: { code: "open", name: "open", is_terminal: false },
  employee: null,
  address: {
    city: "noida",
    district: "gautam buddha nagar",
    state: "uttar pradesh",
    pin_code: "201309",
    country: "india",
    lane: null,
    landmark: null,
  },
  remarks: [
    {
      id: "rem_1",
      content: "Initial case created.",
      first_name: "meera",
      role_name: "cordinator",
      department_name: "operations",
      branch_name: "noida",
      created_at: "2026-10-14 11:30:00",
    },
  ],
  has_more_remarks: false,
};

function renderForId(id = CASE_ID) {
  const store = configureStore({ reducer: { case: caseReducer } });
  const withStore = (element) => <Provider store={store}>{element}</Provider>;

  return {
    store,
    ...renderRoutes(
      [
        {
          path: "/cordinator/case/update/:id",
          element: withStore(<UpdateCase />),
        },
        { path: "/cordinator/case/view/:id", element: <p>viewed case</p> },
      ],
      { initialEntries: [`/cordinator/case/update/${id}`] },
    ),
  };
}

describe("UpdateCase page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getCaseByIdAPI.mockResolvedValue({ success: true, data: CASE });
    allBanksAPI.mockResolvedValue({
      success: true,
      data: [BANK],
      hasNextPage: false,
      hasPreviousPage: false,
      dataLimit: 10,
    });
  });

  it("fetches the case by the route's id and prefills the form", async () => {
    renderForId();

    expect(screen.getByText(/loading case/i)).toBeInTheDocument();

    expect(await screen.findByDisplayValue("ABC/2026/101")).toBeInTheDocument();
    expect(getCaseByIdAPI).toHaveBeenCalledWith(CASE_ID);
  });

  it("shows the case's existing remarks", async () => {
    renderForId();

    expect(
      await screen.findByText("Initial case created."),
    ).toBeInTheDocument();
  });

  it("shows 'Case not found.' when the case is outside the caller's scope", async () => {
    // A 404 resolves to undefined through useGetCaseById, which treats it as an
    // ordinary outcome rather than an error worth toasting.
    getCaseByIdAPI.mockResolvedValue(undefined);

    renderForId("does-not-exist");

    expect(await screen.findByText("Case not found.")).toBeInTheDocument();
    expect(screen.queryByDisplayValue("ABC/2026/101")).not.toBeInTheDocument();
  });

  it("saves an edit and lands on the case's view route", async () => {
    const user = userEvent.setup({ delay: null });
    updateCaseAPI.mockResolvedValue({
      success: true,
      message: "Case updated successfully",
      data: { ...CASE, customer_name: "renamed customer" },
    });

    const { router } = renderForId();

    const customerName = await screen.findByDisplayValue("radha");
    await user.clear(customerName);
    await user.type(customerName, "renamed customer");
    await user.click(screen.getByRole("button", { name: /^update case$/i }));

    await waitFor(() =>
      expect(updateCaseAPI).toHaveBeenCalledWith(CASE_ID, {
        customer_name: "renamed customer",
      }),
    );
    await waitFor(() =>
      expect(router.state.location.pathname).toBe(
        `/cordinator/case/view/${CASE_ID}`,
      ),
    );
  });

  it("appends a new remark to the thread without refetching the case", async () => {
    const user = userEvent.setup({ delay: null });
    createRemarkAPI.mockResolvedValue({
      success: true,
      data: {
        id: "rem_2",
        content: "Spoke to the banker.",
        first_name: "meera",
        role_name: "cordinator",
        department_name: "operations",
        branch_name: "noida",
        created_at: "2026-10-15 09:05:00",
      },
    });

    renderForId();
    await screen.findByText("Initial case created.");

    await user.type(
      screen.getByPlaceholderText("Add your comment here"),
      "Spoke to the banker.",
    );
    await user.click(screen.getByRole("button", { name: /add comment/i }));

    expect(await screen.findByText("Spoke to the banker.")).toBeInTheDocument();
    expect(getCaseByIdAPI).toHaveBeenCalledTimes(1);
  });
});
