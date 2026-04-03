import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) {
    return <div className="admin-loading-screen">Učitavanje admin panela...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;