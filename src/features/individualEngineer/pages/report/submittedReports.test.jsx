import { fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderWithRoute } from "@/test/renderWithRouter";
import getMySubmittedReports from "@/features/individualEngineer/services/getMySubmittedReports";
import SubmittedReports from "@/features/individualEngineer/pages/report/submittedReports";

vi.mock("@/features/individualEngineer/services/getMySubmittedReports", () => ({
  default: vi.fn(),
}));

describe("SubmittedReports", () => {
  it("loads report pages and links rows to their read-only report", async () => {
    vi.mocked(getMySubmittedReports).mockImplementation(async (page) => ({
      success: true,
      data: {
        reports:
          page === 1
            ? [
                {
                  id: "report_1",
                  caseId: "case_1",
                  fileNumber: "FILE-100",
                  customerName: "Ravi Sharma",
                  caseType: "Residential",
                  submittedAt: "2026-10-23T10:00:00.000Z",
                },
              ]
            : [],
        page,
        pageSize: 10,
        totalCount: 11,
        totalPages: 2,
        hasPreviousPage: page > 1,
        hasNextPage: page < 2,
      },
    }));

    renderWithRoute(<SubmittedReports />, {
      route: "/engineer/reports",
      path: "/engineer/reports",
    });

    expect(await screen.findByText("FILE-100")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View report" })).toHaveAttribute(
      "href",
      "/engineer/report/view/case_1",
    );
    expect(screen.getByText("Page 1 of 2 (11 reports)")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    await waitFor(() => expect(getMySubmittedReports).toHaveBeenCalledWith(2));
    expect(
      await screen.findByText("No submitted reports found."),
    ).toBeInTheDocument();
  });
});
