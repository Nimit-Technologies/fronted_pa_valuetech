import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import authReducer from "@/features/auth/slice/authSlice";
import NotFound from "@/pages/notFound";
import { renderWithStore } from "@/test/renderWithStore";

const renderNotFound = ({ auth = {}, entry = "/engineer/casex" } = {}) =>
  renderWithStore(
    <MemoryRouter initialEntries={[entry]}>
      <NotFound />
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

describe("NotFound", () => {
  it("says which address was wrong", () => {
    renderNotFound({ entry: "/engineer/casex" });

    expect(screen.getByRole("heading")).toHaveTextContent(
      /this page doesn't exist/i,
    );
    expect(screen.getByText("/engineer/casex")).toBeInTheDocument();
  });

  // The way out has to be a page this session may actually open, or the 404
  // just bounces into a redirect.
  it("offers the signed-in user their own dashboard", () => {
    renderNotFound({ auth: sessionFor("cordinator") });

    expect(
      screen.getByRole("link", { name: "Go to dashboard" }),
    ).toHaveAttribute("href", "/cordinator");
  });

  it("offers login to a visitor with no session", () => {
    renderNotFound();

    expect(screen.getByRole("link", { name: "Go to login" })).toHaveAttribute(
      "href",
      "/",
    );
  });

  // Role rows are free text, so a role with no dashboard of its own must still
  // get a link that goes somewhere.
  it("falls back to login for a role with no dashboard", () => {
    renderNotFound({ auth: sessionFor("auditor") });

    expect(screen.getByRole("link", { name: "Go to login" })).toHaveAttribute(
      "href",
      "/",
    );
  });
});
