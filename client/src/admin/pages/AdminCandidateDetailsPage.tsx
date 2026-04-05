import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import { getAdminCandidateById } from "../api/adminCandidatesApi";
import { ADMIN_API_ORIGIN } from "../api/adminHttp";
import type { AdminCandidateDetailsResponse } from "../types/admin";

const AdminCandidateDetailsPage = () => {
  const { token } = useAdminAuth();
  const { publicId } = useParams();

  const [data, setData] = useState<AdminCandidateDetailsResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCandidate = async () => {
      if (!token || !publicId) return;

      try {
        setError("");
        const response = await getAdminCandidateById(token, publicId);
        setData(response);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Greška pri dohvatanju detalja kandidata."
        );
      }
    };

    loadCandidate();
  }, [token, publicId]);

  if (!data && !error) {
    return <p>Učitavanje...</p>;
  }

  if (error) {
    return <p className="admin-form-error">{error}</p>;
  }

  if (!data) {
    return null;
  }

  const { candidate, applications } = data;

  return (
    <section className="admin-page">
      <div className="admin-page__header">
        <h2>
          Candidate {candidate.firstName} {candidate.lastName}
        </h2>
        <p>Detaljan pregled kandidata i njegovih prijava.</p>
      </div>

      <div className="admin-two-col">
        <div className="admin-panel">
          <h3>Candidate info</h3>
          <p><strong>Public ID:</strong> {candidate.publicId}</p>
          <p><strong>Email:</strong> {candidate.email}</p>
          <p><strong>Phone:</strong> {candidate.phone || "-"}</p>
          <p><strong>Country:</strong> {candidate.country || "-"}</p>
          <p><strong>City:</strong> {candidate.city || "-"}</p>

          <h3 className="admin-mt">Documents</h3>
          {candidate.documents?.length ? (
            <div className="admin-list">
              {candidate.documents.map((doc, index) => (
                <a
                  key={`${doc.fileUrl}-${index}`}
                  className="admin-link"
                  href={`${ADMIN_API_ORIGIN}${doc.fileUrl}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {doc.fileName}
                </a>
              ))}
            </div>
          ) : (
            <p>No documents.</p>
          )}
        </div>

        <div className="admin-panel">
          <h3>Applications</h3>
          {applications.length ? (
            <div className="admin-list">
              {applications.map((application) => (
                <div key={application.publicId} className="admin-simple-list__item">
                  <div>
                    <strong>{application.publicId}</strong>
                    <div>{application.job?.company?.name || "-"}</div>
                    <div>{application.job?.region?.name || "-"}</div>
                    <div>{new Date(application.createdAt).toLocaleString("sr-RS")}</div>
                  </div>

                  <div className="admin-inline-actions">
                    <span className={`admin-badge admin-badge--${application.status}`}>
                      {application.statusLabel || application.status}                    
                    </span>

                    <Link
                      to={`/admin/applications/${application.publicId}`}
                      className="admin-button admin-button--ghost"
                    >
                      Open
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Kandidat nema prijava.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminCandidateDetailsPage;