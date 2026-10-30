import { describe, it, expect, vi, beforeEach } from "vitest";

// The store is built at import time, so the spy has to be in place before the
// module is loaded — hence the mock plus a fresh import per test.
const configureStore = vi.hoisted(() => vi.fn());

vi.mock("@reduxjs/toolkit", async (importOriginal) => {
  const actual = await importOriginal();
  configureStore.mockImplementation(actual.configureStore);
  return { ...actual, configureStore };
});

const loadStore = async () => {
  vi.resetModules();
  configureStore.mockClear();
  await import("@/store/store");
  return configureStore.mock.calls.at(-1)[0];
};

describe("store", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  // Redux Toolkit 2 defaults devTools to true, so leaving it unset ships a
  // production bundle that connects to the DevTools extension and exposes
  // every case row — customer names, phone numbers, addresses — to anyone who
  // has it installed, with an export button attached.
  it("keeps the DevTools bridge out of anything but the dev server", async () => {
    expect((await loadStore()).devTools).toBe(false);
  });

  it("enables it while developing", async () => {
    vi.stubEnv("MODE", "development");

    expect((await loadStore()).devTools).toBe(true);
  });

  // redux-persist dispatches non-serializable actions; without these the
  // console fills with warnings on every rehydrate.
  it("exempts the persist actions from the serializable check", async () => {
    const { middleware } = await loadStore();

    const getDefaultMiddleware = vi.fn(() => []);
    middleware(getDefaultMiddleware);

    const { serializableCheck } = getDefaultMiddleware.mock.calls[0][0];
    expect(serializableCheck.ignoredActions).toEqual(
      expect.arrayContaining(["persist/REHYDRATE", "persist/PERSIST"]),
    );
  });
});
