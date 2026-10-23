import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";
import useGetAllStatus from "@/hooks/status/useGetAllStatus";

vi.mock("@/utils/axiosInstance", () => ({
  default: { get: vi.fn() },
}));

describe("useGetAllStatus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

    const { result } = renderHook(() => useGetAllStatus());

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

    const { result } = renderHook(() => useGetAllStatus());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe("Unable to fetch statuses.");
    expect(result.current.statuses).toEqual([]);
  });
});
