import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { toast } from "sonner";
import authReducer from "@/features/auth/slice/authSlice";
import useLogout from "@/features/auth/hooks/useLogout";
import { logout as logoutRequest } from "@/features/auth/services";

const navigateMock = vi.fn();

vi.mock("@/features/auth/services", () => ({
  login: vi.fn(),
  logout: vi.fn(),
  session: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

vi.mock("react-router-dom", () => ({
  useNavigate: () => navigateMock,
}));

const signedIn = {
  user: { employee_id: "emp1", role: { name: "super admin" } },
  isAuthenticated: true,
  loading: false,
  error: null,
};

const renderLogout = () => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: { auth: signedIn },
  });

  const result = renderHook(() => useLogout(), {
    wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
  });

  return { ...result, store };
};

describe("useLogout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("clears the session and returns to the login screen", async () => {
    logoutRequest.mockResolvedValue({ success: true });

    const { result, store } = renderLogout();

    await act(async () => {
      await result.current.logout();
    });

    expect(logoutRequest).toHaveBeenCalledTimes(1);
    expect(store.getState().auth).toEqual({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    });
    expect(navigateMock).toHaveBeenCalledWith("/", { replace: true });
  });

  // The cookie is httpOnly, so the client cannot clear it itself — but leaving
  // the user on a dashboard with stale state because the request failed is
  // worse than signing them out locally and letting the cookie expire.
  it("still clears local state when the request fails", async () => {
    logoutRequest.mockRejectedValue(
      Object.assign(new Error("Network Error"), { isAxiosError: true }),
    );

    const { result, store } = renderLogout();

    await act(async () => {
      await result.current.logout();
    });

    expect(store.getState().auth.isAuthenticated).toBe(false);
    expect(store.getState().auth.user).toBeNull();
    expect(navigateMock).toHaveBeenCalledWith("/", { replace: true });
    expect(toast.error).toHaveBeenCalled();
  });

  it("does not reject, so a logout button never needs a catch", async () => {
    logoutRequest.mockRejectedValue(
      Object.assign(new Error("boom"), { isAxiosError: true }),
    );

    const { result } = renderLogout();

    await expect(
      act(async () => {
        await result.current.logout();
      }),
    ).resolves.not.toThrow();
  });

  it("leaves no user details behind for the next session", async () => {
    logoutRequest.mockResolvedValue({ success: true });

    const { result, store } = renderLogout();

    await act(async () => {
      await result.current.logout();
    });

    // The auth slice is persisted to localStorage, so anything surviving here
    // outlives the session on a shared machine.
    expect(JSON.stringify(store.getState().auth)).not.toContain("emp1");
  });
});
