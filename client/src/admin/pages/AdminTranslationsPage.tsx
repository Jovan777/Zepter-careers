import { useEffect, useState } from "react";
import { useAdminAuth } from "../context/AdminAuthContext";
import {
  copyJobTranslation,
  deleteJobTranslation,
  getJobTranslationsOverview,
  getTranslationJobs,
  saveJobTranslation,
  updateJobTranslation,
} from "../api/adminTranslationsApi";

const AdminTranslationsPage = () => {
  const { token } = useAdminAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [selectedLocale, setSelectedLocale] = useState("sr");
  const [overview, setOverview] = useState<any>(null);
  const [form, setForm] = useState<any>({ name: "", shortDescription: "", applyLabel: "Apply" });
  const [error, setError] = useState("");

  useEffect(() => {
    const loadJobs = async () => {
      if (!token) return;
      const data = await getTranslationJobs(token, selectedLocale);
      setJobs(data.jobs);
    };
    loadJobs();
  }, [token, selectedLocale]);

  const loadOverview = async () => {
    if (!token || !selectedJobId) return;
    try {
      const data = await getJobTranslationsOverview(token, selectedJobId);
      setOverview(data);
      const translation = data.translations.find((t: any) => t.locale === selectedLocale);
      setForm(
        translation || {
          locale: selectedLocale,
          name: "",
          locationLabel: "",
          shortDescription: "",
          intro: [],
          whyThisPosition: "",
          aboutZepter: "",
          qualifications: [],
          responsibilities: [],
          requirements: [],
          whatZepterOffers: [],
          applyLabel: "Apply",
          notes: "",
        }
      );
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Greška pri dohvatanju prevoda.");
    }
  };

  return (
    <section className="admin-page">
      <div className="admin-page__header">
        <h2>Translations</h2>
        <p>Upravljanje prevodima po poslu i locale-u.</p>
      </div>

      <div className="admin-panel admin-filters-row">
        <select className="admin-input" value={selectedJobId} onChange={(e) => setSelectedJobId(e.target.value)}>
          <option value="">Select job</option>
          {jobs.map((job) => (
            <option key={job.publicId} value={job.publicId}>{job.publicId} — {job.name}</option>
          ))}
        </select>

        <select className="admin-input" value={selectedLocale} onChange={(e) => setSelectedLocale(e.target.value)}>
          {["sr", "en", "de-DACH", "hr", "pl", "cs", "it", "fr", "uk", "ru", "be", "sl"].map((locale) => (
            <option key={locale} value={locale}>{locale}</option>
          ))}
        </select>

        <button className="admin-button admin-button--primary" onClick={loadOverview}>Load</button>
      </div>

      {overview && (
        <div className="admin-two-col">
          <div className="admin-panel">
            <h3>Available translations</h3>
            <ul className="admin-list">
              {overview.translations.map((item: any) => (
                <li key={item.locale}>{item.locale} — {item.name}</li>
              ))}
            </ul>
          </div>

          <div className="admin-panel">
            <h3>Edit translation</h3>
            <input className="admin-input" value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" />
            <input className="admin-input" value={form.locationLabel || ""} onChange={(e) => setForm({ ...form, locationLabel: e.target.value })} placeholder="Location label" />
            <textarea className="admin-input admin-input--textarea" value={form.shortDescription || ""} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} placeholder="Short description" />
            <input className="admin-input" value={form.applyLabel || "Apply"} onChange={(e) => setForm({ ...form, applyLabel: e.target.value })} placeholder="Apply label" />
            <textarea className="admin-input admin-input--textarea" value={form.notes || ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Notes" />

            <div className="admin-inline-actions admin-mt">
              <button
                className="admin-button admin-button--primary"
                onClick={async () => {
                  if (!token || !selectedJobId) return;
                  await saveJobTranslation(token, selectedJobId, { ...form, locale: selectedLocale });
                  await loadOverview();
                }}
              >
                Save translation
              </button>

              <button
                className="admin-button admin-button--danger"
                onClick={async () => {
                  if (!token || !selectedJobId) return;
                  await deleteJobTranslation(token, selectedJobId, selectedLocale);
                  await loadOverview();
                }}
              >
                Delete translation
              </button>
            </div>
          </div>
        </div>
      )}

      {error && <p className="admin-form-error">{error}</p>}
    </section>
  );
};

export default AdminTranslationsPage;