import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import logger, { setErrorReporter } from "@/utils/logger";

// Builds the shape axios rejects with, which is what every call site hands to
// logger.error. `config.data` is the serialized request body — on the login
// call, the plaintext password.
const axiosError = ({ data, status = 401 }) => {
  const error = new Error("Request failed with status code 401");
  error.config = {
    method: "post",
    url: "https://api.example.com/api/v1/auth/login",
    data: JSON.stringify(data),
    headers: { Authorization: "Bearer super-secret" },
  };
  error.response = { status, data: { message: "Invalid credentials" } };
  return error;
};

describe("logger error reporting", () => {
  let reporter;

  beforeEach(() => {
    reporter = vi.fn();
    setErrorReporter(reporter);
    // error() always writes to console before reporting; keep test output clean.
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    setErrorReporter(null);
    vi.restoreAllMocks();
  });

  it("never forwards the request body of a failed call", () => {
    logger.error(
      "Unauthorized",
      axiosError({ data: { employee_id: "emp1", password: "hunter2" } }),
    );

    expect(reporter).toHaveBeenCalledTimes(1);
    const serialized = JSON.stringify(reporter.mock.calls[0][0]);
    expect(serialized).not.toContain("hunter2");
    expect(serialized).not.toContain("super-secret");
    expect(serialized).not.toContain("Invalid credentials");
  });

  it("keeps enough of an error to identify which call failed", () => {
    logger.error("Unauthorized", axiosError({ data: {} }));

    const { level, message, data } = reporter.mock.calls[0][0];
    expect(level).toBe("error");
    expect(message).toBe("Unauthorized");
    expect(data.name).toBe("Error");
    expect(data.status).toBe(401);
    expect(data.request).toEqual({
      method: "post",
      url: "https://api.example.com/api/v1/auth/login",
    });
  });

  it("redacts credentials and personal fields from a plain payload", () => {
    logger.error("Create user failed", {
      employee_id: "emp1",
      first_name: "arun",
      password: "hunter2",
      // Intentionally the old misspelling: nothing in the codebase emits this
      // any more, and the point is that the redactor still catches it if
      // anything ever does.
      adhar_number: "213456789015",
      aadhaar_number: "213456789015",
      email: "arun@example.com",
      phone: "8001236948",
      nested: { aadhaarNumber: "213456789015", branch: "noida" },
    });

    const { data } = reporter.mock.calls[0][0];
    expect(data.password).toBe("[redacted]");
    expect(data.adhar_number).toBe("[redacted]");
    expect(data.aadhaar_number).toBe("[redacted]");
    expect(data.email).toBe("[redacted]");
    expect(data.phone).toBe("[redacted]");
    expect(data.nested.aadhaarNumber).toBe("[redacted]");
    // Non-sensitive fields survive, or the report is useless for debugging.
    expect(data.employee_id).toBe("emp1");
    expect(data.first_name).toBe("arun");
    expect(data.nested.branch).toBe("noida");
  });

  it("reports warnings as well as errors", () => {
    logger.warn("Something looks wrong", { detail: "x" });

    expect(reporter).toHaveBeenCalledTimes(1);
    expect(reporter.mock.calls[0][0].level).toBe("warning");
  });

  it("survives a reporter that throws", () => {
    setErrorReporter(() => {
      throw new Error("tracker is down");
    });

    expect(() => logger.error("boom", new Error("original"))).not.toThrow();
  });

  it("does nothing when no reporter is registered", () => {
    setErrorReporter(null);

    expect(() => logger.error("boom", new Error("original"))).not.toThrow();
    expect(reporter).not.toHaveBeenCalled();
  });
});
