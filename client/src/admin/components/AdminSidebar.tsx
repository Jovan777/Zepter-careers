import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { publicAssetUrl } from "../../config/urls";
import { getAdminContactMessagesUnreadCount } from "../api/adminContactMessagesApi";
import { useAdminAuth } from "../context/AdminAuthContext";

type AdminSidebarLink = {
  to: string;
  label: string;
  showContactBadge?: boolean;
};

const links: AdminSidebarLink[] = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/jobs", label: "Jobs" },
  { to: "/admin/translations", label: "Translations" },
  { to: "/admin/applications", label: "Applications" },
  { to: "/admin/talent-pool", label: "Talent Pool" },
  { to: "/admin/sales-consultants", label: "Konsultanti prodaje" },
  { to: "/admin/contact-messages", label: "Kontakt", showContactBadge: true },
  { to: "/admin/candidates", label: "Candidates" },
  { to: "/admin/scheduler", label: "Scheduler" },
  { to: "/admin/companies", label: "Companies" },
  { to: "/admin/regions", label: "Regions" },
  { to: "/admin/presences", label: "Presences" },
];

const AdminSidebar = () => {
  const { token } = useAdminAuth();
  const [contactUnreadCount, setContactUnreadCount] = useState(0);

  const loadContactUnreadCount = async () => {
    if (!token) {
      setContactUnreadCount(0);
      return;
    }

    try {
      const data = await getAdminContactMessagesUnreadCount(token);
      setContactUnreadCount(data.count);
    } catch (error) {
      console.error("Greska pri dohvatanju broja novih kontakt poruka:", error);
    }
  };

  useEffect(() => {
    loadContactUnreadCount();

    const handleRefresh = () => loadContactUnreadCount();
    const intervalId = window.setInterval(loadContactUnreadCount, 60000);
    window.addEventListener("contact-messages:refresh-count", handleRefresh);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("contact-messages:refresh-count", handleRefresh);
    };
  }, [token]);

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__brand">
        <img
          src={publicAssetUrl("/Zepter-Careers images/zepter_logo_web 1.png")}
          alt="Zepter"
        />
        <span>Admin Portal</span>
      </div>

      <nav className="admin-sidebar__nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `admin-sidebar__link ${isActive ? "admin-sidebar__link--active" : ""}`
            }
          >
            <span>{link.label}</span>
            {link.showContactBadge && contactUnreadCount > 0 ? (
              <span className="admin-sidebar__badge">{contactUnreadCount}</span>
            ) : null}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
