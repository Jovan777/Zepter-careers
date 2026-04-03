import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import { createAdminJob, getAdminJobById, updateAdminJob } from "../api/adminJobsApi";
import { getCompanies } from "../api/adminCompaniesApi";
import { getRegions } from "../api/adminRegionsApi";
import type { Company, Region } from "../types/admin";

type Props = {
  mode: "create" | "edit";
};

const listToTextarea = (value: string[] | undefined) => (value || []).join("\n");

const AdminJobEditorPage = ({ mode }: Props) => {
  const { token } = useAdminAuth();
  const { publicId } = useParams();
  const navigate = useNavigate();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      applyLabel: form.applyLabel,
    }),
    [form]
  );

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

      <form className="admin-form-grid" onSubmit={submit}>
        <div className="admin-panel">
          <h3>Job data</h3>

          <label className="admin-form-field">
            <span>Public ID</span>
            <input className="admin-input" value={form.publicId} onChange={(e) => setForm({ ...form, publicId: e.target.value })} />
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