import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { User2 } from "lucide-react";

function ProtectedRoute({ children }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  console.log("User role in ProtectedRoute:", user); // Debugging line
  if (user.data.role.name !== "super admin") {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;