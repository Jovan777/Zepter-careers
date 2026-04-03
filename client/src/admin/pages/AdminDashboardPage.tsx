import { useEffect, useState } from "react";
import { useAdminAuth } from "../context/AdminAuthContext";
import { getDashboardStats } from "../api/adminDashboardApi";
import type { DashboardStats } from "../types/admin";

const AdminDashboardPage = () => {
  const { token } = useAdminAuth();
  const [data, setData] = useState<DashboardStats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!token) return;
      try {
        setError("");
        const response = await getDashboardStats(token);
        setData(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Greška pri dohvatanju dashboard-a.");
      }
    };

    load();
  }, [token]);

  if (!data && !error) return <p>Učitavanje...</p>;
  if (error) return <p className="admin-form-error">{error}</p>;

  return (
    <section className="admin-page">
      <div className="admin-page__header">
        <h2>Dashboard</h2>
        <p>Pregled najvažnijih statistika sistema.</p>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <span>Published jobs</span>
          <strong>{data?.activeJobs ?? 0}</strong>
        </div>
        <div className="admin-stat-card">
          <span>Total jobs</span>
          <strong>{data?.totalJobs ?? 0}</strong>
        </div>
        <div className="admin-stat-card">
          <span>Total applications</span>
          <strong>{data?.totalApplications ?? 0}</strong>
        </div>
      </div>

      <div className="admin-two-col">
        <div className="admin-panel">
          <h3>Pipeline</h3>
          <div className="admin-simple-list">
            {data?.pipeline.map((item) => (
              <div key={item.status} className="admin-simple-list__item">
                <span>{item.status}</span>
                <strong>{item.count}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-panel">
          <h3>Top regions</h3>
          <div className="admin-simple-list">
            {data?.topRegions.map((item) => (
              <div key={item.regionId} className="admin-simple-list__item">
                <span>{item.region}</span>
                <strong>{item.count}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboardPage;