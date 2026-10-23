import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/slice/authSlice";
import cacheReducer from "@/store/slice/cache/cacheSlice";
import ViewCase from "@/features/individualEngineer/pages/viewCase";
import { renderWithRoute } from "@/test/renderWithRouter";

const { getCaseByIdMock, createRemarkMock } = vi.hoisted(() => ({
  getCaseByIdMock: vi.fn(),
  createRemarkMock: vi.fn(),
}));

vi.mock("@/features/individualCoordinator/services/case/getCaseById", () => ({
  default: getCaseByIdMock,
}));

vi.mock(
  "@/features/individualCoordinator/services/remark/createRemark",
  () => ({
    default: createRemarkMock,
  }),
);

// The page stamps a new remark with the signed-in engineer, so it mounts under
// a store holding one.
const SIGNED_IN_ENGINEER = {
  id: "u_eng_1",
  first_name: "ravi",
  role: { id: "r1", name: "individual-engineer" },
  department: { id: "d1", name: "valuation" },
  branch: { id: "b1", name: "noida" },
};

const caseRecord = {
  id: "cmv7vu8pq0004iwp0iqgjagrh",
  file_number: "BANK-12345",
  banker_name: "Banker",
  customer_name: "Rahul Sharma",
  customer_contact_number: "9876543210",
  case_type: "Awaas",
  created_by: { first_name: "John" },
  created_at: "2026-01-15 10:30:00",
  status: {
    code: "assigned_to_engineer",
    name: "assigned to engineer",
    is_terminal: false,
  },
  bank: { display_name: "HDFC (Noida Sector-18)" },
  address: {
    lane: "MG Road",
    city: "Noida",
    district: "Gautam Budh Nagar",
    state: "Uttar Pradesh",
    pin_code: "201301",
    country: "India",
  },
  employee: {
    first_name: "Ravi",
    last_name: "Kumar",
    phone: "9876500000",
  },
  remarks: [
    {
      id: "remark_1",
      content: "Initial case created.",
      first_name: "John",
      role_name: "Super Admin",
      department_name: "Management",
      branch_name: "Noida",
      created_at: "2026-07-03 10:30:00",
    },
  ],
  has_more_remarks: false,
};

beforeEach(() => {
  getCaseByIdMock.mockReset();
  createRemarkMock.mockReset();
  getCaseByIdMock.mockResolvedValue({ success: true, data: caseRecord });
});

function renderForId(id) {
  const store = configureStore({
    reducer: { auth: authReducer, cache: cacheReducer },
    preloadedState: {
      auth: {
        user: SIGNED_IN_ENGINEER,
        isAuthenticated: true,
        loading: false,
        error: null,
      },
    },
  });

  return renderWithRoute(
    <Provider store={store}>
      <ViewCase />
    </Provider>,
    {
      route: `/engineer/case/view/${id}`,
      path: "/engineer/case/view/:id",
    },
  );
}

describe("ViewCase page (Engineer)", () => {
  it("fetches and renders the assigned case details", async () => {
    renderForId(caseRecord.id);

    expect(getCaseByIdMock).toHaveBeenCalledWith(caseRecord.id);
    expect((await screen.findAllByText("John")).length).toBeGreaterThan(0);
    expect(screen.getByText("15 Jan 2026")).toBeInTheDocument();
    expect(screen.getByText("Assigned To Engineer")).toBeInTheDocument();
  });

  it("shows the case's existing remarks in the Comment section", async () => {
    renderForId(caseRecord.id);
    expect(
      await screen.findByText("Initial case created."),
    ).toBeInTheDocument();
  });

  it("links the 'Fill Sheet' action to the report creation route for the case", async () => {
    renderForId(caseRecord.id);
    await screen.findByDisplayValue("BANK-12345");
    const links = screen.getAllByRole("link");
    expect(
      links.some(
        (l) =>
          l.getAttribute("href") === `/engineer/report/create/${caseRecord.id}`,
      ),
    ).toBe(true);
  });

  it("posts and displays a new remark", async () => {
    const user = userEvent.setup();
    createRemarkMock.mockResolvedValue({
      data: {
        id: "remark_2",
        content: "Site visit completed.",
        first_name: "ravi",
        role_name: "individual-engineer",
        department_name: "valuation",
        branch_name: "noida",
        created_at: "2026-10-23T10:30:00.000Z",
      },
    });
    renderForId(caseRecord.id);

    await screen.findByDisplayValue("BANK-12345");
    await user.type(
      screen.getByPlaceholderText("Add your comment here"),
      "Site visit completed.",
    );
    await user.click(screen.getByRole("button", { name: "Add Comment" }));

    await waitFor(() => {
      expect(createRemarkMock).toHaveBeenCalledWith(
        caseRecord.id,
        "Site visit completed.",
      );
    });
    expect(
      await screen.findByText("Site visit completed."),
    ).toBeInTheDocument();
  });

  it("does not crash when a case is not found", async () => {
    getCaseByIdMock.mockResolvedValue({ success: false, data: null });
    renderForId("missing-case");

    expect(await screen.findByText("Case not found.")).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /fill sheet/i }),
    ).not.toBeInTheDocument();
  });
});
