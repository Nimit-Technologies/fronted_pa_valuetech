import { describe, it, expect } from "vitest";
import { formatDate } from "@/constants/formatDate";

describe("formatDate", () => {
  it("returns '-' for null/undefined/empty input", () => {
    expect(formatDate(null)).toBe("-");
    expect(formatDate(undefined)).toBe("-");
    expect(formatDate("")).toBe("-");
  });

  it("formats an ISO date string as day/short-month/year", () => {
    expect(formatDate("2026-01-15T10:30:00Z")).toBe("15 Jan 2026");
  });
});
