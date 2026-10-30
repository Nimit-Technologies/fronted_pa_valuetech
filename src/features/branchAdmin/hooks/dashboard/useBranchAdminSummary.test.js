import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import useBranchAdminSummary from "@/features/branchAdmin/hooks/dashboard/useBranchAdminSummary";

const { summaryAPI } = vi.hoisted(() => ({ summaryAPI: vi.fn() }));

vi.mock("@/features/branchAdmin/services/dashboard/branchAdminSummary", () => ({
  default: summaryAPI,
}));

const SUMMARY = {
  banks: { total: 8, active: 7 },
  departments: { total: 4, active: 4 },
  roles: { total: 5, active: 5 },
  users: { total: 20, active: 18 },
};

describe("useBranchAdminSummary", () => {
  beforeEach(() => {
    summaryAPI.mockReset();
  });

  // The mount effect used to carry its own copy of this fetch, so an API that
  // needed only one request on load fired its request from code that `refresh`
  // (the Retry button's handler) never touched — two paths to the same
  // endpoint, free to drift apart.
  it("fetches exactly once on mount", async () => {
    summaryAPI.mockResolvedValue({ success: true, data: SUMMARY });

    const { result } = renderHook(() => useBranchAdminSummary());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(summaryAPI).toHaveBeenCalledTimes(1);
    expect(result.current.summary).toEqual(SUMMARY);
    expect(result.current.error).toBeNull();
  });

  it("surfaces a failed load and lets refresh retry it", async () => {
    summaryAPI.mockRejectedValueOnce({
      response: { data: { message: "Failed to load dashboard summary" } },
    });

    const { result } = renderHook(() => useBranchAdminSummary());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe("Failed to load dashboard summary");

    summaryAPI.mockResolvedValueOnce({ success: true, data: SUMMARY });
    await result.current.refresh();

    await waitFor(() => expect(result.current.summary).toEqual(SUMMARY));
    expect(summaryAPI).toHaveBeenCalledTimes(2);
    expect(result.current.error).toBeNull();
  });
});
