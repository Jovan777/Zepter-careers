import { useEffect, useState } from "react";
import { useAdminAuth } from "../context/AdminAuthContext";
import {
  createCompany,
  deleteCompany,
  getCompanies,
  updateCompany,
} from "../api/adminCompaniesApi";
import type { Company } from "../types/admin";

const emptyForm = {
  name: "",
  legalEntity: "",
  isActive: true,
};

const AdminCompaniesPage = () => {
  const { token } = useAdminAuth();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadCompanies = async () => {
    if (!token) return;

    try {
      setError("");
      const data = await getCompanies(token);
      setCompanies(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Greška pri dohvatanju kompanija."
      );
    }
  };

  useEffect(() => {
    loadCompanies();
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
        await updateCompany(token, editingId, form);
      } else {
        await createCompany(token, form);
      }

      resetForm();
      await loadCompanies();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Greška pri čuvanju kompanije."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="admin-page">
      <div className="admin-page__header">
        <h2>Companies</h2>
        <p>Kreiranje i izmena kompanija koje se koriste u admin sistemu.</p>
      </div>

      <div className="admin-two-col">
        <div className="admin-panel">
          <h3>{editingId ? "Izmeni kompaniju" : "Nova kompanija"}</h3>

          <form onSubmit={handleSubmit}>
            <label className="admin-form-field">
              <span>Name</span>
              <input
                className="admin-input"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </label>

            <label className="admin-form-field">
              <span>Legal entity</span>
              <input
                className="admin-input"
                value={form.legalEntity}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    legalEntity: e.target.value,
                  }))
                }
              />
            </label>

            <label className="admin-form-field">
              <span>Aktivna</span>
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
                  ? "Update company"
                  : "Create company"}
              </button>
            </div>
          </form>
        </div>

        <div className="admin-panel admin-table-wrapper">
          <h3>Lista kompanija</h3>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Legal entity</th>
                <th>Aktivna</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr key={company._id}>
                  <td>{company.name}</td>
                  <td>{company.legalEntity || "-"}</td>
                  <td>{company.isActive ? "Da" : "Ne"}</td>
                  <td>
                    <div className="admin-inline-actions">
                      <button
                        type="button"
                        className="admin-button admin-button--ghost"
                        onClick={() => {
                          setEditingId(company._id);
                          setForm({
                            name: company.name,
                            legalEntity: company.legalEntity || "",
                            isActive: company.isActive,
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
                            `Obrisati kompaniju "${company.name}"?`
                          );
                          if (!confirmed) return;

                          await deleteCompany(token, company._id);
                          await loadCompanies();
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!companies.length && (
                <tr>
                  <td colSpan={4}>Nema kompanija.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default AdminCompaniesPage;