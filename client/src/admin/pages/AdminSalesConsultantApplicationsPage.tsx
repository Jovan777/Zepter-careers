import { useEffect, useMemo, useState } from "react";
import { ADMIN_API_ORIGIN } from "../api/adminHttp";
import {
  getAdminSalesConsultantApplicationById,
  getAdminSalesConsultantApplications,
  updateAdminSalesConsultantApplicationStatus,
} from "../api/adminSalesConsultantApplicationsApi";
import { useAdminAuth } from "../context/AdminAuthContext";
import type {
  AdminSalesConsultantApplication,
  AdminSalesConsultantDetailsResponse,
} from "../types/admin";

const statusLabels: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  in_progress: "In progress",
  accepted: "Accepted",
  rejected: "Rejected",
  archived: "Archived",
};

const formatStatusLabel = (value: string) => statusLabels[value] || value;

const formatEventTitle = (type: string) => {
  const map: Record<string, string> = {
    created: "Application created",
    status_changed: "Status changed",
    updated: "Application updated",
  };

  return map[type] || type.replace(/_/g, " ");
};

const formatEventValue = (key: string, value: unknown) => {
  if (value === null || value === undefined || value === "") return "";

  if (typeof value === "string") {
    if (
      (key === "from" || key === "to" || key.toLowerCase().includes("status")) &&
      statusLabels[value]
    ) {
      return statusLabels[value];
    }
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .map(([nestedKey, nestedValue]) => `${nestedKey}: ${String(nestedValue)}`)
      .join(", ");
  }

  return "";
};

const AdminSalesConsultantApplicationsPage = () => {
  const { token } = useAdminAuth();

  const [items, setItems] = useState<AdminSalesConsultantApplication[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [details, setDetails] =
    useState<AdminSalesConsultantDetailsResponse | null>(null);
  const [detailsError, setDetailsError] = useState("");
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [statusDraft, setStatusDraft] = useState("");
  const [reasonDraft, setReasonDraft] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const load = async () => {
    if (!token) return;

    try {
      setIsLoading(true);
      setError("");

      const data = await getAdminSalesConsultantApplications(token, {
        search,
        status,
      });

      setItems(data.applications);
      setStatuses(data.statuses);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Greška pri dohvatanju prijava za konsultante prodaje."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [token, status]);

  const openDetails = async (publicId: string) => {
    if (!token) return;

    try {
      setIsDetailsLoading(true);
      setDetailsError("");

      const data = await getAdminSalesConsultantApplicationById(token, publicId);
      setDetails(data);
      setStatusDraft(data.application.status);
      setReasonDraft(data.application.reason || "");
    } catch (err) {
      setDetailsError(
        err instanceof Error
          ? err.message
          : "Greška pri dohvatanju detalja prijave za konsultanta prodaje."
      );
    } finally {
      setIsDetailsLoading(false);
    }
  };

  const closeDetails = () => {
    if (isUpdating) return;
    setDetails(null);
    setDetailsError("");
    setStatusDraft("");
    setReasonDraft("");
  };

  const handleStatusUpdate = async () => {
    if (!token || !details) return;

    try {
      setIsUpdating(true);
      setDetailsError("");

      await updateAdminSalesConsultantApplicationStatus(
        token,
        details.application.publicId,
        {
          status: statusDraft,
          reason: reasonDraft,
        }
      );

      const refreshed = await getAdminSalesConsultantApplicationById(
        token,
        details.application.publicId
      );

      setDetails(refreshed);
      setStatusDraft(refreshed.application.status);
      setReasonDraft(refreshed.application.reason || "");
      await load();
    } catch (err) {
      setDetailsError(
        err instanceof Error
          ? err.message
          : "Greška pri izmeni statusa prijave za konsultanta prodaje."
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const eventItems = useMemo(() => details?.application.events || [], [details]);
  const application = details?.application;

  return (
    <section className="admin-page">
      <div className="admin-page__header">
        <h2>Konsultanti prodaje</h2>
        <p>Pregled prijava kandidata za angažman konsultanta u prodaji.</p>
      </div>

      <div className="admin-panel admin-filters-row">
        <input
          className="admin-input"
          placeholder="Search name, email, phone or publicId"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          className="admin-input"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          <option value="">All statuses</option>
          {statuses.map((item) => (
            <option key={item} value={item}>
              {formatStatusLabel(item)}
            </option>
          ))}
        </select>

        <button
          type="button"
          className="admin-button admin-button--primary"
          onClick={load}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Apply filters"}
        </button>
      </div>

      {error ? <p className="admin-form-error">{error}</p> : null}

      <div className="admin-panel admin-table-wrapper">
        {isLoading ? (
          <p>Učitavanje prijava za konsultante prodaje...</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Public ID</th>
                <th>Created at</th>
                <th>Candidate</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Location</th>
                <th>Status</th>
                <th>CV</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => (
                <tr key={item._id}>
                  <td>{item.publicId}</td>
                  <td>{new Date(item.createdAt).toLocaleString("sr-RS")}</td>
                  <td>
                    {item.firstName} {item.lastName}
                  </td>
                  <td>{item.email}</td>
                  <td>{item.phone || "-"}</td>
                  <td>
                    {[item.country, item.city].filter(Boolean).join(", ") || "-"}
                  </td>
                  <td>
                    <span className={`admin-badge admin-badge--${item.status}`}>
                      {item.statusLabel}
                    </span>
                  </td>
                  <td>
                    {item.cvDocument?.fileUrl ? (
                      <a
                        className="admin-link"
                        href={`${ADMIN_API_ORIGIN}${item.cvDocument.fileUrl}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open CV
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="admin-button admin-button--ghost"
                      onClick={() => openDetails(item.publicId)}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}

              {!items.length && (
                <tr>
                  <td colSpan={9}>
                    Nema pronađenih prijava za konsultante prodaje.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {(details || detailsError || isDetailsLoading) && (
        <div className="admin-modal-backdrop" role="dialog" aria-modal="true">
          <div className="admin-modal admin-modal--wide">
            <div className="admin-modal__header-row">
              <div>
                <h3>Konsultant prodaje details</h3>
                <p>{application?.publicId || "Učitavanje..."}</p>
              </div>

              <button
                type="button"
                className="admin-button admin-button--ghost"
                onClick={closeDetails}
                disabled={isUpdating}
              >
                Close
              </button>
            </div>

            {isDetailsLoading ? <p>Učitavanje detalja...</p> : null}
            {detailsError ? <p className="admin-form-error">{detailsError}</p> : null}

            {application ? (
              <div className="admin-talent-pool-details">
                <div className="admin-details-stack">
                  <p>
                    <strong>Public ID:</strong> {application.publicId}
                  </p>
                  <p>
                    <strong>First name:</strong> {application.firstName}
                  </p>
                  <p>
                    <strong>Last name:</strong> {application.lastName}
                  </p>
                  <p>
                    <strong>Email:</strong> {application.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {application.phone || "-"}
                  </p>
                  <p>
                    <strong>Country:</strong> {application.country || "-"}
                  </p>
                  <p>
                    <strong>City:</strong> {application.city || "-"}
                  </p>
                  <p>
                    <strong>Message / motivation:</strong>{" "}
                    {application.message || application.motivation || "-"}
                  </p>
                  <p>
                    <strong>Created at:</strong>{" "}
                    {new Date(application.createdAt).toLocaleString("sr-RS")}
                  </p>
                  <p>
                    <strong>Accepted terms:</strong>{" "}
                    {application.acceptedTerms ? "Yes" : "No"}
                  </p>
                  <p>
                    <strong>Marketing consent:</strong>{" "}
                    {application.marketingConsent ? "Yes" : "No"}
                  </p>
                  <p>
                    <strong>CV:</strong>{" "}
                    {application.cvDocument?.fileUrl ? (
                      <a
                        className="admin-link"
                        href={`${ADMIN_API_ORIGIN}${application.cvDocument.fileUrl}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {application.cvDocument.fileName || "Open CV"}
                      </a>
                    ) : (
                      "-"
                    )}
                  </p>
                </div>

                <div className="admin-status-form admin-mt">
                  <h3>Status management</h3>

                  <select
                    className="admin-input"
                    value={statusDraft}
                    onChange={(event) => setStatusDraft(event.target.value)}
                  >
                    {(details?.statuses || statuses).map((item) => (
                      <option key={item} value={item}>
                        {formatStatusLabel(item)}
                      </option>
                    ))}
                  </select>

                  <textarea
                    className="admin-input admin-input--textarea"
                    placeholder="Reason"
                    value={reasonDraft}
                    onChange={(event) => setReasonDraft(event.target.value)}
                  />

                  <button
                    type="button"
                    className="admin-button admin-button--primary admin-button--status-update"
                    onClick={handleStatusUpdate}
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Updating..." : "Update status"}
                  </button>
                </div>

                <h3 className="admin-mt admin-events-heading">Events</h3>
                <div className="admin-timeline admin-timeline--spacious">
                  {eventItems.length === 0 ? (
                    <p className="admin-muted-text">Nema zabeleženih događaja.</p>
                  ) : (
                    eventItems.map((event, eventIndex) => {
                      const rows = Object.entries(event.data || {})
                        .map(([key, value]) => ({
                          key,
                          value: formatEventValue(key, value),
                        }))
                        .filter((row) => row.value);

                      return (
                        <div
                          key={`${event.type}-${event.timestamp}-${eventIndex}`}
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
                              {rows.map((row) => (
                                <div
                                  key={row.key}
                                  className="admin-event-card__row"
                                >
                                  <span className="admin-event-card__label">
                                    {row.key}
                                  </span>
                                  <span className="admin-event-card__value">
                                    {row.value}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="admin-event-card__empty">
                              No additional details.
                            </p>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminSalesConsultantApplicationsPage;
