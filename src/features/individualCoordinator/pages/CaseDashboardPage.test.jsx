import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import caseReducer from "@/store/slice/case/caseSlice";
import CaseDashboard from "@/features/individualCoordinator/pages/CaseDashboardPage";
import { renderWithRoute } from "@/test/renderWithRouter";

// The list service is the seam: everything below it (axios, the real store,
// cookies) belongs to the API integration, not to this page.
vi.mock("@/features/individualCoordinator/services/case/allCases", () => ({
  default: vi.fn(),
}));

const AllCaseAPI = (
  await import("@/features/individualCoordinator/services/case/allCases")
).default;

const buildCase = (id, overrides = {}) => ({
  id,
  file_number: `BANK-${id}`,
  customer_name: `Customer ${id}`,
  customer_contact_number: "9876543210",
  banker_name: "Praveen Kumar",
  case_type: "Awaas",
  bank: { id: "bank_001", display_name: "HDFC (Sector-18)", name: "HDFC" },
  branch: { id: "branch_001", name: "Noida" },
  status: { id: "s1", code: "open", name: "open", is_terminal: false },
  employee: null,
  address: {
    id: `addr_${id}`,
    lane: "MG Road",
    city: "Noida",
    state: "Uttar Pradesh",
    pin_code: "201301",
  },
  created_at: "2026-01-15 10:30:00",
  ...overrides,
});

const buildResponse = (cases, overrides = {}) => ({
  success: true,
  data: cases,
  caseFirstId: cases[0]?.id ?? null,
  caseLastId: cases[cases.length - 1]?.id ?? null,
  hasNextPage: false,
  hasPreviousPage: false,
  caseLength: cases.length,
  dataLimit: 10,
  totalCount: cases.length,
  totalActiveCount: cases.length,
  ...overrides,
});

// `existingStore` stands in for a return to this page: in the app the store
// outlives the route, so remounting on top of one that already holds rows is
// exactly what Back from a case detail does.
function renderDashboard(existingStore) {
  const store =
    existingStore ?? configureStore({ reducer: { case: caseReducer } });
  return {
    store,
    ...renderWithRoute(
      <Provider store={store}>
        <CaseDashboard />
      </Provider>,
    ),
  };
}

// The table dims its body while a fetch is replacing the rows on screen. There
// is no accessible handle on it, so the class it is done with is the signal.
const rowsAreDimmed = () =>
  document
    .querySelector('[data-slot="table-body"]')
    ?.className.includes("opacity-50") ?? false;

describe("CaseDashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
  });

  it("loads the first page on mount and renders one row per case", async () => {
    AllCaseAPI.mockResolvedValue(
      buildResponse([buildCase("0001"), buildCase("0002")]),
    );

    renderDashboard();

    expect(await screen.findByText("Customer 0001")).toBeInTheDocument();
    expect(screen.getByText("Customer 0002")).toBeInTheDocument();
    expect(AllCaseAPI).toHaveBeenCalledWith({
      direction: "next",
      cursorId: "",
    });
  });

  it("shows the totals the API reports, not the loaded row count", async () => {
    AllCaseAPI.mockResolvedValue(
      buildResponse([buildCase("0001")], {
        totalCount: 42,
        totalActiveCount: 37,
      }),
    );

    const { container } = renderDashboard();
    await screen.findByText("Customer 0001");

    const cardValues = Array.from(
      container.querySelectorAll('[data-slot="card-title"]'),
    ).map((el) => el.textContent);

    expect(cardValues).toContain("42");
    expect(cardValues).toContain("37");
  });

  it("asks for finished cases only once the toggle is on", async () => {
    const user = userEvent.setup();
    AllCaseAPI.mockResolvedValue(buildResponse([buildCase("0001")]));

    renderDashboard();
    await screen.findByText("Customer 0001");

    await user.click(screen.getByRole("button", { name: /show finished/i }));

    await waitFor(() =>
      expect(AllCaseAPI).toHaveBeenLastCalledWith({
        direction: "next",
        cursorId: "",
        include_finished: "true",
      }),
    );
  });

  it("shows the empty state when the scope holds no cases", async () => {
    AllCaseAPI.mockResolvedValue(buildResponse([]));

    renderDashboard();

    expect(await screen.findByText("No cases found.")).toBeInTheDocument();
  });

  it("reports a failed load instead of looking like an empty queue", async () => {
    const user = userEvent.setup();
    AllCaseAPI.mockRejectedValueOnce(new Error("Network Error"));

    renderDashboard();

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /couldn't load cases/i,
    );

    AllCaseAPI.mockResolvedValue(buildResponse([buildCase("0001")]));
    await user.click(screen.getByRole("button", { name: /retry/i }));

    expect(await screen.findByText("Customer 0001")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("keeps the rows it already has on screen when the page is returned to", async () => {
    AllCaseAPI.mockResolvedValue(buildResponse([buildCase("0001")]));

    const { store, unmount } = renderDashboard();
    await screen.findByText("Customer 0001");
    unmount();

    // Back onto the list, with the revalidation still in flight.
    let settle;
    AllCaseAPI.mockReturnValue(
      new Promise((resolve) => {
        settle = resolve;
      }),
    );

    renderDashboard(store);

    // The rows the user left are there immediately, undimmed, and nothing is
    // disabled underneath them — no sign that the page is reloading.
    expect(screen.getByText("Customer 0001")).toBeInTheDocument();
    expect(rowsAreDimmed()).toBe(false);
    expect(screen.queryByText(/loading cases/i)).not.toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search case/i)).not.toBeDisabled();
    expect(
      screen.getByRole("button", { name: /show finished/i }),
    ).not.toBeDisabled();

    // It did still refresh in the background.
    settle(buildResponse([buildCase("0001", { customer_name: "Renamed" })]));
    expect(await screen.findByText("Renamed")).toBeInTheDocument();
    expect(AllCaseAPI).toHaveBeenCalledTimes(2);
  });

  it("still dims the rows while paging to a different page", async () => {
    const user = userEvent.setup();
    AllCaseAPI.mockResolvedValue(
      buildResponse([buildCase("0001")], { hasNextPage: true }),
    );

    renderDashboard();
    await screen.findByText("Customer 0001");

    AllCaseAPI.mockReturnValue(new Promise(() => {}));
    await user.click(screen.getByRole("button", { name: /next/i }));

    // A fetch the user asked for, and one that replaces what is on screen, so
    // this one says it is working.
    await waitFor(() => expect(rowsAreDimmed()).toBe(true));
  });

  it("filters the loaded page by search term", async () => {
    const user = userEvent.setup();
    AllCaseAPI.mockResolvedValue(
      buildResponse([
        buildCase("0001", { customer_name: "Rahul Sharma" }),
        buildCase("0002", { customer_name: "Vikram Singh" }),
      ]),
    );

    renderDashboard();
    await screen.findByText("Rahul Sharma");

    await user.type(screen.getByPlaceholderText(/search case/i), "Vikram");

    await waitFor(() =>
      expect(screen.queryByText("Rahul Sharma")).not.toBeInTheDocument(),
    );
    expect(screen.getByText("Vikram Singh")).toBeInTheDocument();
  });

  it("narrows the loaded page to the banks left ticked", async () => {
    const user = userEvent.setup();
    AllCaseAPI.mockResolvedValue(
      buildResponse([
        buildCase("0001"),
        buildCase("0002", {
          bank: {
            id: "bank_002",
            display_name: "SBI (Sector-62)",
            name: "SBI",
          },
        }),
      ]),
    );

    renderDashboard();
    await screen.findByText("Customer 0001");

    await user.click(screen.getByLabelText("Filter bank"));
    await user.click(screen.getByRole("checkbox", { name: "SBI (Sector-62)" }));

    await waitFor(() =>
      expect(screen.queryByText("Customer 0002")).not.toBeInTheDocument(),
    );
    expect(screen.getByText("Customer 0001")).toBeInTheDocument();
    // The bar above the table says how much of the page survived.
    expect(
      screen.getByText(/showing 1 of 2 on this page/i),
    ).toBeInTheDocument();
  });

  it("keeps a case-type filter when the page is returned to", async () => {
    const user = userEvent.setup();
    AllCaseAPI.mockResolvedValue(
      buildResponse([
        buildCase("0001", { case_type: "Awaas" }),
        buildCase("0002", { case_type: "LAP" }),
      ]),
    );

    const { store, unmount } = renderDashboard();
    await screen.findByText("Customer 0001");

    await user.click(screen.getByLabelText("Filter case type"));
    await user.click(screen.getByRole("checkbox", { name: "LAP" }));

    await waitFor(() =>
      expect(screen.queryByText("Customer 0002")).not.toBeInTheDocument(),
    );

    // The filter lives in the store, so Back from a case detail lands on the
    // same view the user left rather than a reset table.
    unmount();
    renderDashboard(store);

    expect(await screen.findByText("Customer 0001")).toBeInTheDocument();
    expect(screen.queryByText("Customer 0002")).not.toBeInTheDocument();
  });

  it("says the filters emptied the page rather than that there are no cases", async () => {
    const user = userEvent.setup();
    AllCaseAPI.mockResolvedValue(
      buildResponse([buildCase("0001"), buildCase("0002")]),
    );

    renderDashboard();
    await screen.findByText("Customer 0001");

    // Untick the only bank on the page: every row drops out.
    await user.click(screen.getByLabelText("Filter bank"));
    await user.click(
      screen.getByRole("checkbox", { name: "HDFC (Sector-18)" }),
    );

    expect(
      await screen.findByText(
        "No cases on this page match the current filters.",
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText("No cases found.")).not.toBeInTheDocument();
  });
});
