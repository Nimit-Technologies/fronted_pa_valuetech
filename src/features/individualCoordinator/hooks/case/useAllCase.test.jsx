import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, render } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import caseReducer from "@/store/slice/case/caseSlice";
import useAllCase from "@/features/individualCoordinator/hooks/case/useAllCase";

vi.mock("@/features/individualCoordinator/services/case/allCases", () => ({
  default: vi.fn(),
}));

const AllCaseAPI = (
  await import("@/features/individualCoordinator/services/case/allCases")
).default;

const response = (ids, overrides = {}) => ({
  success: true,
  data: ids.map((id) => ({ id })),
  caseFirstId: ids[0] ?? null,
  caseLastId: ids[ids.length - 1] ?? null,
  hasNextPage: false,
  hasPreviousPage: false,
  caseLength: ids.length,
  dataLimit: 10,
  totalCount: ids.length,
  totalActiveCount: ids.length,
  ...overrides,
});

// The hook is the module's async action: it owns the request, the request-id
// guard and what reaches the store. Mounted in a probe so those are exercised
// through React the way the pages use them.
const Probe = ({ onReady }) => {
  const hook = useAllCase();
  onReady(hook);
  return null;
};

const setup = () => {
  const store = configureStore({ reducer: { case: caseReducer } });
  let hook;
  render(
    <Provider store={store}>
      <Probe
        onReady={(value) => {
          hook = value;
        }}
      />
    </Provider>,
  );
  return { store, get: () => hook };
};

describe("useAllCase", () => {
  beforeEach(() => vi.clearAllMocks());

  it("puts the fetched page and its cursors into the store", async () => {
    AllCaseAPI.mockResolvedValue(
      response(["c1", "c2"], { hasNextPage: true, totalCount: 7 }),
    );
    const { store, get } = setup();

    await act(async () => {
      await get().allCase();
    });

    const state = store.getState().case;
    expect(state.caseData.map((row) => row.id)).toEqual(["c1", "c2"]);
    expect(state.caseLastId).toBe("c2");
    expect(state.hasNextPage).toBe(true);
    expect(state.totalCount).toBe(7);
    expect(state.loading).toBe(false);
  });

  it("asks for the first page with no cursor by default", async () => {
    AllCaseAPI.mockResolvedValue(response([]));
    const { get } = setup();

    await act(async () => {
      await get().allCase();
    });

    expect(AllCaseAPI).toHaveBeenCalledWith({
      direction: "next",
      cursorId: "",
    });
  });

  it("passes the cursor and direction through when paging", async () => {
    AllCaseAPI.mockResolvedValue(response(["c3"]));
    const { get } = setup();

    await act(async () => {
      await get().allCase({ direction: "previous", cursorId: "c1" });
    });

    expect(AllCaseAPI).toHaveBeenCalledWith({
      direction: "previous",
      cursorId: "c1",
    });
  });

  it("sends include_finished only when finished cases are wanted", async () => {
    AllCaseAPI.mockResolvedValue(response([]));
    const { get } = setup();

    await act(async () => {
      await get().allCase({ includeFinished: false });
    });
    expect(AllCaseAPI.mock.calls[0][0]).not.toHaveProperty("include_finished");

    await act(async () => {
      await get().allCase({ includeFinished: true });
    });
    expect(AllCaseAPI.mock.calls[1][0]).toMatchObject({
      include_finished: "true",
    });
  });

  it("trims the search term and leaves it out when empty", async () => {
    AllCaseAPI.mockResolvedValue(response([]));
    const { get } = setup();

    await act(async () => {
      await get().allCase({ search: "   " });
    });
    expect(AllCaseAPI.mock.calls[0][0]).not.toHaveProperty("search");

    await act(async () => {
      await get().allCase({ search: "  rahul  " });
    });
    expect(AllCaseAPI.mock.calls[1][0]).toMatchObject({ search: "rahul" });
  });

  it("records a readable message on failure and stops loading", async () => {
    AllCaseAPI.mockRejectedValue({
      response: { status: 500, data: { message: "Failed to fetch cases" } },
    });
    const { store, get } = setup();

    await act(async () => {
      await get().allCase();
    });

    const state = store.getState().case;
    expect(state.error).toBe("Failed to fetch cases");
    expect(state.loading).toBe(false);
    expect(state.success).toBe(false);
  });

  it("falls back to its own wording when the failure carries no message", async () => {
    AllCaseAPI.mockRejectedValue({});
    const { store, get } = setup();

    await act(async () => {
      await get().allCase();
    });

    expect(store.getState().case.error).toBe("Failed to load cases");
  });

  it("lets the newest request own the store when an older one answers late", async () => {
    let settleFirst;
    AllCaseAPI.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          settleFirst = resolve;
        }),
    ).mockResolvedValueOnce(response(["newest"]));

    const { store, get } = setup();

    let firstCall;
    act(() => {
      firstCall = get().allCase({ cursorId: "stale" });
    });
    await act(async () => {
      await get().allCase({ cursorId: "newest" });
    });

    expect(store.getState().case.caseData.map((r) => r.id)).toEqual(["newest"]);

    // The superseded request answers last and must not clobber the page.
    await act(async () => {
      settleFirst(response(["stale"]));
      await firstCall;
    });

    expect(store.getState().case.caseData.map((r) => r.id)).toEqual(["newest"]);
  });

  it("does not overwrite a newer page with an older request's failure", async () => {
    let rejectFirst;
    AllCaseAPI.mockImplementationOnce(
      () =>
        new Promise((_resolve, reject) => {
          rejectFirst = reject;
        }),
    ).mockResolvedValueOnce(response(["newest"]));

    const { store, get } = setup();

    let firstCall;
    act(() => {
      firstCall = get().allCase({ cursorId: "stale" });
    });
    await act(async () => {
      await get().allCase({ cursorId: "newest" });
    });

    await act(async () => {
      rejectFirst(new Error("Network Error"));
      await firstCall;
    });

    const state = store.getState().case;
    expect(state.error).toBeNull();
    expect(state.caseData.map((r) => r.id)).toEqual(["newest"]);
  });
});
