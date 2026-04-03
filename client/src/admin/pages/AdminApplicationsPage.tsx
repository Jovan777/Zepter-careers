import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import { getAdminApplications } from "../api/adminApplicationsApi";
import type { AdminApplicationListItem } from "../types/admin";

const AdminApplicationsPage = () => {
  const { token } = useAdminAuth();
  const [items, setItems] = useState<AdminApplicationListItem[]>([]);
  const [status, setStatus] = useState("");
  const [email, setEmail] = useState("");
  const [search, setSearch] = useState("");
  const [statuses, setStatuses] = useState<string[]>([]);
  const [error, setError] = useState("");

  const load = async () => {
    if (!token) return;
    try {
      const data = await getAdminApplications(token, { status, email, search });
      setItems(data.applications);
      setStatuses(data.statuses);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Greška pri dohvatanju prijava.");
    }
  };

  useEffect(() => {
    load();
  }, [token, status]);

  return (
    <section className="admin-page">
      <div className="admin-page__header">
        <h2>Applications</h2>
        <p>Pregled svih prijava i status workflow.</p>
      </div>

      <div className="admin-panel admin-filters-row">
        <select className="admin-input" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          {statuses.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <input className="admin-input" placeholder="Filter by candidate email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="admin-input" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
        <button className="admin-button admin-button--primary" onClick={load}>Apply filters</button>
      </div>

      {error && <p className="admin-form-error">{error}</p>}

      <div className="admin-panel admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Application ID</th>
              <th>Candidate</th>
              <th>Email</th>
              <th>Company</th>
              <th>Region</th>
              <th>Status</th>
              <th>Applied at</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td>{item.publicId}</td>
                <td>{item.candidate.firstName} {item.candidate.lastName}</td>
                <td>{item.candidate.email}</td>
                <td>{item.job?.company?.name || "-"}</td>
                <td>{item.job?.region?.name || "-"}</td>
                <td><span className={`admin-badge admin-badge--${item.status}`}>{item.statusLabel}</span></td>
                <td>{new Date(item.appliedAt).toLocaleString("sr-RS")}</td>
                <td>
                  <Link className="admin-button admin-button--ghost" to={`/admin/applications/${item.publicId}`}>
                    Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AdminApplicationsPage;