import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AuthLayout = () => {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div>Loading...</div>;

  if (!session) {
    // Redirect them to login, but save the current location they were trying to access
    alert("Please login to access user content");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the matching child route
  return <Outlet />;
};

export default AuthLayout;
