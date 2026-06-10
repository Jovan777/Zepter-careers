import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import { ADMIN_LOGIN_PATH } from "../../config/adminRoutes";

const AdminTopbar = () => {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();

  return (
    <header className="admin-topbar">
      <div>
        <p className="admin-topbar__eyebrow">Zepter Careers</p>
        <h1 className="admin-topbar__title">Admin panel</h1>
      </div>

      <div className="admin-topbar__actions">
        <div className="admin-topbar__user">
          <strong>{admin?.email}</strong>
          <span>{admin?.role}</span>
        </div>

        <button
          type="button"
          className="admin-button admin-button--ghost"
          onClick={() => {
            logout();
            navigate(ADMIN_LOGIN_PATH);
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default AdminTopbar;
