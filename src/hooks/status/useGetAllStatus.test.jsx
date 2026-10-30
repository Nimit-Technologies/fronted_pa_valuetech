import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";
import cacheReducer from "@/store/slice/cache/cacheSlice";
import referenceReducer from "@/store/slice/reference/referenceSlice";
import { clearInFlightRequests } from "@/hooks/cache/inFlightRequests";
import useGetAllStatus from "@/hooks/status/useGetAllStatus";

vi.mock("@/utils/axiosInstance", () => ({
  default: { get: vi.fn() },
}));

// Reference data (see useReferenceList) lives in redux, not component state,
// so every consumer on screen shares one fetch instead of firing its own.
const makeStore = () =>
  configureStore({
    reducer: { cache: cacheReducer, reference: referenceReducer },
  });

const renderWithStore = () => {
  const store = makeStore();
  return renderHook(() => useGetAllStatus(), {
    wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
  });
};

describe("useGetAllStatus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearInFlightRequests();
  });

  it("loads statuses and counts from the authenticated status endpoint", async () => {
    const statuses = [
      { id: "status_1", code: "case_received", name: "Case Received" },
    ];
    vi.mocked(api.get).mockResolvedValue({
      data: {
        success: true,
        data: statuses,
        statusLength: 1,
        totalCount: 2,
        totalActiveCount: 1,
      },
    });

    const { result } = renderWithStore();

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(api.get).toHaveBeenCalledWith(apiConfig.status.getAllStatuses);
    expect(result.current).toMatchObject({
      statuses,
      statusLength: 1,
      totalCount: 2,
      totalActiveCount: 1,
      error: null,
    });
  });

  it("returns the error when the request fails", async () => {
    vi.mocked(api.get).mockRejectedValue({
      response: { data: { message: "Unable to fetch statuses." } },
    });

    const { result } = renderWithStore();

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe("Unable to fetch statuses.");
    expect(result.current.statuses).toEqual([]);
  });

  // The whole point of routing this through the reference cache: a table that
  // renders one status dropdown per row used to fire one GET per row. Mounting
  // the hook many times at once — the shape of that table — must still
  // produce exactly one request.
  it("shares one request across many components mounted at once", async () => {
    let resolveGet;
    vi.mocked(api.get).mockReturnValue(
      new Promise((resolve) => {
        resolveGet = resolve;
      }),
    );

    const store = makeStore();
    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    );

    const hooks = [
      renderHook(() => useGetAllStatus(), { wrapper }),
      renderHook(() => useGetAllStatus(), { wrapper }),
      renderHook(() => useGetAllStatus(), { wrapper }),
    ];

    // dedupeRequest defers the actual call by a microtask (see
    // inFlightRequests.js), so the three mounts above have all registered
    // against the same in-flight key before any of them calls the API.
    await waitFor(() => expect(api.get).toHaveBeenCalled());
    expect(api.get).toHaveBeenCalledTimes(1);

    resolveGet({
      data: { success: true, data: [], statusLength: 0, totalCount: 0 },
    });

    await waitFor(() =>
      hooks.forEach(({ result }) => expect(result.current.loading).toBe(false)),
    );

    expect(api.get).toHaveBeenCalledTimes(1);
  });

  // A second mount soon after — reopening the same dropdown, say — reads the
  // list already in the store instead of asking again.
  it("does not refetch while the cached list is still fresh", async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: { success: true, data: [], statusLength: 0, totalCount: 0 },
    });

    const store = makeStore();
    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    );

    const first = renderHook(() => useGetAllStatus(), { wrapper });
    await waitFor(() => expect(first.result.current.loading).toBe(false));

    renderHook(() => useGetAllStatus(), { wrapper });

    expect(api.get).toHaveBeenCalledTimes(1);
  });

  // getAllStatus() is the explicit "ask again" path (used by a retry button),
  // so it must bypass the freshness gate even when the cache is still good.
  it("forces a refetch when called explicitly", async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: { success: true, data: [], statusLength: 0, totalCount: 0 },
    });

    const { result } = renderWithStore();
    await waitFor(() => expect(result.current.loading).toBe(false));

    await result.current.getAllStatus();

    expect(api.get).toHaveBeenCalledTimes(2);
  });
});
