import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { logout } from "@/features/auth/slice/authSlice";

// The real store pulls in redux-persist and localStorage; all this needs is to
// see what the interceptor dispatches.
vi.mock("@/store/store", () => ({
  default: { dispatch: vi.fn() },
}));

// Rejects the way axios does when the server answers with an error status.
const failing = (status) => (config) =>
  Promise.reject(
    Object.assign(new Error(`Request failed with status code ${status}`), {
      isAxiosError: true,
      config,
      response: { status, data: {}, config },
    }),
  );

// Rejects the way a timeout or dropped connection does: no response at all.
const offline = () => (config) =>
  Promise.reject(
    Object.assign(new Error("Network Error"), { isAxiosError: true, config }),
  );

const succeeding = (config) =>
  Promise.resolve({
    data: { ok: true },
    status: 200,
    statusText: "OK",
    headers: {},
    config,
  });

const ORIGIN = "http://localhost:5173";

// A full location stand-in, not just { pathname, href }: axios reads
// location.href through its same-origin helper and `new URL()` throws on a
// bare path, which fails the whole module at import time.
const stubLocation = (pathname) => {
  const href = `${ORIGIN}${pathname}`;

  Object.defineProperty(window, "location", {
    configurable: true,
    writable: true,
    value: {
      href,
      origin: ORIGIN,
      protocol: "http:",
      host: "localhost:5173",
      hostname: "localhost",
      port: "5173",
      pathname,
      search: "",
      hash: "",
    },
  });

  return href;
};

// A fresh module per test. The interceptor latches `isRedirectingToLogin` at
// module scope, which is right in a browser (the page is already unloading)
// but would otherwise leak between tests and silently pass the burst case.
const loadApi = async (pathname = "/super-admin") => {
  vi.resetModules();
  const initialHref = stubLocation(pathname);

  const { default: api } = await import("@/utils/axiosInstance");
  const { default: store } = await import("@/store/store");

  // resetModules gives a fresh axiosInstance but the mocked store survives it,
  // so its dispatch keeps the calls made by earlier tests. Clear it here and
  // every test's call count means only what that test did.
  store.dispatch.mockClear();

  return { api, store, initialHref };
};

describe("axios response interceptor", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("clears the session and redirects on 401", async () => {
    const { api, store } = await loadApi("/super-admin/user");

    await expect(
      api.get("/user/all-user", { adapter: failing(401) }),
    ).rejects.toThrow();

    expect(store.dispatch).toHaveBeenCalledWith(logout());
    expect(window.location.href).toBe("/");
  });

  it.each(["/", "/login"])(
    "does not redirect from the public route %s",
    async (pathname) => {
      const { api, store, initialHref } = await loadApi(pathname);

      await expect(
        api.post("/auth/login", {}, { adapter: failing(401) }),
      ).rejects.toThrow();

      // A failed login is the form's problem to report, not a reason to
      // navigate away from the screen the user is already looking at.
      expect(store.dispatch).not.toHaveBeenCalled();
      expect(window.location.href).toBe(initialHref);
    },
  );

  it("redirects once when a burst of requests all return 401", async () => {
    const { api, store } = await loadApi("/super-admin");

    const results = await Promise.allSettled([
      api.get("/a", { adapter: failing(401) }),
      api.get("/b", { adapter: failing(401) }),
      api.get("/c", { adapter: failing(401) }),
    ]);

    expect(results.every((r) => r.status === "rejected")).toBe(true);
    expect(store.dispatch).toHaveBeenCalledTimes(1);
  });

  it("leaves the session alone on 403", async () => {
    const { api, store, initialHref } = await loadApi("/super-admin");

    await expect(
      api.get("/branch/all-branch", { adapter: failing(403) }),
    ).rejects.toThrow();

    // Forbidden means signed in but not allowed — signing the user out would
    // be the wrong recovery.
    expect(store.dispatch).not.toHaveBeenCalled();
    expect(window.location.href).toBe(initialHref);
  });

  it("rejects a network failure without touching the session", async () => {
    const { api, store, initialHref } = await loadApi("/super-admin");

    await expect(
      api.get("/case/all-case", { adapter: offline() }),
    ).rejects.toThrow("Network Error");

    // A flaky connection must not sign anyone out.
    expect(store.dispatch).not.toHaveBeenCalled();
    expect(window.location.href).toBe(initialHref);
  });

  it("passes a successful response through untouched", async () => {
    const { api, store } = await loadApi("/super-admin");

    const response = await api.get("/status/all-status", {
      adapter: succeeding,
    });

    expect(response.data).toEqual({ ok: true });
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it("sends credentials, so the session cookie rides along", async () => {
    const { api } = await loadApi();

    expect(api.defaults.withCredentials).toBe(true);
  });
});

// Retries exist so a dropped connection or a server blip doesn't surface as a
// dead screen. What must not happen is a retried write.
describe("retry policy", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // An adapter that fails `failures` times and then succeeds, counting calls.
  const flaky = (failures, makeError) => {
    let calls = 0;
    const adapter = (config) => {
      calls += 1;
      if (calls <= failures) return makeError()(config);
      return Promise.resolve({
        data: { ok: true, calls },
        status: 200,
        statusText: "OK",
        headers: {},
        config,
      });
    };
    return {
      adapter,
      get calls() {
        return calls;
      },
    };
  };

  it("retries a GET that failed with a network error, then succeeds", async () => {
    const { api } = await loadApi();
    const probe = flaky(1, offline);

    const response = await api.get("/case/all-case", {
      adapter: probe.adapter,
    });

    expect(response.data.ok).toBe(true);
    expect(probe.calls).toBe(2);
  });

  it("retries a GET on a 5xx", async () => {
    const { api } = await loadApi();
    const probe = flaky(1, () => failing(503));

    const response = await api.get("/status/all-status", {
      adapter: probe.adapter,
    });

    expect(response.data.ok).toBe(true);
    expect(probe.calls).toBe(2);
  });

  it("gives up after two retries rather than hammering", async () => {
    const { api } = await loadApi();
    const probe = flaky(Infinity, offline);

    await expect(
      api.get("/case/all-case", { adapter: probe.adapter }),
    ).rejects.toThrow();

    // Original attempt plus two retries.
    expect(probe.calls).toBe(3);
  });

  it("never retries a POST", async () => {
    const { api } = await loadApi();
    const probe = flaky(Infinity, offline);

    await expect(
      api.post("/case/create-case", {}, { adapter: probe.adapter }),
    ).rejects.toThrow();

    // Retrying this would create a second case.
    expect(probe.calls).toBe(1);
  });

  it("never retries a PUT or PATCH", async () => {
    const { api } = await loadApi();
    const put = flaky(Infinity, offline);
    const patch = flaky(Infinity, () => failing(500));

    await expect(
      api.put("/user/update/1", {}, { adapter: put.adapter }),
    ).rejects.toThrow();
    await expect(
      api.patch("/user/status/1", {}, { adapter: patch.adapter }),
    ).rejects.toThrow();

    expect(put.calls).toBe(1);
    expect(patch.calls).toBe(1);
  });

  it("does not retry a 429 — that is what produced the rate limit", async () => {
    const { api } = await loadApi();
    const probe = flaky(Infinity, () => failing(429));

    await expect(
      api.get("/user/all-user", { adapter: probe.adapter }),
    ).rejects.toThrow();

    expect(probe.calls).toBe(1);
  });

  it("does not retry a 4xx, which will fail again identically", async () => {
    const { api } = await loadApi();
    const probe = flaky(Infinity, () => failing(404));

    await expect(
      api.get("/case/missing", { adapter: probe.adapter }),
    ).rejects.toThrow();

    expect(probe.calls).toBe(1);
  });

  it("still clears the session when a retried GET ends in 401", async () => {
    const { api, store } = await loadApi("/super-admin");
    const probe = flaky(Infinity, () => failing(401));

    await expect(
      api.get("/user/all-user", { adapter: probe.adapter }),
    ).rejects.toThrow();

    // 401 is not transient, so no retry — and the redirect still happens.
    expect(probe.calls).toBe(1);
    expect(store.dispatch).toHaveBeenCalledWith(logout());
  });
});
