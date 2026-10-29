import { describe, it, expect } from "vitest";
import {
  formatDate,
  formatTime,
  formatDateTime,
  IST_TIME_ZONE,
} from "@/constants/formatDate";

// Everything here is Asia/Kolkata, and two separate things had to be fixed to
// make that true:
//
//  1. The backend sends "YYYY-MM-DD HH:mm:ss" with no timezone marker, always
//     meaning IST. `new Date` reads a bare timestamp as the viewer's local
//     time, so the parser appends +05:30.
//  2. toLocale* renders in the viewer's timezone unless told otherwise, so
//     every formatter pins the zone.
//
// These assertions are absolute instants, so they hold whatever timezone the
// machine running the tests is set to — which is the property that was missing
// before and the reason production was 5h30m out.

describe("IST date formatting", () => {
  it("pins the timezone to Asia/Kolkata", () => {
    expect(IST_TIME_ZONE).toBe("Asia/Kolkata");
  });

  describe("UTC timestamps from Prisma", () => {
    it("renders a UTC instant in IST", () => {
      // 05:00 UTC is 10:30 IST.
      expect(formatTime("2026-01-15T05:00:00.000Z")).toBe("10:30 AM");
      expect(formatDate("2026-01-15T05:00:00.000Z")).toBe("15 Jan 2026");
    });

    it("moves the date forward when IST crosses midnight", () => {
      // 19:00 UTC on the 14th is 00:30 IST on the 15th. Rendered in the
      // viewer's zone this showed the 14th for anyone west of India, dating
      // the event a day early.
      expect(formatDate("2026-01-14T19:00:00.000Z")).toBe("15 Jan 2026");
      expect(formatTime("2026-01-14T19:00:00.000Z")).toBe("12:30 AM");
    });

    it("renders IST midnight as 12:00 AM", () => {
      expect(formatTime("2026-01-14T18:30:00.000Z")).toBe("12:00 AM");
    });

    it("renders IST noon as 12:00 PM", () => {
      expect(formatTime("2026-01-15T06:30:00.000Z")).toBe("12:00 PM");
    });
  });

  describe("bare timestamps from the backend's formatDateTime", () => {
    it("reads them as IST rather than as the viewer's local time", () => {
      // The backend already converted to IST, so this must render unchanged.
      expect(formatTime("2026-01-15 10:30:00")).toBe("10:30 AM");
      expect(formatDate("2026-01-15 10:30:00")).toBe("15 Jan 2026");
    });

    it("does not shift a bare midnight into the previous day", () => {
      expect(formatDate("2026-01-15 00:30:00")).toBe("15 Jan 2026");
      expect(formatTime("2026-01-15 00:30:00")).toBe("12:30 AM");
    });

    it("accepts the ISO-ish variant with a T separator", () => {
      expect(formatDate("2026-01-15T10:30:00")).toBe("15 Jan 2026");
    });
  });

  describe("combined", () => {
    it("renders date and time together", () => {
      expect(formatDateTime("2026-01-15T05:00:00.000Z")).toBe(
        "15 Jan 2026, 10:30 AM",
      );
    });

    it("accepts a Date object", () => {
      expect(formatDateTime(new Date("2026-01-15T05:00:00.000Z"))).toBe(
        "15 Jan 2026, 10:30 AM",
      );
    });
  });

  describe("placeholders", () => {
    it.each([null, undefined, "", "not a date"])(
      "renders %s as a dash",
      (value) => {
        expect(formatDate(value)).toBe("-");
        expect(formatTime(value)).toBe("-");
        expect(formatDateTime(value)).toBe("-");
      },
    );
  });
});
