import { useEffect, useState } from "react";
import { useAdminAuth } from "../context/AdminAuthContext";
import {
  createSchedulerEvent,
  deleteSchedulerEvent,
  getSchedulerEvents,
  updateSchedulerEvent,
} from "../api/adminSchedulerApi";
import { getAdminApplications } from "../api/adminApplicationsApi";
import type { AdminApplicationListItem, SchedulerEvent } from "../types/admin";

const emptyForm = {
  application: "",
  type: "interview",
  startAt: "",
  endAt: "",
  timezone: "Europe/Belgrade",
  locationOrLink: "",
  notes: "",
};

const AdminSchedulerPage = () => {
  const { token } = useAdminAuth();

  const [events, setEvents] = useState<SchedulerEvent[]>([]);
  const [applications, setApplications] = useState<AdminApplicationListItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadAll = async () => {
    if (!token) return;

    try {
      setError("");

      const [eventsData, applicationsData] = await Promise.all([
        getSchedulerEvents(token),
        getAdminApplications(token),
      ]);

      setEvents(eventsData.events);
      setApplications(applicationsData.applications);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Greška pri dohvatanju scheduler podataka."
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
        await updateSchedulerEvent(token, editingId, {
          type: form.type,
          startAt: form.startAt,
          endAt: form.endAt,
          timezone: form.timezone,
          locationOrLink: form.locationOrLink,
          notes: form.notes,
        });
      } else {
        await createSchedulerEvent(token, form);
      }

      resetForm();
      await loadAll();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Greška pri čuvanju scheduler događaja."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="admin-page">
      <div className="admin-page__header">
        <h2>Scheduler</h2>
        <p>Upravljanje intervjuima, sastancima i drugim terminima.</p>
      </div>

      <div className="admin-two-col">
        <div className="admin-panel">
          <h3>{editingId ? "Izmeni događaj" : "Novi događaj"}</h3>

          <form onSubmit={handleSubmit}>
            {!editingId && (
              <label className="admin-form-field">
                <span>Application</span>
                <select
                  className="admin-input"
                  value={form.application}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      application: e.target.value,
                    }))
                  }
                >
                  <option value="">Select application</option>
                  {applications.map((application) => (
                    <option key={application._id} value={application._id}>
                      {application.publicId} — {application.candidate.firstName}{" "}
                      {application.candidate.lastName}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <label className="admin-form-field">
              <span>Type</span>
              <select
                className="admin-input"
                value={form.type}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, type: e.target.value }))
                }
              >
                <option value="screening">screening</option>
                <option value="interview">interview</option>
                <option value="meeting">meeting</option>
              </select>
            </label>

            <label className="admin-form-field">
              <span>Start</span>
              <input
                type="datetime-local"
                className="admin-input"
                value={form.startAt}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, startAt: e.target.value }))
                }
              />
            </label>

            <label className="admin-form-field">
              <span>End</span>
              <input
                type="datetime-local"
                className="admin-input"
                value={form.endAt}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, endAt: e.target.value }))
                }
              />
            </label>

            <label className="admin-form-field">
              <span>Timezone</span>
              <input
                className="admin-input"
                value={form.timezone}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, timezone: e.target.value }))
                }
              />
            </label>

            <label className="admin-form-field">
              <span>Location or link</span>
              <input
                className="admin-input"
                value={form.locationOrLink}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    locationOrLink: e.target.value,
                  }))
                }
              />
            </label>

            <label className="admin-form-field">
              <span>Notes</span>
              <textarea
                className="admin-input admin-input--textarea"
                value={form.notes}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, notes: e.target.value }))
                }
              />
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
                    ? "Update event"
                    : "Create event"}
              </button>
            </div>
          </form>
        </div>

        <div className="admin-panel admin-table-wrapper">
          <h3>Lista događaja</h3>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Status prijave</th>
                <th>Type</th>
                <th>Start</th>
                <th>End</th>
                <th>Timezone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event._id}>
                  <td>
                    {typeof event.candidate === "string"
                      ? event.candidate
                      : `${event.candidate?.firstName || ""} ${event.candidate?.lastName || ""}`.trim() || "-"}
                  </td>
                  <td>
                    {typeof event.application === "string"
                      ? "-"
                      : event.application?.status || "-"}
                  </td>                  
                  <td>{event.type}</td>
                  <td>{new Date(event.startAt).toLocaleString("sr-RS")}</td>
                  <td>{new Date(event.endAt).toLocaleString("sr-RS")}</td>
                  <td>{event.timezone}</td>
                  <td>
                    <div className="admin-inline-actions">
                      <button
                        type="button"
                        className="admin-button admin-button--ghost"
                        onClick={() => {
                          setEditingId(event._id);
                          setForm({
                            application: "",
                            type: event.type,
                            startAt: event.startAt
                              ? event.startAt.slice(0, 16)
                              : "",
                            endAt: event.endAt ? event.endAt.slice(0, 16) : "",
                            timezone: event.timezone || "Europe/Belgrade",
                            locationOrLink: event.locationOrLink || "",
                            notes: event.notes || "",
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
                            "Obrisati scheduler događaj?"
                          );
                          if (!confirmed) return;

                          await deleteSchedulerEvent(token, event._id);
                          await loadAll();
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!events.length && (
                <tr>
                  <td colSpan={7}>Nema događaja.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default AdminSchedulerPage;