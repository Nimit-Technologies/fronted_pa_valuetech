import { render } from "@testing-library/react";
import {
  createMemoryRouter,
  MemoryRouter,
  RouterProvider,
} from "react-router-dom";

export function renderWithRoute(ui, { initialEntries = ["/"] } = {}) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>,
  );
}

export function renderRoutes(routes, options = {}) {
  const router = createMemoryRouter(routes, options);
  const result = render(<RouterProvider router={router} />);

  return { ...result, router };
}
