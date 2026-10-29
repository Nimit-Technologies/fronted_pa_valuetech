import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/slice/authSlice";
import useVerifySession from "@/features/auth/hooks/useVerifySession";
import { session as sessionRequest } from "@/features/auth/services";

vi.mock("@/features/auth/services", () => ({
  session: vi.fn(),
  login: vi.fn(),
  logout: vi.fn(),
}));

// The persisted auth slice is only a first-paint hint: it carries the role name
// and nothing else, which is exactly the state this hook boots from.
const persistedHint = (roleName = "super admin") => ({
  user: { role: { name: roleName } },
  isAuthenticated: true,
  loading: false,
  error: null,
});

const renderVerify = (preloadedAuth) => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: { auth: preloadedAuth },
  });

  const result = renderHook(() => useVerifySession(), {
    wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
  });

  return { ...result, store };
};

const apiError = (status) =>
  Object.assign(new Error(`Request failed with status code ${status}`), {
    isAxiosError: true,
    response: { status, data: {} },
  });

describe("useVerifySession", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not call the API when there is no session to verify", async () => {
    const { result } = renderVerify({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    });

    expect(sessionRequest).not.toHaveBeenCalled();
    // Nothing to wait for, so protected routes must not be held behind a
    // loading state that never resolves.
    expect(result.current.checking).toBe(false);
  });

  it("replaces the persisted hint with the authoritative user", async () => {
    const user = {
      employee_id: "emp1",
      first_name: "arun",
      aadhaar_number: "XXXXXXXX9015",
      role: { name: "super admin" },
    };
    sessionRequest.mockResolvedValue({ data: user });

    const { result, store } = renderVerify(persistedHint());

    await waitFor(() => expect(result.current.checking).toBe(false));

    expect(sessionRequest).toHaveBeenCalledTimes(1);
    expect(store.getState().auth.user).toEqual(user);
    expect(store.getState().auth.isAuthenticated).toBe(true);
  });

  it.each([401, 403])("clears the session on %i", async (status) => {
    sessionRequest.mockRejectedValue(apiError(status));

    const { result, store } = renderVerify(persistedHint());

    await waitFor(() => expect(result.current.checking).toBe(false));

    expect(store.getState().auth.isAuthenticated).toBe(false);
    expect(store.getState().auth.user).toBeNull();
  });

  it("keeps the session when the check fails for a non-auth reason", async () => {
    // A 500 or a dropped connection says nothing about whether the cookie is
    // still valid. Signing the user out here would turn a blip in the API into
    // a forced logout.
    sessionRequest.mockRejectedValue(
      Object.assign(new Error("Network Error"), { isAxiosError: true }),
    );

    const { result, store } = renderVerify(persistedHint("engineer"));

    await waitFor(() => expect(result.current.checking).toBe(false));

    expect(store.getState().auth.isAuthenticated).toBe(true);
  });

  it("runs the check once, not on every auth state change", async () => {
    sessionRequest.mockResolvedValue({
      data: { employee_id: "emp1", role: { name: "engineer" } },
    });

    const { result, rerender } = renderVerify(persistedHint("engineer"));

    await waitFor(() => expect(result.current.checking).toBe(false));
    rerender();
    rerender();

    expect(sessionRequest).toHaveBeenCalledTimes(1);
  });
});
