import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import caseReducer, { setCase } from "@/store/slice/case/caseSlice";
import UpdateCaseForm from "@/features/individualCoordinator/components/case/UpdateCaseForm";
import { renderWithRoute } from "@/test/renderWithRouter";

vi.mock("@/features/individualCoordinator/services/case/updateCase", () => ({
  default: vi.fn(),
}));
vi.mock("@/features/individualCoordinator/services/case/assignCase", () => ({
  default: vi.fn(),
}));
vi.mock("@/features/individualCoordinator/services/bank/allBanks", () => ({
  default: vi.fn(),
}));
vi.mock("@/features/user/hooks/useGetAllEngineer", () => ({
  default: () => ({
    getAllEngineer: vi.fn(),
    engineers: [
      {
        id: "engineer_002",
        employee_id: "emp002",
        first_name: "nita",
        last_name: "kapoor",
        phone: "9876543211",
      },
    ],
    engineerFirstId: "engineer_002",
    engineerLastId: "engineer_002",
    hasNextPage: false,
    hasPreviousPage: false,
    loading: false,
    error: null,
  }),
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom")),
  useNavigate: () => mockNavigate,
}));

const updateCaseAPI = (
  await import("@/features/individualCoordinator/services/case/updateCase")
).default;
const assignCaseAPI = (
  await import("@/features/individualCoordinator/services/case/assignCase")
).default;
const allBanksAPI = (
  await import("@/features/individualCoordinator/services/bank/allBanks")
).default;

const setup = () => userEvent.setup({ delay: null });

const BANK = {
  id: "bank_001",
  name: "hdfc",
  display_name: "hdfc sector 18",
  bank_branch: "sector 18 noida",
  bank_branch_code: "HDFC001",
};

const OTHER_BANK = {
  id: "bank_002",
  name: "icici",
  display_name: "icici sector 62",
  bank_branch: "sector 62 noida",
  bank_branch_code: "ICICI002",
};

// GET /case/:id as the backend shapes it: already trimmed and lower-cased,
// which is what the form's "only send what changed" diff compares against.
const CASE = {
  id: "cmv7vu8pq0004iwp0iqgjagrh",
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
};

// The hook writes the saved case back into the loaded list page, so the form
// needs the real slice behind it.
const renderForm = (caseItem = CASE, { rows = [CASE] } = {}) => {
  const store = configureStore({ reducer: { case: caseReducer } });
  store.dispatch(setCase({ data: rows }));

  return {
    store,
    ...renderWithRoute(
      <Provider store={store}>
        <UpdateCaseForm caseItem={caseItem} />
      </Provider>,
    ),
  };
};

describe("UpdateCaseForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    allBanksAPI.mockResolvedValue({
      success: true,
      data: [BANK, OTHER_BANK],
      bankFirstId: BANK.id,
      bankLastId: OTHER_BANK.id,
      hasNextPage: false,
      hasPreviousPage: false,
      dataLimit: 10,
    });
  });

  it("prefills every field from the case it was given", () => {
    renderForm();

    expect(screen.getByDisplayValue("ABC/2026/101")).toBeInTheDocument();
    expect(screen.getByDisplayValue("radha")).toBeInTheDocument();
    expect(screen.getByDisplayValue("7536987452")).toBeInTheDocument();
    expect(screen.getByDisplayValue("gautam buddha nagar")).toBeInTheDocument();
    // The bank comes through the picker, and its branch follows.
    expect(
      screen.getByRole("button", { name: /hdfc sector 18/i }),
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue("sector 18 noida")).toBeDisabled();
  });

  it("shows the current engineer in the assignment controls", () => {
    renderForm({
      ...CASE,
      employee: {
        id: "engineer_001",
        employee_id: "emp001",
        first_name: "meera",
        last_name: "sharma",
        phone: "9876543210",
      },
    });

    expect(
      screen.getByRole("button", { name: /meera sharma/i }),
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue("9876543210")).toBeDisabled();
    expect(
      screen.getByRole("button", { name: /reassign engineer/i }),
    ).toBeDisabled();
  });

  it("assigns the selected engineer using the employee id", async () => {
    const user = setup();
    const engineer = {
      id: "engineer_002",
      employee_id: "emp002",
      first_name: "nita",
      last_name: "kapoor",
      phone: "9876543211",
    };
    assignCaseAPI.mockResolvedValue({
      success: true,
      message: "Case assigned successfully",
      data: { ...CASE, employee: engineer },
    });

    const { store } = renderForm();

    await user.click(screen.getByRole("button", { name: /select engineer/i }));
    await user.click(await screen.findByText("nita kapoor"));
    expect(screen.getByDisplayValue("9876543211")).toBeDisabled();

    await user.click(
      screen.getByRole("button", { name: /^assign engineer$/i }),
    );

    await waitFor(() =>
      expect(assignCaseAPI).toHaveBeenCalledWith(CASE.id, "emp002"),
    );
    expect(
      screen.getByRole("button", { name: /nita kapoor/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /^reassign engineer$/i }),
    ).toBeDisabled();
    expect(store.getState().case.caseData[0].employee).toEqual(engineer);
    expect(updateCaseAPI).not.toHaveBeenCalled();
  });

  it("shows 'Case not found.' when there is no case to edit", () => {
    renderForm(null);
    expect(screen.getByText("Case not found.")).toBeInTheDocument();
  });

  it("sends only the fields that changed, then shows the saved case", async () => {
    const user = setup();
    updateCaseAPI.mockResolvedValue({
      success: true,
      message: "Case updated successfully",
      data: { ...CASE, customer_name: "radha sharma" },
    });

    renderForm();

    const customerName = screen.getByDisplayValue("radha");
    await user.clear(customerName);
    await user.type(customerName, "radha sharma");
    await user.click(screen.getByRole("button", { name: /^update case$/i }));

    await waitFor(() => expect(updateCaseAPI).toHaveBeenCalledTimes(1));
    // Everything the user did not touch stays out of the payload — including
    // business_type_id, which a coordinator sending it would be refused for.
    expect(updateCaseAPI).toHaveBeenCalledWith(CASE.id, {
      customer_name: "radha sharma",
    });

    expect(mockNavigate).toHaveBeenCalledWith(
      `/cordinator/case/view/${CASE.id}`,
    );
  });

  it("sends the new bank's id when the bank is changed, and nothing else", async () => {
    const user = setup();
    updateCaseAPI.mockResolvedValue({
      success: true,
      data: { ...CASE, bank: OTHER_BANK },
    });

    renderForm();

    await user.click(screen.getByRole("button", { name: /hdfc sector 18/i }));
    await user.click(await screen.findByText("icici sector 62"));
    // The read-only branch follows the picked bank before anything is saved.
    expect(screen.getByDisplayValue("sector 62 noida")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^update case$/i }));

    await waitFor(() =>
      expect(updateCaseAPI).toHaveBeenCalledWith(CASE.id, {
        bank_id: OTHER_BANK.id,
      }),
    );
  });

  it("does not call the API when nothing was edited", async () => {
    const user = setup();
    renderForm();

    await user.click(screen.getByRole("button", { name: /^update case$/i }));

    // An empty payload is a 400 from the schema's "provide at least one field"
    // rule, so it is answered without a round trip.
    await waitFor(() => expect(updateCaseAPI).not.toHaveBeenCalled());
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("clears an optional address field by sending it empty", async () => {
    const user = setup();
    updateCaseAPI.mockResolvedValue({ success: true, data: CASE });

    renderForm({
      ...CASE,
      address: { ...CASE.address, lane: "sector 12 main road" },
    });

    await user.clear(screen.getByDisplayValue("sector 12 main road"));
    await user.click(screen.getByRole("button", { name: /^update case$/i }));

    await waitFor(() =>
      expect(updateCaseAPI).toHaveBeenCalledWith(CASE.id, {
        address: { lane: "" },
      }),
    );
  });

  it("puts each server validation failure on its own field", async () => {
    const user = setup();
    updateCaseAPI.mockRejectedValue({
      response: {
        status: 400,
        data: {
          success: false,
          message: "Invalid request data.",
          errors: [
            {
              path: ["banker_name"],
              message: "Banker name must be less than 50 characters",
            },
            {
              path: ["address", "lane"],
              message: "Lane must be less than 200 characters",
            },
          ],
        },
      },
    });

    renderForm();

    // Input the client validator is happy with, so the request is actually
    // sent: the rules it mirrors are caught before the round trip now, and
    // what is left for the server is what only the server can judge.
    const banker = screen.getByDisplayValue("durga");
    await user.clear(banker);
    await user.type(banker, "durga prasad");
    await user.click(screen.getByRole("button", { name: /^update case$/i }));

    expect(
      await screen.findByText("Banker name must be less than 50 characters"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Lane must be less than 200 characters"),
    ).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("stays on the form when the backend reports no changes", async () => {
    const user = setup();
    updateCaseAPI.mockResolvedValue({
      success: true,
      message: "No changes are found",
    });

    renderForm();

    const customerName = screen.getByDisplayValue("radha");
    await user.clear(customerName);
    await user.type(customerName, "RADHA");
    await user.click(screen.getByRole("button", { name: /^update case$/i }));

    // Only the letter case changed, which the backend normalizes away: a
    // successful no-op, so there is nothing saved to navigate to.
    await waitFor(() => expect(updateCaseAPI).toHaveBeenCalledTimes(1));
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("writes the saved case back into the loaded list page", async () => {
    const user = setup();
    updateCaseAPI.mockResolvedValue({
      success: true,
      data: { ...CASE, customer_name: "radha sharma" },
    });

    const { store } = renderForm();

    const customerName = screen.getByDisplayValue("radha");
    await user.clear(customerName);
    await user.type(customerName, "radha sharma");
    await user.click(screen.getByRole("button", { name: /^update case$/i }));

    // No list refetch: the row the user came from carries the new value, so
    // going back does not show the pre-edit case.
    await waitFor(() =>
      expect(store.getState().case.caseData[0].customer_name).toBe(
        "radha sharma",
      ),
    );
  });

  it("checks required fields before it sends anything", async () => {
    const user = setup();
    renderForm();

    await user.clear(screen.getByDisplayValue("radha"));
    await user.clear(screen.getByDisplayValue("noida"));
    await user.click(screen.getByRole("button", { name: /^update case$/i }));

    expect(
      await screen.findByText("Customer name is required"),
    ).toBeInTheDocument();
    expect(screen.getByText("City is required")).toBeInTheDocument();
    expect(updateCaseAPI).not.toHaveBeenCalled();
  });

  it("rejects a half-typed phone number without a round trip", async () => {
    const user = setup();
    renderForm();

    const phone = screen.getByDisplayValue("7536987452");
    await user.clear(phone);
    await user.type(phone, "75369");
    await user.click(screen.getByRole("button", { name: /^update case$/i }));

    expect(
      await screen.findByText("Phone number must be 10 digits"),
    ).toBeInTheDocument();
    expect(updateCaseAPI).not.toHaveBeenCalled();
  });

  it("sends one request when the save button is double-clicked", async () => {
    const user = setup();
    updateCaseAPI.mockReturnValue(new Promise(() => {}));

    renderForm();

    const customerName = screen.getByDisplayValue("radha");
    await user.clear(customerName);
    await user.type(customerName, "radha sharma");

    const save = screen.getByRole("button", { name: /^update case$/i });
    await user.click(save);
    await user.click(save);

    expect(updateCaseAPI).toHaveBeenCalledTimes(1);
    expect(save).toBeDisabled();
  });

  it("refuses to edit a case that has reached a terminal status", () => {
    renderForm({
      ...CASE,
      status: { code: "close", name: "close", is_terminal: true },
    });

    expect(screen.getByRole("alert")).toHaveTextContent(
      /can no longer be edited/i,
    );
    expect(screen.getByDisplayValue("ABC/2026/101")).toBeDisabled();
    expect(
      screen.getByRole("button", { name: /^update case$/i }),
    ).toBeDisabled();
  });
});
