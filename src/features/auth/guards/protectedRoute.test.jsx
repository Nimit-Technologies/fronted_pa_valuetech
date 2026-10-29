import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "@/features/auth/guards/protectedRoute";
import authReducer from "@/features/auth/slice/authSlice";
import { renderWithStore } from "@/test/renderWithStore";

// Passing `allowedRoles: undefined` would hit the default below, so the
// "guard every role equally" case needs its own sentinel.
const ANY_ROLE = Symbol("any role");

// Mounts the guard at /super-admin alongside the two routes it can bounce to,
// so a redirect is observable as rendered markup rather than asserted on a
// mocked <Navigate>.
const renderGuard = ({ auth, allowedRoles = ["super admin"] }) =>
  renderWithStore(
    <MemoryRouter initialEntries={["/super-admin"]}>
      <Routes>
        <Route path="/" element={<p>Login screen</p>} />
        <Route path="/engineer" element={<p>Engineer home</p>} />
        <Route
          path="/super-admin"
          element={
            <ProtectedRoute
              allowedRoles={
                allowedRoles === ANY_ROLE ? undefined : allowedRoles
              }
            >
              <p>Super admin dashboard</p>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>,
    {
      reducer: { auth: authReducer },
      preloadedState: {
        auth: {
          user: null,
          isAuthenticated: false,
          loading: false,
          error: null,
          ...auth,
        },
      },
    },
  );

const sessionFor = (roleName) => ({
  user: { employee_id: "emp1", role: { name: roleName } },
  isAuthenticated: true,
});

describe("ProtectedRoute", () => {
  it("sends an unauthenticated visitor to the login screen", () => {
    renderGuard({ auth: { isAuthenticated: false, user: null } });

    expect(screen.getByText("Login screen")).toBeInTheDocument();
    expect(screen.queryByText("Super admin dashboard")).not.toBeInTheDocument();
  });

  it("renders the route for an allowed role", () => {
    renderGuard({ auth: sessionFor("super admin") });

    expect(screen.getByText("Super admin dashboard")).toBeInTheDocument();
  });

  it("bounces a signed-in user with the wrong role to their own dashboard", () => {
    renderGuard({ auth: sessionFor("engineer") });

    expect(screen.getByText("Engineer home")).toBeInTheDocument();
    expect(screen.queryByText("Super admin dashboard")).not.toBeInTheDocument();
  });

  // A role row is free text created per department, so a name with no dashboard
  // of its own has to land somewhere rather than redirect to undefined.
  it("falls back to the login screen for a role with no home route", () => {
    renderGuard({ auth: sessionFor("auditor") });

    expect(screen.getByText("Login screen")).toBeInTheDocument();
  });

  it("allows any authenticated role when no allowedRoles are given", () => {
    renderGuard({ auth: sessionFor("cordinator"), allowedRoles: ANY_ROLE });

    expect(screen.getByText("Super admin dashboard")).toBeInTheDocument();
  });

  // The persisted auth slice is reduced to { role: { name } } only, so a
  // rehydrated session reaches the guard without employee_id, email or phone.
  it("works from the reduced session shape that survives a refresh", () => {
    renderGuard({
      auth: { isAuthenticated: true, user: { role: { name: "super admin" } } },
    });

    expect(screen.getByText("Super admin dashboard")).toBeInTheDocument();
  });
});
