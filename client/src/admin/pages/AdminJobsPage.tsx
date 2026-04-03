import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import { deleteAdminJob, getAdminJobs, repostAdminJob } from "../api/adminJobsApi";
import type { AdminJobListItem } from "../types/admin";

const AdminJobsPage = () => {
  const { token } = useAdminAuth();
  const [locale, setLocale] = useState("sr");
  const [jobs, setJobs] = useState<AdminJobListItem[]>([]);
  const [error, setError] = useState("");

  const loadJobs = async () => {
    if (!token) return;
    try {
      setError("");
      const data = await getAdminJobs(token, locale);
      setJobs(data.jobs);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Greška pri dohvatanju jobs liste.");
    }
  };

  useEffect(() => {
    loadJobs();
  }, [token, locale]);

  return (
    <section className="admin-page">
      <div className="admin-page__header admin-page__header--row">
        <div>
          <h2>Jobs</h2>
          <p>Pregled, kreiranje, uređivanje i repost poslova.</p>
        </div>
        <div className="admin-page__actions">
          <select value={locale} onChange={(e) => setLocale(e.target.value)} className="admin-input">
            <option value="sr">sr</option>
            <option value="en">en</option>
          </select>
          <Link to="/admin/jobs/new" className="admin-button admin-button--primary">
            New job
          </Link>
        </div>
      </div>

      {error && <p className="admin-form-error">{error}</p>}

      <div className="admin-panel admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Public ID</th>
              <th>Name</th>
              <th>Company</th>
              <th>Region</th>
              <th>Status</th>
              <th>Applied</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job._id}>
                <td>{job.publicId}</td>
                <td>{job.name}</td>
                <td>{job.company?.name || "-"}</td>
                <td>{job.region?.name || "-"}</td>
                <td><span className={`admin-badge admin-badge--${job.status}`}>{job.status}</span></td>
                <td>{job.appliedCount}</td>
                <td>
                  <div className="admin-inline-actions">
                    <Link to={`/admin/jobs/${job.publicId}`} className="admin-button admin-button--ghost">
                      Edit
                    </Link>
                    <button
                      className="admin-button admin-button--ghost"
                      onClick={async () => {
                        if (!token) return;
                        await repostAdminJob(token, job.publicId, {});
                        await loadJobs();
                      }}
                    >
                      Repost
                    </button>
                    <button
                      className="admin-button admin-button--danger"
                      onClick={async () => {
                        if (!token) return;
                        const confirmed = window.confirm(`Obrisati job ${job.publicId}?`);
                        if (!confirmed) return;
                        await deleteAdminJob(token, job.publicId);
                        await loadJobs();
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AdminJobsPage;