import { useEffect, useState } from "react";
import { useAdminAuth } from "../context/AdminAuthContext";
import {
  createRegion,
  deleteRegion,
  getRegions,
  updateRegion,
} from "../api/adminRegionsApi";
import type { Region } from "../types/admin";

const emptyForm = {
  type: "country",
  name: "",
  isoCode: "",
  parentRegion: "",
  isActive: true,
};

const AdminRegionsPage = () => {
  const { token } = useAdminAuth();

  const [regions, setRegions] = useState<Region[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadRegions = async () => {
    if (!token) return;

    try {
      setError("");
      const data = await getRegions(token);
      setRegions(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Greška pri dohvatanju regiona."
      );
    }
  };

  useEffect(() => {
    loadRegions();
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

      const payload = {
        ...form,
        parentRegion: form.parentRegion || null,
      };

      if (editingId) {
        await updateRegion(token, editingId, payload);
      } else {
        await createRegion(token, payload);
      }

      resetForm();
      await loadRegions();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Greška pri čuvanju regiona."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="admin-page">
      <div className="admin-page__header">
        <h2>Regions</h2>
        <p>Upravljanje državama, regionima i gradovima.</p>
      </div>

      <div className="admin-two-col">
        <div className="admin-panel">
          <h3>{editingId ? "Izmeni region" : "Novi region"}</h3>

          <form onSubmit={handleSubmit}>
            <label className="admin-form-field">
              <span>Type</span>
              <select
                className="admin-input"
                value={form.type}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, type: e.target.value }))
                }
              >
                <option value="country">country</option>
                <option value="region">region</option>
                <option value="city">city</option>
              </select>
            </label>

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
              <span>ISO code</span>
              <input
                className="admin-input"
                value={form.isoCode}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, isoCode: e.target.value }))
                }
              />
            </label>

            <label className="admin-form-field">
              <span>Parent region</span>
              <select
                className="admin-input"
                value={form.parentRegion}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    parentRegion: e.target.value,
                  }))
                }
              >
                <option value="">No parent</option>
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
                  ? "Update region"
                  : "Create region"}
              </button>
            </div>
          </form>
        </div>

        <div className="admin-panel admin-table-wrapper">
          <h3>Lista regiona</h3>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>ISO</th>
                <th>Parent</th>
                <th>Aktivan</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {regions.map((region) => (
                <tr key={region._id}>
                  <td>{region.name}</td>
                  <td>{region.type}</td>
                  <td>{region.isoCode || "-"}</td>
                  <td>{region.parentRegion?.name || "-"}</td>
                  <td>{region.isActive ? "Da" : "Ne"}</td>
                  <td>
                    <div className="admin-inline-actions">
                      <button
                        type="button"
                        className="admin-button admin-button--ghost"
                        onClick={() => {
                          setEditingId(region._id);
                          setForm({
                            type: region.type,
                            name: region.name,
                            isoCode: region.isoCode || "",
                            parentRegion: region.parentRegion?._id || "",
                            isActive: region.isActive,
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
                            `Obrisati region "${region.name}"?`
                          );
                          if (!confirmed) return;

                          await deleteRegion(token, region._id);
                          await loadRegions();
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!regions.length && (
                <tr>
                  <td colSpan={6}>Nema regiona.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default AdminRegionsPage;