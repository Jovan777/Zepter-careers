import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import {
  getAdminApplicationById,
  updateAdminApplicationStatus,
} from "../api/adminApplicationsApi";
import type { AdminApplicationDetailsResponse } from "../types/admin";
import { ADMIN_API_ORIGIN } from "../api/adminHttp";

const statusOptions = [
  "new",
  "screening",
  "interview",
  "offer",
  "onboarding",
  "hired",
  "rejected",
  "withdrawn",
  "archived",
];

const statusLabels: Record<string, string> = {
  new: "New",
  screening: "Screening",
  interview: "Interview",
  offer: "Offer",
  onboarding: "Onboarding",
  hired: "Hired",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
  archived: "Archived",
};

const formatLabel = (value: string) => {
  return statusLabels[value] || value;
};

const formatEventTitle = (type: string) => {
  const map: Record<string, string> = {
    created: "Application created",
    status_changed: "Status changed",
    note_added: "Note added",
    updated: "Application updated",
  };

  return map[type] || type.replace(/_/g, " ");
};

const getEventRows = (event: { type: string; data?: Record<string, unknown> | null }) => {
  const data = event.data || {};
  const rows: Array<{ label: string; value: string }> = [];

  Object.entries(data).forEach(([key, rawValue]) => {
    if (rawValue === null || rawValue === undefined || rawValue === "") return;

    let value = "";

    if (typeof rawValue === "string") {
      value = rawValue;
    } else if (typeof rawValue === "number" || typeof rawValue === "boolean") {
      value = String(rawValue);
    } else if (Array.isArray(rawValue)) {
      value = rawValue.join(", ");
    } else if (typeof rawValue === "object") {
      value = Object.entries(rawValue as Record<string, unknown>)
        .map(([nestedKey, nestedValue]) => `${nestedKey}: ${String(nestedValue)}`)
        .join(", ");
    }

    if (!value) return;

    const prettyLabelMap: Record<string, string> = {
      fromStatus: "From",
      toStatus: "To",
      status: "Status",
      reason: "Reason",
      note: "Note",
      message: "Message",
      changedBy: "Changed by",
    };

    rows.push({
      label: prettyLabelMap[key] || key,
      value:
        key.toLowerCase().includes("status") && statusLabels[value]
          ? statusLabels[value]
          : value,
    });
  });

  return rows;
};

const AdminApplicationDetailsPage = () => {
  const { token } = useAdminAuth();
  const { publicId } = useParams();
  const [data, setData] = useState<AdminApplicationDetailsResponse | null>(null);
  const [status, setStatus] = useState("new");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const load = async () => {
    if (!token || !publicId) return;
    try {
      const response = await getAdminApplicationById(token, publicId);
      setData(response);
      setStatus(response.application.status);
      setReason(response.application.reason || "");
      setError("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Greška pri dohvatanju detalja prijave."
      );
    }
  };

  useEffect(() => {
    load();
  }, [token, publicId]);

  const eventItems = useMemo(() => {
    return data?.application.events || [];
  }, [data]);

  if (!data && !error) return <p>Učitavanje...</p>;
  if (error) return <p className="admin-form-error">{error}</p>;

  const application = data?.application;
  if (!application) return null;

  return (
    <section className="admin-page">
      <div className="admin-page__header">
        <h2>Application {application.publicId}</h2>
        <p>Detaljan pregled kandidata, dokumenta i istorije događaja.</p>
      </div>

      <div className="admin-two-col">
        <div className="admin-panel">
          <h3>Candidate</h3>
          <div className="admin-details-stack">
            <p>
              <strong>
                {application.candidate.firstName} {application.candidate.lastName}
              </strong>
            </p>
            <p>{application.candidate.email}</p>
            <p>{application.candidate.phone || "-"}</p>
            <p>
              {application.candidate.country || "-"},{" "}
              {application.candidate.city || "-"}
            </p>
          </div>

          <h3 className="admin-mt">Job</h3>
          <div className="admin-details-stack">
            <p>{application.job?.company?.name || "-"}</p>
            <p>{application.job?.region?.name || "-"}</p>
          </div>

          <h3 className="admin-mt">Documents</h3>
          <div className="admin-details-stack">
            {application.cvDocument?.fileUrl ? (
              <a
                className="admin-link"
                href={`${ADMIN_API_ORIGIN}${application.cvDocument.fileUrl}`}
                target="_blank"
                rel="noreferrer"
              >
                Open CV
              </a>
            ) : (
              <p>No CV</p>
            )}
          </div>
        </div>

        <div className="admin-panel">
          <h3>Status management</h3>

          <div className="admin-status-form">
            <select
              className="admin-input"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {statusOptions.map((item) => (
                <option key={item} value={item}>
                  {formatLabel(item)}
                </option>
              ))}
            </select>

            <textarea
              className="admin-input admin-input--textarea"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason"
            />

            <button
              className="admin-button admin-button--primary admin-button--status-update"
              onClick={async () => {
                if (!token || !publicId) return;
                try {
                  setIsUpdating(true);
                  await updateAdminApplicationStatus(token, publicId, {
                    status,
                    reason,
                  });
                  await load();
                } finally {
                  setIsUpdating(false);
                }
              }}
            >
              {isUpdating ? "Updating..." : "Update status"}
            </button>
          </div>

          <h3 className="admin-mt admin-events-heading">Events</h3>

          <div className="admin-timeline admin-timeline--spacious">
            {eventItems.length === 0 ? (
              <p className="admin-muted-text">Nema zabeleženih događaja.</p>
            ) : (
              eventItems.map((event, index) => {
                const rows = getEventRows(event);

                return (
                  <div
                    key={`${event.type}-${event.timestamp}-${index}`}
                    className="admin-timeline__item admin-timeline__item--event"
                  >
                    <div className="admin-event-card__top">
                      <strong className="admin-event-card__title">
                        {formatEventTitle(event.type)}
                      </strong>
                      <span className="admin-event-card__time">
                        {new Date(event.timestamp).toLocaleString("sr-RS")}
                      </span>
                    </div>

                    {rows.length > 0 ? (
                      <div className="admin-event-card__rows">
                        {rows.map((row, rowIndex) => (
                          <div key={`${row.label}-${rowIndex}`} className="admin-event-card__row">
                            <span className="admin-event-card__label">{row.label}</span>
                            <span className="admin-event-card__value">{row.value}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="admin-event-card__empty">No additional details.</p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminApplicationDetailsPage;