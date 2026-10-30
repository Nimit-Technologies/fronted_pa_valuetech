import { Navigate, useLocation } from "react-router-dom";
import useSession from "@/features/auth/hooks/useSession";
import { ROLE_HOME_ROUTES } from "@/features/auth/constants/roles";
import { rememberReturnTo } from "@/features/auth/returnTo";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role } = useSession();
  const location = useLocation();

  if (!isAuthenticated) {
    // A deep link opened without a session: remember it so the login form can
    // finish the journey the user started. Written during render on purpose —
    // this component returns a redirect instead of mounting, so there is no
    // effect that would run.
    rememberReturnTo(`${location.pathname}${location.search}${location.hash}`);
    return <Navigate to="/" replace />;
  }

  // Signed in, wrong role. Not remembered: this user will never be allowed
  // here, so the path is not something to return to after a re-login — it is a
  // page that belongs to someone else. Their own dashboard is the useful
  // destination, and `replace` keeps the forbidden URL out of the back history.
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={ROLE_HOME_ROUTES[role] ?? "/"} replace />;
  }

  return children;
};

export default ProtectedRoute;
