import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { toast } from "sonner";
import authReducer from "@/features/auth/slice/authSlice";
import useLogin from "@/features/auth/hooks/useLogin";
import { login as loginRequest } from "@/features/auth/services";

vi.mock("@/features/auth/services", () => ({
  login: vi.fn(),
  logout: vi.fn(),
  session: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

const renderLogin = () => {
  const store = configureStore({ reducer: { auth: authReducer } });

  const result = renderHook(() => useLogin(), {
    wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
  });

  return { ...result, store };
};

const apiError = (status, message) =>
  Object.assign(new Error(`Request failed with status code ${status}`), {
    isAxiosError: true,
    response: { status, data: message ? { message } : {} },
  });

describe("useLogin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("stores the user and returns it on success", async () => {
    const user = { employee_id: "emp1", role: { name: "super admin" } };
    // The service returns the response body, so the user sits under `data`.
    loginRequest.mockResolvedValue({ success: true, data: user });

    const { result, store } = renderLogin();

    let returned;
    await act(async () => {
      returned = await result.current.login({
        employee_id: "emp1",
        password: "correct",
      });
    });

    // The caller needs the user back to pick a destination by role.
    expect(returned).toEqual(user);
    expect(store.getState().auth.user).toEqual(user);
    expect(store.getState().auth.isAuthenticated).toBe(true);
    expect(store.getState().auth.loading).toBe(false);
  });

  it("surfaces the API's message and rethrows on bad credentials", async () => {
    loginRequest.mockRejectedValue(
      apiError(401, "Invalid employee id or password"),
    );

    const { result, store } = renderLogin();

    // Rethrown so the form can clear the password and refocus it.
    await expect(
      act(async () => {
        await result.current.login({ employee_id: "emp1", password: "wrong" });
      }),
    ).rejects.toThrow();

    expect(store.getState().auth.error).toBe("Invalid employee id or password");
    expect(store.getState().auth.isAuthenticated).toBe(false);
    expect(store.getState().auth.user).toBeNull();
    expect(toast.error).toHaveBeenCalledWith("Invalid employee id or password");
  });

  it("passes the rate-limit message straight through on 429", async () => {
    loginRequest.mockRejectedValue(
      apiError(429, "Too many login attempts for this account."),
    );

    const { result, store } = renderLogin();

    await expect(
      act(async () => {
        await result.current.login({ employee_id: "emp1", password: "wrong" });
      }),
    ).rejects.toThrow();

    expect(store.getState().auth.error).toBe(
      "Too many login attempts for this account.",
    );
  });

  // A login that never reached the server is not a login problem, and telling
  // the user to "try again" sends them round the same loop. extractErrorMessage
  // names the real cause instead.
  it("blames the connection when the request never reached the API", async () => {
    loginRequest.mockRejectedValue(
      Object.assign(new Error(""), { isAxiosError: true }),
    );

    const { result, store } = renderLogin();

    await expect(
      act(async () => {
        await result.current.login({ employee_id: "emp1", password: "x" });
      }),
    ).rejects.toThrow();

    expect(store.getState().auth.error).toMatch(/can't reach the server/i);
  });

  it("falls back to its own wording when the API answers with nothing useful", async () => {
    loginRequest.mockRejectedValue(apiError(400, null));

    const { result, store } = renderLogin();

    await expect(
      act(async () => {
        await result.current.login({ employee_id: "emp1", password: "x" });
      }),
    ).rejects.toThrow();

    expect(store.getState().auth.error).toBe(
      "Unable to log in. Please try again.",
    );
  });

  it("clears a previous error when a retry succeeds", async () => {
    const { result, store } = renderLogin();

    loginRequest.mockRejectedValue(apiError(401, "Invalid credentials"));
    await expect(
      act(async () => {
        await result.current.login({ employee_id: "emp1", password: "wrong" });
      }),
    ).rejects.toThrow();
    expect(store.getState().auth.error).toBe("Invalid credentials");

    loginRequest.mockResolvedValue({
      data: { employee_id: "emp1", role: { name: "engineer" } },
    });
    await act(async () => {
      await result.current.login({ employee_id: "emp1", password: "correct" });
    });

    // A stale "Invalid credentials" left under a successful login would sit
    // on the dashboard the user just reached.
    expect(store.getState().auth.error).toBeNull();
  });
});
