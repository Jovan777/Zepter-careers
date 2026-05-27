import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import {
  createAdminJob,
  getAdminJobById,
  importAdminJobPdf,
  updateAdminJob,
} from "../api/adminJobsApi";
import { getCompanies } from "../api/adminCompaniesApi";
import { getRegions } from "../api/adminRegionsApi";
import type { AdminJobPdfImportResponse, Company, Region } from "../types/admin";

type Props = {
  mode: "create" | "edit";
};

const listToTextarea = (value: string[] | undefined) => (value || []).join("\n");
const hasText = (value: string) => value.trim().length > 0;

const translationFieldKeys = [
  "name",
  "locationLabel",
  "shortDescription",
  "intro",
  "whyThisPosition",
  "aboutZepter",
  "qualifications",
  "responsibilities",
  "requirements",
  "whatZepterOffers",
  "howToApply",
  "closingText",
  "footerNote",
  "applyLabel",
] as const;

const AdminJobEditorPage = ({ mode }: Props) => {
  const { token } = useAdminAuth();
  const { publicId } = useParams();
  const navigate = useNavigate();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isImportingPdf, setIsImportingPdf] = useState(false);
  const [pdfImportError, setPdfImportError] = useState("");
  const [pdfImportSuccess, setPdfImportSuccess] = useState("");
  const [rawTextPreview, setRawTextPreview] = useState("");

  const [form, setForm] = useState({
    publicId: "",
    company: "",
    region: "",
    status: "draft",
    publishStartAt: "",
    publishEndAt: "",
    notes: "",
    workArea: "",
    employmentType: "",
    locationType: "onsite",
    qrTargetUrl: "",
    qrTrackingEnabled: true,
    locale: "sr",
    name: "",
    locationLabel: "",
    shortDescription: "",
    intro: "",
    whyThisPosition: "",
    aboutZepter: "",
    qualifications: "",
    responsibilities: "",
    requirements: "",
    whatZepterOffers: "",
    howToApply: "",
    closingText: "",
    footerNote: "",
    applyLabel: "Apply",
  });

  useEffect(() => {
    const loadMeta = async () => {
      if (!token) return;
      const [companiesData, regionsData] = await Promise.all([
        getCompanies(token),
        getRegions(token),
      ]);
      setCompanies(companiesData);
      setRegions(regionsData);
    };

    loadMeta();
  }, [token]);

  useEffect(() => {
    if (mode !== "edit" || !token || !publicId) return;

    const loadJob = async () => {
      try {
        const data = await getAdminJobById(token, publicId, form.locale);
        setForm((prev) => ({
          ...prev,
          publicId: data.job.publicId,
          company: data.job.company?._id || "",
          region: data.job.region?._id || "",
          status: data.job.status || "draft",
          publishStartAt: data.job.publishStartAt ? data.job.publishStartAt.slice(0, 16) : "",
          publishEndAt: data.job.publishEndAt ? data.job.publishEndAt.slice(0, 16) : "",
          notes: data.job.notes || "",
          workArea: data.job.workArea || "",
          employmentType: data.job.employmentType || "",
          locationType: data.job.locationType || "onsite",
          qrTargetUrl: data.job.qr?.targetUrl || data.job.qrTargetUrl || "",
          qrTrackingEnabled:
            data.job.qr?.isEnabled ?? data.job.qrTrackingEnabled ?? true,
          name: data.activeTranslation?.name || "",
          locationLabel: data.activeTranslation?.locationLabel || "",
          shortDescription: data.activeTranslation?.shortDescription || "",
          intro: listToTextarea(data.activeTranslation?.intro),
          whyThisPosition: data.activeTranslation?.whyThisPosition || "",
          aboutZepter: data.activeTranslation?.aboutZepter || "",
          qualifications: listToTextarea(data.activeTranslation?.qualifications),
          responsibilities: listToTextarea(data.activeTranslation?.responsibilities),
          requirements: listToTextarea(data.activeTranslation?.requirements),
          whatZepterOffers: listToTextarea(data.activeTranslation?.whatZepterOffers),
          howToApply: listToTextarea(data.activeTranslation?.howToApply),
          closingText: data.activeTranslation?.closingText || "",
          footerNote: data.activeTranslation?.footerNote || "",
          applyLabel: data.activeTranslation?.applyLabel || "Apply",
        }));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Greška pri dohvatanju job detalja.");
      }
    };

    loadJob();
  }, [mode, token, publicId, form.locale]);

  const payload = useMemo(
    () => ({
      publicId: form.publicId,
      company: form.company,
      region: form.region,
      status: form.status,
      publishStartAt: form.publishStartAt || null,
      publishEndAt: form.publishEndAt || null,
      notes: form.notes,
      workArea: form.workArea,
      employmentType: form.employmentType,
      locationType: form.locationType,
      qrTargetUrl: form.qrTargetUrl,
      qrTrackingEnabled: form.qrTrackingEnabled,
      locale: form.locale,
      name: form.name,
      locationLabel: form.locationLabel,
      shortDescription: form.shortDescription,
      intro: form.intro,
      whyThisPosition: form.whyThisPosition,
      aboutZepter: form.aboutZepter,
      qualifications: form.qualifications,
      responsibilities: form.responsibilities,
      requirements: form.requirements,
      whatZepterOffers: form.whatZepterOffers,
      howToApply: form.howToApply,
      closingText: form.closingText,
      footerNote: form.footerNote,
      applyLabel: form.applyLabel,
    }),
    [form]
  );

  const applyPdfImport = (data: AdminJobPdfImportResponse) => {
    const parsed = data.parsed || {};

    setForm((prev) => ({
      ...prev,
      locale: parsed.locale?.trim() || prev.locale,
      name: parsed.name?.trim() || prev.name,
      locationLabel: parsed.locationLabel?.trim() || prev.locationLabel,
      shortDescription: parsed.shortDescription?.trim() || prev.shortDescription,
      intro: parsed.intro?.length ? listToTextarea(parsed.intro) : prev.intro,
      whyThisPosition: parsed.whyThisPosition?.trim() || prev.whyThisPosition,
      aboutZepter: parsed.aboutZepter?.trim() || prev.aboutZepter,
      qualifications: parsed.qualifications?.length
        ? listToTextarea(parsed.qualifications)
        : prev.qualifications,
      responsibilities: parsed.responsibilities?.length
        ? listToTextarea(parsed.responsibilities)
        : prev.responsibilities,
      requirements: parsed.requirements?.length
        ? listToTextarea(parsed.requirements)
        : prev.requirements,
      whatZepterOffers: parsed.whatZepterOffers?.length
        ? listToTextarea(parsed.whatZepterOffers)
        : prev.whatZepterOffers,
      howToApply: parsed.howToApply?.length
        ? listToTextarea(parsed.howToApply)
        : prev.howToApply,
      closingText: parsed.closingText?.trim() || prev.closingText,
      footerNote: parsed.footerNote?.trim() || prev.footerNote,
      applyLabel: parsed.applyLabel?.trim() || prev.applyLabel,
    }));
  };

  const importPdf = async () => {
    if (!token) return;

    setPdfImportError("");
    setPdfImportSuccess("");
    setRawTextPreview("");

    if (!pdfFile) {
      setPdfImportError("Please select a PDF file first.");
      return;
    }

    if (pdfFile.type !== "application/pdf" && !pdfFile.name.toLowerCase().endsWith(".pdf")) {
      setPdfImportError("Only PDF files are supported.");
      return;
    }

    const hasExistingTranslationText = translationFieldKeys.some((key) =>
      hasText(form[key])
    );

    if (
      hasExistingTranslationText &&
      !window.confirm("Importing this PDF will overwrite current translation fields. Continue?")
    ) {
      return;
    }

    try {
      setIsImportingPdf(true);
      const data = await importAdminJobPdf(token, pdfFile);
      applyPdfImport(data);
      setRawTextPreview(data.rawTextPreview || "");
      setPdfImportSuccess("PDF parsed successfully. Please review the fields before saving.");
    } catch (err) {
      setPdfImportError(err instanceof Error ? err.message : "PDF import failed.");
    } finally {
      setIsImportingPdf(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      setIsSubmitting(true);
      setError("");

      if (mode === "create") {
        await createAdminJob(token, payload);
      } else if (publicId) {
        await updateAdminJob(token, publicId, payload);
      }

      navigate("/admin/jobs");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Greška pri čuvanju job-a.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="admin-page">
      <div className="admin-page__header">
        <h2>{mode === "create" ? "Create job" : `Edit job ${publicId}`}</h2>
        <p>Osnovni podaci i aktivni prevod za izabrani locale.</p>
      </div>

      <div className="admin-panel admin-job-pdf-import">
        <h3>Import from PDF</h3>

        <div className="admin-form-field">
          <span>PDF job advertisement</span>
          <div className="admin-pdf-upload-row">
            <input
              id="job-pdf-upload"
              type="file"
              className="admin-pdf-upload-input"
              accept="application/pdf,.pdf"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setPdfFile(file);
                setPdfImportError("");
                setPdfImportSuccess("");
                setRawTextPreview("");
              }}
            />

            <label htmlFor="job-pdf-upload" className="admin-pdf-upload-button">
              <span className="admin-pdf-upload-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <path d="M6 2h8l4 4v16H6z" />
                  <path d="M14 2v5h5" />
                  <path d="M8 15h8" />
                  <path d="M8 18h5" />
                </svg>
              </span>
              <span>{pdfFile ? "Change PDF" : "Choose PDF"}</span>
            </label>

            <div className="admin-pdf-upload-meta">
              {pdfFile ? (
                <span className="admin-pdf-upload-filename">{pdfFile.name}</span>
              ) : (
                <span className="admin-pdf-upload-placeholder">No PDF selected</span>
              )}
            </div>
          </div>
        </div>

        <div className="admin-inline-actions">
          <button
            type="button"
            className="admin-button admin-button--primary"
            onClick={importPdf}
            disabled={isImportingPdf}
          >
            {isImportingPdf ? "Importing..." : "Import PDF"}
          </button>
        </div>

        {pdfImportError && <p className="admin-form-error">{pdfImportError}</p>}
        {pdfImportSuccess && <p className="admin-form-success">{pdfImportSuccess}</p>}

        {rawTextPreview && (
          <details className="admin-job-pdf-import__preview">
            <summary>Raw text preview</summary>
            <textarea
              className="admin-input admin-input--textarea"
              value={rawTextPreview}
              readOnly
            />
          </details>
        )}
      </div>

      <form className="admin-form-grid" onSubmit={submit}>
        <div className="admin-panel">
          <h3>Job data</h3>

          <label className="admin-form-field">
            <span>Public ID</span>
            <input
              className="admin-input"
              value={form.publicId}
              placeholder="If empty, it will be generated automatically"
              onChange={(e) => setForm({ ...form, publicId: e.target.value })}
            />
            {mode === "create" && (
              <small className="admin-form-hint">
                Leave empty to automatically use the next available Public ID.
              </small>
            )}
          </label>

          <label className="admin-form-field">
            <span>Company</span>
            <select className="admin-input" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}>
              <option value="">Select company</option>
              {companies.map((company) => (
                <option key={company._id} value={company._id}>{company.name}</option>
              ))}
            </select>
          </label>

          <label className="admin-form-field">
            <span>Region</span>
            <select className="admin-input" value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })}>
              <option value="">Select region</option>
              {regions.map((region) => (
                <option key={region._id} value={region._id}>{region.name}</option>
              ))}
            </select>
          </label>

          <label className="admin-form-field">
            <span>Status</span>
            <select className="admin-input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="draft">draft</option>
              <option value="published">published</option>
              <option value="closed">closed</option>
            </select>
          </label>

          <label className="admin-form-field">
            <span>Work area</span>
            <input className="admin-input" value={form.workArea} onChange={(e) => setForm({ ...form, workArea: e.target.value })} />
          </label>

          <label className="admin-form-field">
            <span>Employment type</span>
            <select className="admin-input" value={form.employmentType} onChange={(e) => setForm({ ...form, employmentType: e.target.value })}>
              <option value="">-</option>
              <option value="full_time">full_time</option>
              <option value="part_time">part_time</option>
              <option value="contract">contract</option>
              <option value="internship">internship</option>
              <option value="temporary">temporary</option>
            </select>
          </label>

          <label className="admin-form-field">
            <span>Location type</span>
            <select className="admin-input" value={form.locationType} onChange={(e) => setForm({ ...form, locationType: e.target.value })}>
              <option value="onsite">onsite</option>
              <option value="remote">remote</option>
              <option value="hybrid">hybrid</option>
            </select>
          </label>

          <h3>QR / Tracking</h3>

          <label className="admin-form-field">
            <span>QR tracking enabled</span>
            <input type="checkbox" checked={form.qrTrackingEnabled} onChange={(e) => setForm({ ...form, qrTrackingEnabled: e.target.checked })} />
          </label>

          <label className="admin-form-field">
            <span>QR target URL</span>
            <input className="admin-input" value={form.qrTargetUrl} onChange={(e) => setForm({ ...form, qrTargetUrl: e.target.value })} />
          </label>

          <label className="admin-form-field">
            <span>Publish start</span>
            <input type="datetime-local" className="admin-input" value={form.publishStartAt} onChange={(e) => setForm({ ...form, publishStartAt: e.target.value })} />
          </label>

          <label className="admin-form-field">
            <span>Publish end</span>
            <input type="datetime-local" className="admin-input" value={form.publishEndAt} onChange={(e) => setForm({ ...form, publishEndAt: e.target.value })} />
          </label>

          <label className="admin-form-field">
            <span>Notes</span>
            <textarea className="admin-input admin-input--textarea" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </label>
        </div>

        <div className="admin-panel">
          <h3>Translation</h3>

          <label className="admin-form-field">
            <span>Locale</span>
            <select className="admin-input" value={form.locale} onChange={(e) => setForm({ ...form, locale: e.target.value })}>
              <option value="sr">sr</option>
              <option value="en">en</option>
              <option value="de-DACH">de-DACH</option>
              <option value="hr">hr</option>
              <option value="pl">pl</option>
              <option value="cs">cs</option>
              <option value="it">it</option>
              <option value="fr">fr</option>
              <option value="uk">uk</option>
              <option value="ru">ru</option>
              <option value="be">be</option>
              <option value="sl">sl</option>
            </select>
          </label>

          <label className="admin-form-field"><span>Name</span><input className="admin-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
          <label className="admin-form-field"><span>Location label</span><input className="admin-input" value={form.locationLabel} onChange={(e) => setForm({ ...form, locationLabel: e.target.value })} /></label>
          <label className="admin-form-field"><span>Short description</span><textarea className="admin-input admin-input--textarea" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} /></label>
          <label className="admin-form-field"><span>Intro (one line = one paragraph)</span><textarea className="admin-input admin-input--textarea" value={form.intro} onChange={(e) => setForm({ ...form, intro: e.target.value })} /></label>
          <label className="admin-form-field"><span>Why this position</span><textarea className="admin-input admin-input--textarea" value={form.whyThisPosition} onChange={(e) => setForm({ ...form, whyThisPosition: e.target.value })} /></label>
          <label className="admin-form-field"><span>About Zepter</span><textarea className="admin-input admin-input--textarea" value={form.aboutZepter} onChange={(e) => setForm({ ...form, aboutZepter: e.target.value })} /></label>
          <label className="admin-form-field"><span>Qualifications</span><textarea className="admin-input admin-input--textarea" value={form.qualifications} onChange={(e) => setForm({ ...form, qualifications: e.target.value })} /></label>
          <label className="admin-form-field"><span>Responsibilities</span><textarea className="admin-input admin-input--textarea" value={form.responsibilities} onChange={(e) => setForm({ ...form, responsibilities: e.target.value })} /></label>
          <label className="admin-form-field"><span>Requirements</span><textarea className="admin-input admin-input--textarea" value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} /></label>
          <label className="admin-form-field"><span>What Zepter offers</span><textarea className="admin-input admin-input--textarea" value={form.whatZepterOffers} onChange={(e) => setForm({ ...form, whatZepterOffers: e.target.value })} /></label>
          <label className="admin-form-field"><span>How to apply (one line = one item)</span><textarea className="admin-input admin-input--textarea" value={form.howToApply} onChange={(e) => setForm({ ...form, howToApply: e.target.value })} /></label>
          <label className="admin-form-field"><span>Closing text</span><textarea className="admin-input admin-input--textarea" value={form.closingText} onChange={(e) => setForm({ ...form, closingText: e.target.value })} /></label>
          <label className="admin-form-field"><span>Footer note</span><textarea className="admin-input admin-input--textarea" value={form.footerNote} onChange={(e) => setForm({ ...form, footerNote: e.target.value })} /></label>
          <label className="admin-form-field"><span>Apply label</span><input className="admin-input" value={form.applyLabel} onChange={(e) => setForm({ ...form, applyLabel: e.target.value })} /></label>
        </div>

        {error && <p className="admin-form-error admin-form-error--full">{error}</p>}

        <div className="admin-form-actions">
          <button type="button" className="admin-button admin-button--ghost" onClick={() => navigate("/admin/jobs")}>Cancel</button>
          <button type="submit" className="admin-button admin-button--primary" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save job"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AdminJobEditorPage;
