import { describe, it, expect, afterEach, vi } from "vitest";
import { extractErrorMessage } from "@/utils/extractErrorMessage";

const FALLBACK = "Unable to save the case.";

const axiosError = (overrides = {}) =>
  Object.assign(new Error(overrides.message ?? "Request failed"), {
    isAxiosError: true,
    ...overrides,
  });

const withResponse = (status, data) =>
  axiosError({
    message: `Request failed with status code ${status}`,
    response: { status, data },
  });

describe("extractErrorMessage", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("the API's own wording", () => {
    it("prefers the message the API wrote for the user", () => {
      expect(
        extractErrorMessage(
          withResponse(400, { message: "File number already exists" }),
          FALLBACK,
        ),
      ).toBe("File number already exists");
    });

    it("reads the first issue of a failed validation", () => {
      expect(
        extractErrorMessage(
          withResponse(400, {
            errors: [
              { field: "aadhaar", message: "Aadhaar must be 12 digits" },
            ],
          }),
          FALLBACK,
        ),
      ).toBe("Aadhaar must be 12 digits");
    });

    // The real shape a failed .safeParse() controller sends: both a generic
    // wrapper message ("Invalid report") and the specific per-field issues.
    // The wrapper is never worth showing over the actual problem.
    it("prefers a specific issue over a generic wrapper message", () => {
      expect(
        extractErrorMessage(
          withResponse(400, {
            message: "Invalid report",
            errors: [
              {
                path: ["stepData", "step1"],
                message: "file_number is required",
              },
            ],
          }),
          FALLBACK,
        ),
      ).toBe("file_number is required");
    });

    it("keeps the API's rate-limit sentence rather than its own", () => {
      expect(
        extractErrorMessage(
          withResponse(429, {
            message: "Too many login attempts for this account.",
          }),
          FALLBACK,
        ),
      ).toBe("Too many login attempts for this account.");
    });
  });

  describe("a response with nothing readable in it", () => {
    // The whole point of the status table: a bare 429 from a proxy must still
    // tell the user to wait, not to try again.
    it("tells the user to wait on 429", () => {
      expect(extractErrorMessage(withResponse(429, {}), FALLBACK)).toMatch(
        /wait a minute/i,
      );
    });

    it("says permission on 403, without implying a logout", () => {
      const message = extractErrorMessage(withResponse(403, {}), FALLBACK);

      expect(message).toMatch(/permission/i);
      expect(message).not.toMatch(/log ?in|sign ?in/i);
    });

    // The backend answers 404 for another branch's record, so the wording has
    // to cover "not yours" without confirming the record exists.
    it("says not found on 404", () => {
      expect(extractErrorMessage(withResponse(404, {}), FALLBACK)).toMatch(
        /couldn't find that record/i,
      );
    });

    it("says the server failed on 5xx", () => {
      expect(extractErrorMessage(withResponse(503, {}), FALLBACK)).toMatch(
        /server ran into a problem/i,
      );
    });

    it("leaves an unmapped 4xx to the caller's wording", () => {
      expect(extractErrorMessage(withResponse(418, {}), FALLBACK)).toBe(
        FALLBACK,
      );
    });

    it("never leaks axios's status text to the user", () => {
      expect(extractErrorMessage(withResponse(500, {}), FALLBACK)).not.toMatch(
        /status code/i,
      );
    });
  });

  describe("requests that never reached a server", () => {
    it("explains a timeout in plain words", () => {
      const error = axiosError({
        code: "ECONNABORTED",
        message: "timeout of 30000ms exceeded",
      });

      const message = extractErrorMessage(error, FALLBACK);

      expect(message).toMatch(/took too long/i);
      expect(message).not.toMatch(/30000ms/);
    });

    it("explains a dropped connection in plain words", () => {
      expect(
        extractErrorMessage(axiosError({ message: "Network Error" }), FALLBACK),
      ).toMatch(/can't reach the server/i);
    });

    it("says so outright when the browser knows it is offline", () => {
      vi.stubGlobal("navigator", { ...navigator, onLine: false });

      expect(
        extractErrorMessage(axiosError({ message: "Network Error" }), FALLBACK),
      ).toMatch(/offline/i);
    });

    // A screen that moved on cancelled its own request. There is nothing the
    // user did wrong and usually nothing to show, so the caller decides.
    it("leaves a cancelled request to the caller", () => {
      expect(
        extractErrorMessage(
          axiosError({ code: "ERR_CANCELED", message: "canceled" }),
          FALLBACK,
        ),
      ).toBe(FALLBACK);
    });

    it("keeps the message of an error thrown by app code", () => {
      expect(
        extractErrorMessage(new Error("Pick a bank first"), FALLBACK),
      ).toBe("Pick a bank first");
    });
  });

  it("falls back when handed nothing at all", () => {
    expect(extractErrorMessage(undefined, FALLBACK)).toBe(FALLBACK);
    expect(extractErrorMessage({}, FALLBACK)).toBe(FALLBACK);
  });
});
