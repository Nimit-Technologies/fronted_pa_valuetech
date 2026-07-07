import { describe, it, expect } from "vitest";
import { formatAddress } from "@/constants/formatAddress";

describe("formatAddress", () => {
  it("returns '-' when address is missing", () => {
    expect(formatAddress(null)).toBe("-");
    expect(formatAddress(undefined)).toBe("-");
  });

  it("returns '-' when all address parts are missing", () => {
    expect(formatAddress({})).toBe("-");
  });

  it("joins lane, city, state and pin_code with commas", () => {
    expect(
      formatAddress({
        lane: "MG Road",
        landmark: "Near City Mall",
        city: "Noida",
        state: "Uttar Pradesh",
        pin_code: "201301",
      }),
    ).toBe("MG Road, Noida, Uttar Pradesh, 201301");
  });

  it("skips falsy parts instead of leaving empty commas", () => {
    expect(
      formatAddress({
        lane: "MG Road",
        city: "Noida",
        state: "",
        pin_code: "",
      }),
    ).toBe("MG Road, Noida");
  });
});
