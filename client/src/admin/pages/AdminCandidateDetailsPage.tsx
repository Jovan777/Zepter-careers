import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import {
  archiveAdminCandidate,
  getAdminCandidateById,
  restoreAdminCandidate,
} from "../api/adminCandidatesApi";
import { resolveUploadUrl } from "../../config/urls";
import type { AdminCandidateDetailsResponse } from "../types/admin";

const AdminCandidateDetailsPage = () => {
  const { token } = useAdminAuth();
  const { publicId } = useParams();

  const [data, setData] = useState<AdminCandidateDetailsResponse | null>(null);
  const [error, setError] = useState("");

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

  useEffect(() => {
    loadCandidate();
  }, [token, publicId]);

  const handleArchive = async () => {
    if (!token || !publicId || !data) return;

    const confirmed = window.confirm(
      `Arhivirati kandidata ${data.candidate.firstName} ${data.candidate.lastName}?`
    );

    if (!confirmed) return;

    const reason = window.prompt("Razlog arhiviranja, opciono:") || "";

    try {
      setError("");
      await archiveAdminCandidate(token, publicId, { reason });
      await loadCandidate();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Greška pri arhiviranju kandidata."
      );
    }
  };

  const handleRestore = async () => {
    if (!token || !publicId || !data) return;

    const confirmed = window.confirm(
      `Vratiti kandidata ${data.candidate.firstName} ${data.candidate.lastName} među aktivne?`
    );

    if (!confirmed) return;

    try {
      setError("");
      await restoreAdminCandidate(token, publicId);
      await loadCandidate();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Greška pri vraćanju kandidata."
      );
    }
  };

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
      <div className="admin-page__header admin-page__header--row">
        <div>
          <h2>
            Candidate {candidate.firstName} {candidate.lastName}
          </h2>
          <p>Detaljan pregled kandidata i njegovih prijava.</p>
        </div>

        <div className="admin-page__actions">
          {candidate.isArchived ? (
            <>
              <span className="admin-badge admin-badge--archived">
                Archived
              </span>

              <button
                type="button"
                className="admin-button admin-button--primary"
                onClick={handleRestore}
              >
                Restore candidate
              </button>
            </>
          ) : (
            <button
              type="button"
              className="admin-button admin-button--danger"
              onClick={handleArchive}
            >
              Archive candidate
            </button>
          )}
        </div>
      </div>

      <div className="admin-two-col">
        <div className="admin-panel">
          <h3>Candidate info</h3>

          <div className="admin-details-stack">
            <p><strong>Public ID:</strong> {candidate.publicId}</p>
            <p><strong>Email:</strong> {candidate.email}</p>
            <p><strong>Phone:</strong> {candidate.phone || "-"}</p>
            <p><strong>Country:</strong> {candidate.country || "-"}</p>
            <p><strong>City:</strong> {candidate.city || "-"}</p>
            <p>
              <strong>Status:</strong>{" "}
              {candidate.isArchived ? "Archived" : "Active"}
            </p>

            {candidate.isArchived && (
              <>
                <p>
                  <strong>Archived at:</strong>{" "}
                  {candidate.archivedAt
                    ? new Date(candidate.archivedAt).toLocaleString("sr-RS")
                    : "-"}
                </p>

                <p>
                  <strong>Archive reason:</strong>{" "}
                  {candidate.archivedReason || "-"}
                </p>

                <p>
                  <strong>Archived by:</strong>{" "}
                  {candidate.archivedBy?.email || "-"}
                </p>
              </>
            )}
          </div>

          <h3 className="admin-mt">Documents</h3>
          {candidate.documents?.length ? (
            <div className="admin-list">
              {candidate.documents.map((doc, index) => (
                <a
                  key={`${doc.fileUrl}-${index}`}
                  className="admin-link"
                  href={resolveUploadUrl(doc.fileUrl)}
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
                    <strong>
                      {application.job?.positionName || application.job?.publicId || "-"}
                    </strong>
                    <div>Company: {application.job?.company?.name || "-"}</div>
                    <div>Region: {application.job?.region?.name || "-"}</div>
                    <div>
                      Applied at:{" "}
                      {application.createdAt || application.appliedAt
                        ? new Date(
                          application.createdAt || application.appliedAt || ""
                        ).toLocaleString("sr-RS")
                        : "-"}
                    </div>
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
