import { Navigate } from "react-router-dom";
import useSession from "@/features/auth/hooks/useSession";
import { ROLE_HOME_ROUTES } from "@/features/auth/constants/roles";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role } = useSession();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Authenticated, just not for this route — send them to their own home
    // instead of back to /login, which would just re-render the login form
    // with no explanation for a user who is, in fact, already logged in.
    return <Navigate to={ROLE_HOME_ROUTES[role] ?? "/login"} replace />;
  }

  return children;
};

export default ProtectedRoute;
