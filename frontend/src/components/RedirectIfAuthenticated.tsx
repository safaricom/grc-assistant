import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const RedirectIfAuthenticated = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null; // Or a loading indicator
  }

  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};

export default RedirectIfAuthenticated;
