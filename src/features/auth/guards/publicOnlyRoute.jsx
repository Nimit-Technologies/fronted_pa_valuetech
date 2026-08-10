import { Navigate } from "react-router-dom";
import useSession from "@/features/auth/hooks/useSession";
import { ROLE_HOME_ROUTES } from "@/features/auth/constants/roles";

// Mirrors ProtectedRoute for the opposite direction: keeps an
// already-authenticated user from landing on the login screen again (e.g.
// visiting "/" or "/login" directly, or via the back button).
const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, role } = useSession();
  const homeRoute = ROLE_HOME_ROUTES[role];

  // Only redirect when we actually know where "home" is — an authenticated
  // user with an unrecognized role falls through to the login page rather
  // than bouncing back here in a loop.
  if (isAuthenticated && homeRoute) {
    return <Navigate to={homeRoute} replace />;
  }

  return children;
};

export default PublicOnlyRoute;
