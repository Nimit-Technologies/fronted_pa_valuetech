import { Navigate } from "react-router-dom";
import useSession from "@/features/auth/hooks/useSession";
import { ROLE_HOME_ROUTES } from "@/features/auth/constants/roles";

const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, role } = useSession();
  const homeRoute = ROLE_HOME_ROUTES[role];

  if (isAuthenticated && homeRoute) {
    return <Navigate to={homeRoute} replace />;
  }

  return children;
};

export default PublicOnlyRoute;
