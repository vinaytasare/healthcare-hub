import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, token } = useAuth();
  if (!token || !user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== "ADMIN") return <Navigate to="/dashboard" />;
  return children;
};

export default ProtectedRoute;