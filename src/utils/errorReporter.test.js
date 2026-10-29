import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const ENDPOINT = "https://telemetry.example.com/client-errors";

// installErrorReporter reads import.meta.env at module scope, so each case
// stubs the env and re-imports rather than sharing one instance.
const load = async (endpoint) => {
  vi.resetModules();

  if (endpoint) vi.stubEnv("VITE_ERROR_REPORT_URL", endpoint);
  else vi.stubEnv("VITE_ERROR_REPORT_URL", "");

  const { installErrorReporter } = await import("@/utils/errorReporter");
  const loggerModule = await import("@/utils/logger");

  return { installErrorReporter, logger: loggerModule.default, loggerModule };
};

const beaconPayloads = (beacon) => beacon.mock.calls.map(([, blob]) => blob);

describe("errorReporter", () => {
  let beacon;

  beforeEach(() => {
    beacon = vi.fn(() => true);
    vi.stubGlobal("navigator", {
      sendBeacon: beacon,
      userAgent: "test-agent",
    });
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("installs nothing when no endpoint is configured", async () => {
    const { installErrorReporter, logger } = await load("");

    expect(installErrorReporter()).toBe(false);

    logger.error("boom", new Error("x"));
    expect(beacon).not.toHaveBeenCalled();
  });

  it("reports an error once installed", async () => {
    const { installErrorReporter, logger } = await load(ENDPOINT);

    expect(installErrorReporter()).toBe(true);
    logger.error("Create user failed", new Error("boom"));

    expect(beacon).toHaveBeenCalledTimes(1);
    expect(beacon.mock.calls[0][0]).toBe(ENDPOINT);
  });

  it("never sends credentials or personal fields", async () => {
    const { installErrorReporter, logger } = await load(ENDPOINT);
    installErrorReporter();

    logger.error("Create user failed", {
      employee_id: "emp1",
      password: "hunter2",
      aadhaar_number: "213456789015",
      email: "arun@example.com",
    });

    // The Blob is opaque here, so assert on what was handed to it.
    const [, blob] = beacon.mock.calls[0];
    const body = await blob.text();

    expect(body).not.toContain("hunter2");
    expect(body).not.toContain("213456789015");
    expect(body).not.toContain("arun@example.com");
    // Non-sensitive context survives, or the report is useless.
    expect(body).toContain("emp1");
    expect(body).toContain("Create user failed");
  });

  it("falls back to fetch when sendBeacon refuses the payload", async () => {
    const fetchMock = vi.fn(() => Promise.resolve());
    vi.stubGlobal("fetch", fetchMock);
    beacon.mockReturnValue(false);

    const { installErrorReporter, logger } = await load(ENDPOINT);
    installErrorReporter();

    logger.error("boom", new Error("x"));

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(ENDPOINT);
    expect(init.method).toBe("POST");
    // The session cookie has no business reaching a logging endpoint.
    expect(init.credentials).toBe("omit");
    expect(init.keepalive).toBe(true);
  });

  it("caps reports so a render loop cannot flood the endpoint", async () => {
    const { installErrorReporter, logger } = await load(ENDPOINT);
    installErrorReporter();

    for (let i = 0; i < 50; i += 1) logger.error(`boom ${i}`);

    expect(beacon).toHaveBeenCalledTimes(20);
  });

  it("does not let a failing transport break the caller", async () => {
    beacon.mockImplementation(() => {
      throw new Error("beacon exploded");
    });
    vi.stubGlobal("fetch", undefined);

    const { installErrorReporter, logger } = await load(ENDPOINT);
    installErrorReporter();

    expect(() => logger.error("boom", new Error("x"))).not.toThrow();
  });

  it("reports warnings too", async () => {
    const { installErrorReporter, logger } = await load(ENDPOINT);
    installErrorReporter();

    logger.warn("something looks off", { detail: "x" });

    expect(beaconPayloads(beacon)).toHaveLength(1);
  });
});
