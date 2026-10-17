import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import caseReducer from "@/store/slice/case/caseSlice";
import ViewCase from "@/features/individualCoordinator/pages/ViewCasePage";
import { renderRoutes } from "@/test/renderWithRouter";

vi.mock("@/features/individualCoordinator/services/case/getCaseById", () => ({
  default: vi.fn(),
}));

vi.mock(
  "@/features/individualCoordinator/services/remark/createRemark",
  () => ({
    default: vi.fn(),
  }),
);

const getCaseByIdAPI = (
  await import("@/features/individualCoordinator/services/case/getCaseById")
).default;

const createRemarkAPI = (
  await import("@/features/individualCoordinator/services/remark/createRemark")
).default;

const caseRecord = {
  id: "case_0001",
  file_number: "BANK-12345",
  customer_name: "Rahul Sharma",
  customer_contact_number: "9876543210",
  banker_name: "Praveen Kumar",
  case_type: "Awaas",
  business_type: { id: "bt_001", name: "Retail" },
  bank: { id: "bank_001", display_name: "HDFC (Sector-18)", name: "HDFC" },
  branch: { id: "branch_001", name: "Noida" },
  status: {
    id: "s1",
    code: "visit_schedule",
    name: "visit schedule",
    is_terminal: false,
  },
  employee: null,
  address: { city: "Noida", state: "Uttar Pradesh", pin_code: "201301" },
  created_by: { id: "u1", first_name: "Meera", employee_id: "EMP001" },
  updated_by: null,
  created_at: "2026-01-15 10:30:00",
  // Newest first, as the API orders the preview.
  remarks: [
    {
      id: "r2",
      content: "Site visit scheduled.",
      first_name: "Meera",
      role_name: "Coordinator",
      department_name: "Coordination",
      branch_name: "Noida",
      created_at: "2026-01-16 09:05:00",
    },
    {
      id: "r1",
      content: "Initial case created.",
      first_name: "Meera",
      role_name: "Coordinator",
      department_name: "Coordination",
      branch_name: "Noida",
      created_at: "2026-01-15 10:31:00",
    },
  ],
  has_more_remarks: false,
};

function renderViewCase({ cachedRows = [] } = {}) {
  const store = configureStore({
    reducer: { case: caseReducer },
    preloadedState: { case: { caseData: cachedRows } },
  });

  return renderRoutes(
    [
      {
        path: "/cordinator/case/view/:id",
        element: (
          <Provider store={store}>
            <ViewCase />
          </Provider>
        ),
      },
    ],
    { initialEntries: ["/cordinator/case/view/case_0001"] },
  );
}

describe("ViewCase page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches the case by the route id and shows its header and fields", async () => {
    getCaseByIdAPI.mockResolvedValue({ success: true, data: caseRecord });

    renderViewCase();

    expect(await screen.findByDisplayValue("BANK-12345")).toBeInTheDocument();
    expect(getCaseByIdAPI).toHaveBeenCalledWith("case_0001");

    // created_by snapshot, created_at and the status relation drive the header
    // ("Meera" also authored the remarks below, hence the plural query)
    expect(screen.getAllByText("Meera").length).toBeGreaterThan(0);
    // likewise the date: the first remark was left the same day
    expect(screen.getAllByText("15 Jan 2026").length).toBeGreaterThan(0);
    expect(screen.getByText("Visit Schedule")).toBeInTheDocument();
  });

  it("credits each remark with the author's role, department and branch", async () => {
    getCaseByIdAPI.mockResolvedValue({ success: true, data: caseRecord });

    renderViewCase();
    await screen.findByText("Initial case created.");

    // One per remark — the snapshot columns on the row, not the live relations
    expect(screen.getAllByText("Coordinator")).toHaveLength(2);
    expect(screen.getAllByText("Coordination")).toHaveLength(2);
    expect(screen.getAllByText("Noida")).toHaveLength(2);
  });

  it("shows the case's remarks oldest-first", async () => {
    getCaseByIdAPI.mockResolvedValue({ success: true, data: caseRecord });

    renderViewCase();

    const first = await screen.findByText("Initial case created.");
    const second = screen.getByText("Site visit scheduled.");
    expect(first.compareDocumentPosition(second)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  it("renders the cached list row while the detail is still loading", async () => {
    getCaseByIdAPI.mockReturnValue(new Promise(() => {}));

    renderViewCase({ cachedRows: [caseRecord] });

    expect(await screen.findByDisplayValue("BANK-12345")).toBeInTheDocument();
    expect(screen.getByText(/loading remarks/i)).toBeInTheDocument();
  });

  it("posts a new remark and shows it at the end of the thread", async () => {
    const user = userEvent.setup();
    getCaseByIdAPI.mockResolvedValue({ success: true, data: caseRecord });
    createRemarkAPI.mockResolvedValue({
      success: true,
      data: {
        id: "r3",
        content: "Called the banker.",
        first_name: "Meera",
        role_name: "Coordinator",
        department_name: "Coordination",
        branch_name: "Noida",
        created_at: "2026-01-17 11:00:00",
      },
    });

    renderViewCase();
    await screen.findByText("Initial case created.");

    const box = screen.getByPlaceholderText("Add your comment here");
    await user.type(box, "Called the banker.");
    await user.click(screen.getByRole("button", { name: /add comment/i }));

    await waitFor(() =>
      expect(createRemarkAPI).toHaveBeenCalledWith(
        "case_0001",
        "Called the banker.",
      ),
    );

    // The saved remark joins the thread, newest last, without a refetch.
    const added = await screen.findByText("Called the banker.");
    const previous = screen.getByText("Site visit scheduled.");
    expect(previous.compareDocumentPosition(added)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(getCaseByIdAPI).toHaveBeenCalledTimes(1);
    expect(box).toHaveValue("");
  });

  it("keeps the typed remark when the write is refused", async () => {
    const user = userEvent.setup();
    getCaseByIdAPI.mockResolvedValue({ success: true, data: caseRecord });
    createRemarkAPI.mockRejectedValue({
      response: { status: 409, data: { message: "Case is close" } },
    });

    renderViewCase();
    await screen.findByText("Initial case created.");

    const box = screen.getByPlaceholderText("Add your comment here");
    await user.type(box, "Will not save.");
    await user.click(screen.getByRole("button", { name: /add comment/i }));

    await waitFor(() => expect(createRemarkAPI).toHaveBeenCalled());
    expect(box).toHaveValue("Will not save.");
    expect(screen.queryByText("Will not save.")).not.toBeInTheDocument();
  });

  it("does not offer the box on a case frozen by a terminal status", async () => {
    getCaseByIdAPI.mockResolvedValue({
      success: true,
      data: {
        ...caseRecord,
        status: { id: "s9", code: "close", name: "close", is_terminal: true },
      },
    });

    renderViewCase();
    await screen.findByText("Initial case created.");

    expect(screen.getByPlaceholderText("Add your comment here")).toBeDisabled();
    expect(screen.getByRole("button", { name: /add comment/i })).toBeDisabled();
    expect(
      screen.getByText(/can no longer be commented on/i),
    ).toBeInTheDocument();
  });

  it("reports a case it cannot read as not found", async () => {
    getCaseByIdAPI.mockRejectedValue({
      response: { status: 404, data: { message: "Case not found" } },
    });

    renderViewCase();

    expect(await screen.findByText("Case not found.")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /back to cases/i }),
    ).toBeInTheDocument();
  });
});
