import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import { getAdminApplicationById, updateAdminApplicationStatus } from "../api/adminApplicationsApi";
import type { AdminApplicationDetailsResponse } from "../types/admin";

const statusOptions = [
  "new",
  "screening",
  "interview",
  "offer",
  "onboarding",
  "hired",
  "rejected",
  "withdrawn",
  "archived",
];

const AdminApplicationDetailsPage = () => {
  const { token } = useAdminAuth();
  const { publicId } = useParams();
  const [data, setData] = useState<AdminApplicationDetailsResponse | null>(null);
  const [status, setStatus] = useState("new");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    if (!token || !publicId) return;
    try {
      const response = await getAdminApplicationById(token, publicId);
      setData(response);
      setStatus(response.application.status);
      setReason(response.application.reason || "");
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Greška pri dohvatanju detalja prijave.");
    }
  };

  useEffect(() => {
    load();
  }, [token, publicId]);

  if (!data && !error) return <p>Učitavanje...</p>;
  if (error) return <p className="admin-form-error">{error}</p>;

  const application = data?.application;
  if (!application) return null;

  return (
    <section className="admin-page">
      <div className="admin-page__header">
        <h2>Application {application.publicId}</h2>
        <p>Detaljan pregled kandidata, dokumenta i istorije događaja.</p>
      </div>

      <div className="admin-two-col">
        <div className="admin-panel">
          <h3>Candidate</h3>
          <p><strong>{application.candidate.firstName} {application.candidate.lastName}</strong></p>
          <p>{application.candidate.email}</p>
          <p>{application.candidate.phone || "-"}</p>
          <p>{application.candidate.country || "-"}, {application.candidate.city || "-"}</p>

          <h3>Job</h3>
          <p>{application.job?.company?.name || "-"}</p>
          <p>{application.job?.region?.name || "-"}</p>

          <h3>Documents</h3>
          {application.cvDocument?.fileUrl ? (
            <a className="admin-link" href={`http://localhost:5000${application.cvDocument.fileUrl}`} target="_blank" rel="noreferrer">
              Open CV
            </a>
          ) : (
            <p>No CV</p>
          )}
        </div>

        <div className="admin-panel">
          <h3>Status management</h3>
          <select className="admin-input" value={status} onChange={(e) => setStatus(e.target.value)}>
            {statusOptions.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <textarea className="admin-input admin-input--textarea" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason" />
          <button
            className="admin-button admin-button--primary"
            onClick={async () => {
              if (!token || !publicId) return;
              await updateAdminApplicationStatus(token, publicId, { status, reason });
              await load();
            }}
          >
            Update status
          </button>

          <h3 className="admin-mt">Events</h3>
          <div className="admin-timeline">
            {application.events.map((event, index) => (
              <div key={`${event.type}-${event.timestamp}-${index}`} className="admin-timeline__item">
                <strong>{event.type}</strong>
                <span>{new Date(event.timestamp).toLocaleString("sr-RS")}</span>
                <pre>{JSON.stringify(event.data, null, 2)}</pre>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminApplicationDetailsPage;