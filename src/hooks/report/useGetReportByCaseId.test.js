import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import getMySubmittedReport from "@/features/individualEngineer/services/getMySubmittedReport";
import useGetReportByCaseId from "@/hooks/report/useGetReportByCaseId";

vi.mock("@/features/individualEngineer/services/getMySubmittedReport", () => ({
  default: vi.fn(),
}));

describe("useGetReportByCaseId", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads report and task data by case ID", async () => {
    const data = {
      report: { id: "report_1", formData: { step1: {} } },
      task: { case_id: "case_1" },
    };
    vi.mocked(getMySubmittedReport).mockResolvedValue({ data });

    const { result } = renderHook(() => useGetReportByCaseId("case_1"));

    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(getMySubmittedReport).toHaveBeenCalledWith("case_1");
    expect(result.current).toMatchObject({
      report: data.report,
      task: data.task,
      error: null,
    });
  });

  it("surfaces an API error", async () => {
    vi.mocked(getMySubmittedReport).mockRejectedValue({
      response: { data: { message: "Report not found" } },
    });

    const { result } = renderHook(() => useGetReportByCaseId("case_missing"));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe("Report not found");
    expect(result.current.report).toBeNull();
  });

  it("does not request when no case ID is provided", async () => {
    const { result } = renderHook(() => useGetReportByCaseId(undefined));

    await act(async () => {});
    expect(getMySubmittedReport).not.toHaveBeenCalled();
    expect(result.current.error).toBe(
      "A case ID is required to load this report.",
    );
  });
});
