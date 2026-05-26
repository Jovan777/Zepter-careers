import { NavLink } from "react-router-dom";

const links = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/jobs", label: "Jobs" },
  { to: "/admin/translations", label: "Translations" },
  { to: "/admin/applications", label: "Applications" },
  { to: "/admin/candidates", label: "Candidates" },
  { to: "/admin/scheduler", label: "Scheduler" },
  { to: "/admin/companies", label: "Companies" },
  { to: "/admin/regions", label: "Regions" },
  { to: "/admin/presences", label: "Presences" },
];

const AdminSidebar = () => {
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__brand">
        <img src="/Zepter-Careers images/zepter_logo_web 1.png" alt="Zepter" />
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
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;