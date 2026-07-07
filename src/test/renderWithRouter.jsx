import { MemoryRouter, Routes, Route } from "react-router-dom";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { render } from "@testing-library/react";

export function renderWithRoute(ui, { route = "/", path = "/" } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path={path} element={ui} />
      </Routes>
    </MemoryRouter>,
  );
}

export function renderRoutes(routes, { initialEntries = ["/"] } = {}) {
  const router = createMemoryRouter(routes, { initialEntries });
  const utils = render(<RouterProvider router={router} />);
  return { ...utils, router };
}
