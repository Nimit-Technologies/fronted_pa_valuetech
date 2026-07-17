import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import IndividualEngineerLayout from "@/features/individualEngineer/layout/individualEngineerLayout";
import { renderRoutes } from "@/test/renderWithRouter";

describe("IndividualEngineerLayout", () => {
  it("renders the sidebar navigation items", () => {
    renderRoutes(
      [
        {
          path: "/engineer",
          element: <IndividualEngineerLayout />,
          children: [{ index: true, element: <div>Home content</div> }],
        },
      ],
      { initialEntries: ["/engineer"] },
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Case management")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Home/i })).toHaveAttribute(
      "href",
      "/engineer",
    );
  });

  it("renders the matched child route inside the outlet", () => {
    renderRoutes(
      [
        {
          path: "/engineer",
          element: <IndividualEngineerLayout />,
          children: [{ index: true, element: <div>Home content</div> }],
        },
      ],
      { initialEntries: ["/engineer"] },
    );

    expect(screen.getByText("Home content")).toBeInTheDocument();
  });
});
