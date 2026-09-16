import { Navigate } from "react-router-dom";
import useSession from "@/features/auth/hooks/useSession";
import { ROLE_HOME_ROUTES } from "@/features/auth/constants/roles";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role } = useSession();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={ROLE_HOME_ROUTES[role] ?? "/"} replace />;
  }

  return children;
};

export default ProtectedRoute;
