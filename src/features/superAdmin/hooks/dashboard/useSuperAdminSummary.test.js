import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import useSuperAdminSummary from "@/features/superAdmin/hooks/dashboard/useSuperAdminSummary";

const { summaryAPI } = vi.hoisted(() => ({ summaryAPI: vi.fn() }));

vi.mock("@/features/superAdmin/services/dashboard/superAdminSummary", () => ({
  default: summaryAPI,
}));

const SUMMARY = {
  branches: { total: 3, active: 3 },
  departments: { total: 5, active: 4 },
  roles: { total: 6, active: 6 },
  users: { total: 40, active: 38 },
};

describe("useSuperAdminSummary", () => {
  beforeEach(() => {
    summaryAPI.mockReset();
  });

  // The mount effect used to carry its own copy of this fetch, so an API that
  // needed only one request on load fired its request from code that `refresh`
  // (the Retry button's handler) never touched — two paths to the same
  // endpoint, free to drift apart.
  it("fetches exactly once on mount", async () => {
    summaryAPI.mockResolvedValue({ success: true, data: SUMMARY });

    const { result } = renderHook(() => useSuperAdminSummary());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(summaryAPI).toHaveBeenCalledTimes(1);
    expect(result.current.summary).toEqual(SUMMARY);
    expect(result.current.error).toBeNull();
  });

  it("surfaces a failed load and lets refresh retry it", async () => {
    summaryAPI.mockRejectedValueOnce({
      response: { data: { message: "Failed to load dashboard summary" } },
    });

    const { result } = renderHook(() => useSuperAdminSummary());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe("Failed to load dashboard summary");

    summaryAPI.mockResolvedValueOnce({ success: true, data: SUMMARY });
    await result.current.refresh();

    await waitFor(() => expect(result.current.summary).toEqual(SUMMARY));
    expect(summaryAPI).toHaveBeenCalledTimes(2);
    expect(result.current.error).toBeNull();
  });
});
