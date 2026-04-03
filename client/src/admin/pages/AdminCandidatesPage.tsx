import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import { getAdminCandidates } from "../api/adminCandidatesApi";
import type { AdminCandidate } from "../types/admin";

const AdminCandidatesPage = () => {
  const { token } = useAdminAuth();

  const [candidates, setCandidates] = useState<AdminCandidate[]>([]);
  const [email, setEmail] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const loadCandidates = async () => {
    if (!token) return;

    try {
      setIsLoading(true);
      setError("");

      const data = await getAdminCandidates(token, {
        email,
        search,
      });

      setCandidates(data.candidates);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Greška pri dohvatanju kandidata."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCandidates();
  }, [token]);

  return (
    <section className="admin-page">
      <div className="admin-page__header">
        <h2>Candidates</h2>
        <p>Pregled svih kandidata i njihovih osnovnih podataka.</p>
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
          <p>Učitavanje kandidata...</p>
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
                <th></th>
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
                    <Link
                      to={`/admin/candidates/${candidate.publicId}`}
                      className="admin-button admin-button--ghost"
                    >
                      Details
                    </Link>
                  </td>
                </tr>
              ))}

              {!candidates.length && (
                <tr>
                  <td colSpan={7}>Nema pronađenih kandidata.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
};

export default AdminCandidatesPage;