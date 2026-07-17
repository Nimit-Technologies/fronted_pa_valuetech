import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedRoute({ children }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (user.data.role.name !== "super admin") {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
