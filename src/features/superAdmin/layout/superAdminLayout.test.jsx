import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import SuperAdminLayout from "@/features/superAdmin/layout/superAdminLayout";
import { renderRoutes } from "@/test/renderWithRouter";

describe("SuperAdminLayout", () => {
  it("renders the sidebar navigation items", () => {
    renderRoutes(
      [
        {
          path: "/super-admin",
          element: <SuperAdminLayout />,
          children: [{ index: true, element: <div>Dashboard content</div> }],
        },
      ],
      { initialEntries: ["/super-admin"] },
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Branch")).toBeInTheDocument();
    expect(screen.getByText("User")).toBeInTheDocument();
    expect(screen.getByText("Department")).toBeInTheDocument();
    expect(screen.getByText("Role")).toBeInTheDocument();
  });

  it("renders the matched child route inside the outlet", () => {
    renderRoutes(
      [
        {
          path: "/super-admin",
          element: <SuperAdminLayout />,
          children: [{ index: true, element: <div>Dashboard content</div> }],
        },
      ],
      { initialEntries: ["/super-admin"] },
    );

    expect(screen.getByText("Dashboard content")).toBeInTheDocument();
  });

  it("renders sidebar links with correct paths", () => {
    renderRoutes(
      [
        {
          path: "/super-admin",
          element: <SuperAdminLayout />,
          children: [{ index: true, element: <div>Home</div> }],
        },
      ],
      { initialEntries: ["/super-admin"] },
    );

    expect(screen.getByRole("link", { name: /Home/i })).toHaveAttribute(
      "href",
      "/super-admin",
    );
  });
});
