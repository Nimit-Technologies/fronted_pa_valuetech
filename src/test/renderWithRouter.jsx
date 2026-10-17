import { render } from "@testing-library/react";
import {
  createMemoryRouter,
  MemoryRouter,
  Route,
  Routes,
  RouterProvider,
} from "react-router-dom";

// Renders `ui` inside a router.
//
// Pass `path` (and the `route` to start on) when the component reads
// useParams(): a component needs to mount inside a *matching* Route for those
// to resolve, not merely inside a Router. Without it every param is undefined,
// and a page that looks its record up by id quietly renders its not-found
// branch instead of the thing under test.
//
// `initialEntries` on its own is still the plain case — a component that only
// needs Link or useNavigate to work.
export function renderWithRoute(ui, { initialEntries, route, path } = {}) {
  const entries = initialEntries ?? (route ? [route] : ["/"]);

  return render(
    <MemoryRouter initialEntries={entries}>
      {path ? (
        <Routes>
          <Route path={path} element={ui} />
        </Routes>
      ) : (
        ui
      )}
    </MemoryRouter>,
  );
}

export function renderRoutes(routes, options = {}) {
  const router = createMemoryRouter(routes, options);
  const result = render(<RouterProvider router={router} />);

  return { ...result, router };
}
