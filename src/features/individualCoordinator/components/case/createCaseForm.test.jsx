import { describe, it, expect, vi, beforeEach } from "vitest";
import { cleanup, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/slice/authSlice";
import CreateCaseForm from "@/features/individualCoordinator/components/case/CreateCaseForm";
import { renderWithRoute } from "@/test/renderWithRouter";

vi.mock("@/features/individualCoordinator/services/case/createCase", () => ({
  default: vi.fn(),
}));
vi.mock("@/features/individualCoordinator/services/case/similarCases", () => ({
  default: vi.fn(),
}));
vi.mock("@/features/individualCoordinator/services/bank/allBanks", () => ({
  default: vi.fn(),
}));
vi.mock(
  "@/features/individualCoordinator/services/businessType/allBusinessTypes",
  () => ({ default: vi.fn() }),
);

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom")),
  useNavigate: () => mockNavigate,
}));

const createCaseAPI = (
  await import("@/features/individualCoordinator/services/case/createCase")
).default;
const similarCasesAPI = (
  await import("@/features/individualCoordinator/services/case/similarCases")
).default;
const allBanksAPI = (
  await import("@/features/individualCoordinator/services/bank/allBanks")
).default;
const allBusinessTypesAPI = (
  await import("@/features/individualCoordinator/services/businessType/allBusinessTypes")
).default;

// This form has nine text fields to fill; the default per-keystroke delay
// makes a single test slow enough to time out when the suite runs in parallel.
const setup = () => userEvent.setup({ delay: null });

const BANK = {
  id: "bank_001",
  name: "hdfc",
  display_name: "hdfc sector 18",
  bank_branch: "sector 18 noida",
  bank_branch_code: "HDFC001",
};

const BUSINESS_TYPE_ID = "bt_001";

function renderForm() {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: {
      auth: {
        user: {
          id: "u1",
          first_name: "meera",
          role: { id: "r1", name: "cordinator" },
          branch: { id: "br1", name: "noida" },
          business_type_id: BUSINESS_TYPE_ID,
        },
        isAuthenticated: true,
        loading: false,
        error: null,
      },
    },
  });

  return renderWithRoute(
    <Provider store={store}>
      <CreateCaseForm />
    </Provider>,
  );
}

// Fills every field the create schema requires, leaving the bank to the caller.
async function fillRequiredFields(user) {
  const type = async (placeholder, value) =>
    user.type(screen.getByPlaceholderText(placeholder), value);

  await type("Enter file number", "abc/2026/200");
  await type("Enter banker name", "durga");
  await type("Enter customer name", "radha");
  await type("10-digit mobile number", "7536987452");
  await type("Enter case type", "building");
  await type("Enter city", "noida");
  await type("Enter district", "gautam buddha nagar");
  await type("Enter state", "uttar pradesh");
  await type("6-digit pin code", "201309");
}

async function pickBank(user) {
  await user.click(screen.getByRole("button", { name: /select bank/i }));
  await user.click(await screen.findByText("hdfc sector 18"));
}

describe("CreateCaseForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // The form drafts itself into sessionStorage, which outlives a single
    // render. Without this, one test's half-filled form is restored into the
    // next one and typing appends to it.
    window.sessionStorage.clear();
    allBanksAPI.mockResolvedValue({
      success: true,
      data: [BANK],
      bankFirstId: BANK.id,
      bankLastId: BANK.id,
      hasNextPage: false,
      hasPreviousPage: false,
      dataLimit: 10,
    });
    allBusinessTypesAPI.mockResolvedValue({
      success: true,
      data: [{ id: BUSINESS_TYPE_ID, name: "national" }],
    });
  });

  it("sends exactly the fields the strict schema declares", async () => {
    const user = setup();
    createCaseAPI.mockResolvedValue({ success: true, data: { id: "case_1" } });

    renderForm();
    await fillRequiredFields(user);
    await pickBank(user);
    await user.click(screen.getByRole("button", { name: /^create case$/i }));

    await waitFor(() => expect(createCaseAPI).toHaveBeenCalledTimes(1));
    expect(createCaseAPI).toHaveBeenCalledWith({
      file_number: "abc/2026/200",
      banker_name: "durga",
      customer_name: "radha",
      customer_contact_number: "7536987452",
      case_type: "building",
      business_type_id: BUSINESS_TYPE_ID,
      bank_id: BANK.id,
      address: {
        city: "noida",
        district: "gautam buddha nagar",
        state: "uttar pradesh",
        pin_code: "201309",
        country: "India",
      },
    });
    // No confirm_duplicate on the first attempt, and no branch_id: the backend
    // derives the branch from the bank.
    const payload = createCaseAPI.mock.calls[0][0];
    expect(payload).not.toHaveProperty("confirm_duplicate");
    expect(payload).not.toHaveProperty("branch_id");

    expect(mockNavigate).toHaveBeenCalledWith("/cordinator/case");
  });

  it("shows the bank's branch once a bank is picked", async () => {
    const user = setup();
    renderForm();

    await pickBank(user);

    expect(screen.getByDisplayValue("sector 18 noida")).toBeDisabled();
  });

  it("names the business type from the session and does not let it be changed", async () => {
    renderForm();

    const field = await screen.findByDisplayValue("national");
    expect(field).toBeDisabled();
  });

  it("offers the matches and resubmits with confirm_duplicate", async () => {
    const user = setup();
    createCaseAPI.mockRejectedValueOnce({
      response: {
        status: 409,
        data: {
          success: false,
          message: "Similar cases already exist.",
          similar_cases: [
            {
              id: "case_9",
              file_number: "ABC/2026/100",
              business_type_name: "national",
            },
          ],
          hasNextPage: false,
        },
      },
    });

    renderForm();
    await fillRequiredFields(user);
    await pickBank(user);
    await user.click(screen.getByRole("button", { name: /^create case$/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /similar cases already exist/i,
    );
    expect(screen.getByText(/ABC\/2026\/100/)).toBeInTheDocument();
    // Each match is a row with its own link to the case, so the user can read
    // the one already on file before deciding.
    expect(
      screen.getByRole("link", { name: /view case ABC\/2026\/100/i }),
    ).toHaveAttribute("href", "/cordinator/case/view/case_9");
    // One page of matches, so nothing to page through.
    expect(
      screen.queryByRole("button", { name: /load more/i }),
    ).not.toBeInTheDocument();
    // Still on the form — the first attempt did not create anything.
    expect(mockNavigate).not.toHaveBeenCalled();

    createCaseAPI.mockResolvedValue({ success: true, data: { id: "case_1" } });
    await user.click(screen.getByRole("button", { name: /create anyway/i }));

    await waitFor(() => expect(createCaseAPI).toHaveBeenCalledTimes(2));
    expect(createCaseAPI.mock.calls[1][0]).toMatchObject({
      confirm_duplicate: true,
      file_number: "abc/2026/200",
    });
    expect(mockNavigate).toHaveBeenCalledWith("/cordinator/case");
  });

  it("pages the rest of the matches without re-attempting the create", async () => {
    const user = setup();
    createCaseAPI.mockRejectedValueOnce({
      response: {
        status: 409,
        data: {
          success: false,
          message: "Similar cases already exist.",
          similar_cases: [
            {
              id: "cmv7vu8pq0004iwp0iqgjagrh",
              file_number: "ABC/2026/101",
              business_type_name: "retail",
            },
            {
              id: "cmv7vp5ps0001iwp0uuu7rxi7",
              file_number: "ABC/2026/100",
              business_type_name: "national",
            },
          ],
          caseLength: 2,
          dataLimit: 10,
          hasNextPage: true,
          nextOffset: 10,
        },
      },
    });
    similarCasesAPI.mockResolvedValue({
      success: true,
      similar_cases: [
        {
          id: "case_third",
          file_number: "ABC/2026/099",
          business_type_name: "national",
        },
      ],
      hasNextPage: false,
      nextOffset: null,
    });

    renderForm();
    await fillRequiredFields(user);
    await pickBank(user);
    await user.click(screen.getByRole("button", { name: /^create case$/i }));

    await user.click(await screen.findByRole("button", { name: /load more/i }));

    expect(await screen.findByText("ABC/2026/099")).toBeInTheDocument();
    // Appended, not replaced: the first page is still on screen.
    expect(screen.getByText("ABC/2026/101")).toBeInTheDocument();

    // The next page comes from the dedicated search endpoint, carrying the
    // address and number that produced the first page plus the offset it ended
    // at — the create is not attempted a second time.
    expect(similarCasesAPI).toHaveBeenCalledWith({
      customerContactNumber: "7536987452",
      address: {
        city: "noida",
        district: "gautam buddha nagar",
        state: "uttar pradesh",
        pin_code: "201309",
        country: "India",
      },
      offset: 10,
    });
    expect(createCaseAPI).toHaveBeenCalledTimes(1);

    // The last page, so the button retires.
    expect(
      screen.queryByRole("button", { name: /load more/i }),
    ).not.toBeInTheDocument();
  });

  // Following a match through to its case page unmounts this form, so the
  // input has to outlive the component for Back to be any use.
  it("restores the input and the matches after leaving the page and coming back", async () => {
    const user = setup();
    createCaseAPI.mockRejectedValueOnce({
      response: {
        status: 409,
        data: {
          success: false,
          message: "Similar cases already exist.",
          similar_cases: [
            {
              id: "cmv7vu8pq0004iwp0iqgjagrh",
              file_number: "ABC/2026/101",
              business_type_name: "retail",
            },
          ],
          hasNextPage: false,
          nextOffset: null,
        },
      },
    });

    const first = renderForm();
    await fillRequiredFields(user);
    await pickBank(user);
    await user.click(screen.getByRole("button", { name: /^create case$/i }));
    expect(await screen.findByText("ABC/2026/101")).toBeInTheDocument();

    // Leaving for the case page and pressing Back is a remount, not a reload.
    first.unmount();
    renderForm();

    expect(await screen.findByDisplayValue("abc/2026/200")).toBeInTheDocument();
    expect(screen.getByDisplayValue("radha")).toBeInTheDocument();
    expect(screen.getByDisplayValue("7536987452")).toBeInTheDocument();
    expect(screen.getByDisplayValue("gautam buddha nagar")).toBeInTheDocument();
    // The picked bank comes back too, so the create still has a bank_id.
    expect(screen.getByDisplayValue("sector 18 noida")).toBeInTheDocument();
    // And so does the reason they left in the first place.
    expect(screen.getByText("ABC/2026/101")).toBeInTheDocument();

    // Only a created case clears it: resubmitting goes through, and a form
    // mounted after that is empty.
    createCaseAPI.mockResolvedValue({ success: true, data: { id: "case_1" } });
    await user.click(screen.getByRole("button", { name: /create anyway/i }));
    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith("/cordinator/case"),
    );

    cleanup();
    renderForm();
    expect(screen.getByPlaceholderText("Enter file number")).toHaveDisplayValue(
      "",
    );
    expect(screen.queryByText("ABC/2026/101")).not.toBeInTheDocument();
  });

  it("puts each validation failure on its own field", async () => {
    const user = setup();
    createCaseAPI.mockRejectedValue({
      response: {
        status: 400,
        data: {
          success: false,
          errors: [
            {
              path: ["customer_contact_number"],
              message: "Phone number must be 10 digits",
            },
            {
              path: ["address", "pin_code"],
              message: "Pin code must be exactly 6 digits",
            },
          ],
        },
      },
    });

    renderForm();
    await fillRequiredFields(user);
    await pickBank(user);
    await user.click(screen.getByRole("button", { name: /^create case$/i }));

    expect(
      await screen.findByText("Phone number must be 10 digits"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Pin code must be exactly 6 digits"),
    ).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("blocks the create when the account has no business type", async () => {
    const store = configureStore({
      reducer: { auth: authReducer },
      preloadedState: {
        auth: {
          user: { id: "u1", first_name: "meera", business_type_id: null },
          isAuthenticated: true,
          loading: false,
          error: null,
        },
      },
    });

    renderWithRoute(
      <Provider store={store}>
        <CreateCaseForm />
      </Provider>,
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      /no business type set/i,
    );
    expect(
      screen.getByRole("button", { name: /^create case$/i }),
    ).toBeDisabled();
  });
});
