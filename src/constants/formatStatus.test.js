import { describe, it, expect } from "vitest";
import { formatStatus, STATUS_STYLES } from "@/constants/formatStatus";

describe("formatStatus", () => {
  it("returns '-' for falsy status", () => {
    expect(formatStatus(undefined)).toBe("-");
    expect(formatStatus(null)).toBe("-");
    expect(formatStatus("")).toBe("-");
  });

  it("converts SCREAMING_SNAKE_CASE into Title Case words", () => {
    expect(formatStatus("REPORT_SUBMITTED")).toBe("Report Submitted");
    expect(formatStatus("OPEN")).toBe("Open");
    expect(formatStatus("VISIT_SCHEDULED")).toBe("Visit Scheduled");
  });
});

describe("STATUS_STYLES", () => {
  it("has a style entry for every status used across the app", () => {
    const statuses = [
      "OPEN",
      "ENGINEER_ASSIGNED",
      "VISIT_SCHEDULED",
      "VISIT_IN_PROGRESS",
      "VISIT_COMPLETED",
      "REPORT_SUBMITTED",
      "PENDING",
      "REJECTED",
    ];
    statuses.forEach((status) => {
      expect(STATUS_STYLES[status]).toBeTruthy();
    });
  });
});
