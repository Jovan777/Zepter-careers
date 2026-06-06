import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import { ADMIN_LOGIN_PATH } from "../../config/adminRoutes";

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) {
    return <div className="admin-loading-screen">Učitavanje admin panela...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to={ADMIN_LOGIN_PATH} replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
