import { useEffect, useState } from "react";
import { useAdminAuth } from "../context/AdminAuthContext";
import {
  createPresence,
  deletePresence,
  getPresences,
  updatePresence,
} from "../api/adminPresencesApi";
import { getCompanies } from "../api/adminCompaniesApi";
import { getRegions } from "../api/adminRegionsApi";
import type { Company, Presence, Region } from "../types/admin";

const emptyForm = {
  company: "",
  region: "",
  isActive: true,
};

const AdminPresencesPage = () => {
  const { token } = useAdminAuth();

  const [presences, setPresences] = useState<Presence[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadAll = async () => {
    if (!token) return;

    try {
      setError("");

      const [presencesData, companiesData, regionsData] = await Promise.all([
        getPresences(token),
        getCompanies(token),
        getRegions(token),
      ]);

      setPresences(presencesData);
      setCompanies(companiesData);
      setRegions(regionsData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Greška pri dohvatanju presences."
      );
    }
  };

  useEffect(() => {
    loadAll();
  }, [token]);

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      setIsSubmitting(true);
      setError("");

      if (editingId) {
        await updatePresence(token, editingId, form);
      } else {
        await createPresence(token, form);
      }

      resetForm();
      await loadAll();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Greška pri čuvanju presence zapisa."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="admin-page">
      <div className="admin-page__header">
        <h2>Presences</h2>
        <p>Povezivanje kompanija i regiona u kojima su prisutne.</p>
      </div>

      <div className="admin-two-col">
        <div className="admin-panel">
          <h3>{editingId ? "Izmeni presence" : "Novi presence"}</h3>

          <form onSubmit={handleSubmit}>
            <label className="admin-form-field">
              <span>Company</span>
              <select
                className="admin-input"
                value={form.company}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, company: e.target.value }))
                }
              >
                <option value="">Select company</option>
                {companies.map((company) => (
                  <option key={company._id} value={company._id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="admin-form-field">
              <span>Region</span>
              <select
                className="admin-input"
                value={form.region}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, region: e.target.value }))
                }
              >
                <option value="">Select region</option>
                {regions.map((region) => (
                  <option key={region._id} value={region._id}>
                    {region.name} ({region.type})
                  </option>
                ))}
              </select>
            </label>

            <label className="admin-form-field">
              <span>Aktivan</span>
              <select
                className="admin-input"
                value={String(form.isActive)}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    isActive: e.target.value === "true",
                  }))
                }
              >
                <option value="true">Da</option>
                <option value="false">Ne</option>
              </select>
            </label>

            {error && <p className="admin-form-error">{error}</p>}

            <div className="admin-inline-actions">
              {editingId && (
                <button
                  type="button"
                  className="admin-button admin-button--ghost"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}

              <button
                type="submit"
                className="admin-button admin-button--primary"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Saving..."
                  : editingId
                  ? "Update presence"
                  : "Create presence"}
              </button>
            </div>
          </form>
        </div>

        <div className="admin-panel admin-table-wrapper">
          <h3>Lista presence zapisa</h3>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Region</th>
                <th>Type</th>
                <th>Aktivan</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {presences.map((presence) => (
                <tr key={presence._id}>
                  <td>{presence.company?.name || "-"}</td>
                  <td>{presence.region?.name || "-"}</td>
                  <td>{presence.region?.type || "-"}</td>
                  <td>{presence.isActive ? "Da" : "Ne"}</td>
                  <td>
                    <div className="admin-inline-actions">
                      <button
                        type="button"
                        className="admin-button admin-button--ghost"
                        onClick={() => {
                          setEditingId(presence._id);
                          setForm({
                            company: presence.company?._id || "",
                            region: presence.region?._id || "",
                            isActive: presence.isActive,
                          });
                        }}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="admin-button admin-button--danger"
                        onClick={async () => {
                          if (!token) return;

                          const confirmed = window.confirm(
                            "Obrisati presence zapis?"
                          );
                          if (!confirmed) return;

                          await deletePresence(token, presence._id);
                          await loadAll();
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!presences.length && (
                <tr>
                  <td colSpan={5}>Nema presence zapisa.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default AdminPresencesPage;