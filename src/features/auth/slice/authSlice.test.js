import { describe, it, expect } from "vitest";
import reducer, {
  loginStart,
  loginSuccess,
  loginFailure,
  logoutStart,
  clearError,
  logout,
} from "@/features/auth/slice/authSlice";

const INITIAL = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authenticated = {
  user: { employee_id: "emp1", role: { name: "super admin" } },
  isAuthenticated: true,
  loading: false,
  error: null,
};

describe("authSlice", () => {
  it("starts unauthenticated", () => {
    expect(reducer(undefined, { type: "@@INIT" })).toEqual(INITIAL);
  });

  it("marks loading and drops a previous error on loginStart", () => {
    const state = reducer(
      { ...INITIAL, error: "Wrong password" },
      loginStart(),
    );

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it("stores the user and authenticates on loginSuccess", () => {
    const user = { employee_id: "emp1", role: { name: "engineer" } };
    const state = reducer(
      { ...INITIAL, loading: true },
      loginSuccess({ user }),
    );

    expect(state.user).toEqual(user);
    expect(state.isAuthenticated).toBe(true);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it("clears any stale user on loginFailure", () => {
    const state = reducer(authenticated, loginFailure("Invalid credentials"));

    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.error).toBe("Invalid credentials");
    expect(state.loading).toBe(false);
  });

  it("marks loading on logoutStart without dropping the session yet", () => {
    const state = reducer(authenticated, logoutStart());

    expect(state.loading).toBe(true);
    // Still authenticated: the session is only torn down once the request
    // resolves, so a failed logout doesn't leave the UI in limbo.
    expect(state.isAuthenticated).toBe(true);
  });

  it("clears only the error on clearError", () => {
    const state = reducer(
      { ...authenticated, error: "Something failed" },
      clearError(),
    );

    expect(state.error).toBeNull();
    expect(state.user).toEqual(authenticated.user);
  });

  // The 401 interceptor and useVerifySession both recover by dispatching
  // logout(), so a partial reset here would strand an expired session's user
  // details in the store (and in localStorage, which persists the auth slice).
  it("wipes the whole slice on logout", () => {
    expect(reducer({ ...authenticated, error: "x" }, logout())).toEqual(
      INITIAL,
    );
  });

  it("never stores a token", () => {
    const state = reducer(
      INITIAL,
      loginSuccess({
        user: { employee_id: "emp1", role: { name: "super admin" } },
      }),
    );

    // The session is an httpOnly cookie; a token in Redux would be persisted
    // to localStorage and readable by any XSS.
    expect(state).not.toHaveProperty("token");
    expect(Object.keys(state).sort()).toEqual([
      "error",
      "isAuthenticated",
      "loading",
      "user",
    ]);
  });
});
