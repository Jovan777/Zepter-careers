import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import {
  exportAdminArchivedCandidates,
  getAdminArchivedCandidates,
  restoreAdminCandidate,
} from "../api/adminCandidatesApi";
import type { AdminCandidate } from "../types/admin";

const AdminArchivedCandidatesPage = () => {
  const { token } = useAdminAuth();

  const [candidates, setCandidates] = useState<AdminCandidate[]>([]);
  const [email, setEmail] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const loadCandidates = async () => {
    if (!token) return;

    try {
      setIsLoading(true);
      setError("");

      const data = await getAdminArchivedCandidates(token, {
        email,
        search,
      });

      setCandidates(data.candidates);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Greška pri dohvatanju arhiviranih kandidata."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCandidates();
  }, [token]);

  const handleRestoreCandidate = async (candidate: AdminCandidate) => {
    if (!token) return;

    const confirmed = window.confirm(
      `Vratiti kandidata ${candidate.firstName} ${candidate.lastName} među aktivne?`
    );

    if (!confirmed) return;

    try {
      setError("");
      await restoreAdminCandidate(token, candidate.publicId);
      await loadCandidates();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Greška pri vraćanju kandidata."
      );
    }
  };

  const handleExport = async () => {
    if (!token) return;

    try {
      setIsExporting(true);
      setError("");

      await exportAdminArchivedCandidates(token, {
        email,
        search,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Greška pri exportu arhiviranih kandidata."
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <section className="admin-page">
      <div className="admin-page__header admin-page__header--row">
        <div>
          <h2>Archived Candidates</h2>
          <p>Pregled arhiviranih kandidata koji trenutno nisu u aktivnom fokusu.</p>
        </div>

        <div className="admin-page__actions">
          <Link
            to="/admin/candidates"
            className="admin-button admin-button--ghost"
          >
            Active candidates
          </Link>

          <button
            type="button"
            className="admin-button admin-button--primary"
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? "Exporting..." : "Export to Excel"}
          </button>
        </div>
      </div>

      <div className="admin-panel admin-filters-row">
        <input
          className="admin-input"
          placeholder="Filter po email-u"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="admin-input"
          placeholder="Pretraga po imenu, email-u ili publicId"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          type="button"
          className="admin-button admin-button--primary"
          onClick={loadCandidates}
        >
          Primeni filtere
        </button>
      </div>

      {error && <p className="admin-form-error">{error}</p>}

      <div className="admin-panel admin-table-wrapper">
        {isLoading ? (
          <p>Učitavanje arhiviranih kandidata...</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Public ID</th>
                <th>Ime i prezime</th>
                <th>Email</th>
                <th>Telefon</th>
                <th>Država</th>
                <th>Grad</th>
                <th>Arhivirano</th>
                <th>Razlog</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {candidates.map((candidate) => (
                <tr key={candidate._id}>
                  <td>{candidate.publicId}</td>
                  <td>
                    {candidate.firstName} {candidate.lastName}
                  </td>
                  <td>{candidate.email}</td>
                  <td>{candidate.phone || "-"}</td>
                  <td>{candidate.country || "-"}</td>
                  <td>{candidate.city || "-"}</td>
                  <td>
                    {candidate.archivedAt
                      ? new Date(candidate.archivedAt).toLocaleString("sr-RS")
                      : "-"}
                  </td>
                  <td>{candidate.archivedReason || "-"}</td>
                  <td>
                    <div className="admin-inline-actions">
                      <Link
                        to={`/admin/candidates/${candidate.publicId}`}
                        className="admin-button admin-button--ghost"
                      >
                        Details
                      </Link>

                      <button
                        type="button"
                        className="admin-button admin-button--primary"
                        onClick={() => handleRestoreCandidate(candidate)}
                      >
                        Restore
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!candidates.length && (
                <tr>
                  <td colSpan={9}>Nema pronađenih arhiviranih kandidata.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
};

export default AdminArchivedCandidatesPage;