import { useEffect, useState } from "react";
import { useAdminAuth } from "../context/AdminAuthContext";
import {
  deleteJobTranslation,
  getJobTranslationsOverview,
  getTranslationJobs,
  saveJobTranslation,
} from "../api/adminTranslationsApi";
import type {
  AdminTranslation,
  JobTranslationsOverviewResponse,
  TranslationJobListItem,
} from "../types/admin";

const emptyTranslation = (locale: string): Partial<AdminTranslation> => ({
  locale,
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
});

const AdminTranslationsPage = () => {
  const { token } = useAdminAuth();

  const [jobs, setJobs] = useState<TranslationJobListItem[]>([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [selectedLocale, setSelectedLocale] = useState("sr");
  const [overview, setOverview] = useState<JobTranslationsOverviewResponse | null>(null);
  const [form, setForm] = useState<Partial<AdminTranslation>>(emptyTranslation("sr"));
  const [error, setError] = useState("");

  useEffect(() => {
    const loadJobs = async () => {
      if (!token) return;

      try {
        const data = await getTranslationJobs(token, selectedLocale);
        setJobs(data.jobs);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Greška pri dohvatanju liste poslova."
        );
      }
    };

    loadJobs();
  }, [token, selectedLocale]);

  const loadOverview = async () => {
    if (!token || !selectedJobId) return;

    try {
      const data = await getJobTranslationsOverview(token, selectedJobId);
      setOverview(data);

      const translation = data.translations.find(
        (t) => t.locale === selectedLocale
      );

      setForm(translation || emptyTranslation(selectedLocale));
      setError("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Greška pri dohvatanju prevoda."
      );
    }
  };

  return (
    <section className="admin-page">
      <div className="admin-page__header">
        <h2>Translations</h2>
        <p>Upravljanje prevodima po poslu i locale-u.</p>
      </div>

      <div className="admin-panel admin-filters-row">
        <select
          className="admin-input"
          value={selectedJobId}
          onChange={(e) => setSelectedJobId(e.target.value)}
        >
          <option value="">Select job</option>
          {jobs.map((job) => (
            <option key={job.publicId} value={job.publicId}>
              {job.publicId} — {job.name}
            </option>
          ))}
        </select>

        <select
          className="admin-input"
          value={selectedLocale}
          onChange={(e) => setSelectedLocale(e.target.value)}
        >
          {["sr", "en", "de-DACH", "hr", "pl", "cs", "it", "fr", "uk", "ru", "be", "sl"].map(
            (locale) => (
              <option key={locale} value={locale}>
                {locale}
              </option>
            )
          )}
        </select>

        <button
          type="button"
          className="admin-button admin-button--primary"
          onClick={loadOverview}
        >
          Load
        </button>
      </div>

      {overview && (
        <div className="admin-two-col">
          <div className="admin-panel">
            <h3>Available translations</h3>
            <ul className="admin-list">
              {overview.translations.map((item) => (
                <li key={item.locale}>
                  {item.locale} — {item.name}
                </li>
              ))}
            </ul>
          </div>

          <div className="admin-panel">
            <h3>Edit translation</h3>

            <input
              className="admin-input"
              value={form.name || ""}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Name"
            />

            <input
              className="admin-input"
              value={form.locationLabel || ""}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, locationLabel: e.target.value }))
              }
              placeholder="Location label"
            />

            <textarea
              className="admin-input admin-input--textarea"
              value={form.shortDescription || ""}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  shortDescription: e.target.value,
                }))
              }
              placeholder="Short description"
            />

            <input
              className="admin-input"
              value={form.applyLabel || "Apply"}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, applyLabel: e.target.value }))
              }
              placeholder="Apply label"
            />

            <textarea
              className="admin-input admin-input--textarea"
              value={form.notes || ""}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, notes: e.target.value }))
              }
              placeholder="Notes"
            />

            <div className="admin-inline-actions admin-mt">
              <button
                type="button"
                className="admin-button admin-button--primary"
                onClick={async () => {
                  if (!token || !selectedJobId) return;

                  await saveJobTranslation(token, selectedJobId, {
                    ...form,
                    locale: selectedLocale,
                  });

                  await loadOverview();
                }}
              >
                Save translation
              </button>

              <button
                type="button"
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