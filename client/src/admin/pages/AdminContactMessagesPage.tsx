import { useEffect, useMemo, useState } from "react";
import {
  getAdminContactMessageById,
  getAdminContactMessages,
  updateAdminContactMessageNote,
  updateAdminContactMessageStatus,
} from "../api/adminContactMessagesApi";
import { useAdminAuth } from "../context/AdminAuthContext";
import type {
  AdminContactMessage,
  AdminContactMessageDetailsResponse,
} from "../types/admin";

const statusLabels: Record<string, string> = {
  new: "New",
  read: "Read",
  answered: "Answered",
  archived: "Archived",
};

const statusActions = [
  { status: "read", label: "Mark as read" },
  { status: "answered", label: "Mark as answered" },
  { status: "archived", label: "Archive" },
];

const formatStatusLabel = (value: string) => statusLabels[value] || value;

const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleString("sr-RS") : "-";

const dispatchUnreadCountRefresh = () => {
  window.dispatchEvent(new Event("contact-messages:refresh-count"));
};

const AdminContactMessagesPage = () => {
  const { token } = useAdminAuth();

  const [items, setItems] = useState<AdminContactMessage[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [details, setDetails] =
    useState<AdminContactMessageDetailsResponse | null>(null);
  const [detailsError, setDetailsError] = useState("");
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [noteDraft, setNoteDraft] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const load = async () => {
    if (!token) return;

    try {
      setIsLoading(true);
      setError("");

      const data = await getAdminContactMessages(token, { search, status });
      setItems(data.messages);
      setStatuses(data.statuses);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Greska pri dohvatanju kontakt poruka."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [token, status]);

  const openDetails = async (id: string) => {
    if (!token) return;

    try {
      setIsDetailsLoading(true);
      setDetailsError("");

      const data = await getAdminContactMessageById(token, id);
      setDetails(data);
      setNoteDraft(data.message.adminNote || "");
    } catch (err) {
      setDetailsError(
        err instanceof Error
          ? err.message
          : "Greska pri dohvatanju kontakt poruke."
      );
    } finally {
      setIsDetailsLoading(false);
    }
  };

  const closeDetails = () => {
    if (isUpdating) return;

    setDetails(null);
    setDetailsError("");
    setNoteDraft("");
  };

  const refreshDetails = async (messageId: string) => {
    if (!token) return null;

    const refreshed = await getAdminContactMessageById(token, messageId);
    setDetails(refreshed);
    setNoteDraft(refreshed.message.adminNote || "");
    return refreshed;
  };

  const handleStatusUpdate = async (nextStatus: string) => {
    if (!token || !details) return;

    try {
      setIsUpdating(true);
      setDetailsError("");

      await updateAdminContactMessageStatus(token, details.message._id, nextStatus);
      await refreshDetails(details.message._id);
      await load();
      dispatchUnreadCountRefresh();
    } catch (err) {
      setDetailsError(
        err instanceof Error
          ? err.message
          : "Greska pri izmeni statusa kontakt poruke."
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleNoteSave = async () => {
    if (!token || !details) return;

    try {
      setIsUpdating(true);
      setDetailsError("");

      await updateAdminContactMessageNote(token, details.message._id, noteDraft);
      await refreshDetails(details.message._id);
      await load();
    } catch (err) {
      setDetailsError(
        err instanceof Error ? err.message : "Greska pri cuvanju napomene."
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const message = details?.message;
  const availableStatuses = useMemo(
    () => details?.statuses || statuses,
    [details, statuses]
  );

  return (
    <section className="admin-page">
      <div className="admin-page__header">
        <h2>Kontakt</h2>
        <p>Pregled poruka poslatih preko javne kontakt forme.</p>
      </div>

      <div className="admin-panel admin-filters-row">
        <input
          className="admin-input"
          placeholder="Search name, email, phone or message"
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
          <p>Ucitavanje kontakt poruka...</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Email</th>
                <th>Reason</th>
                <th>Message</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => (
                <tr key={item._id}>
                  <td>{formatDate(item.createdAt)}</td>
                  <td>{item.fullName}</td>
                  <td>{item.email}</td>
                  <td>{item.reasonLabel || item.reason || "-"}</td>
                  <td className="admin-contact-message-preview">
                    {item.messagePreview || "-"}
                  </td>
                  <td>
                    <span className={`admin-badge admin-badge--${item.status}`}>
                      {item.statusLabel}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="admin-button admin-button--ghost"
                      onClick={() => openDetails(item._id)}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}

              {!items.length && (
                <tr>
                  <td colSpan={7}>Nema kontakt poruka.</td>
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
                <h3>Kontakt poruka</h3>
                <p>{message?.fullName || "Ucitavanje..."}</p>
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

            {isDetailsLoading ? <p>Ucitavanje detalja...</p> : null}
            {detailsError ? <p className="admin-form-error">{detailsError}</p> : null}

            {message ? (
              <div className="admin-contact-message-details">
                <div className="admin-details-stack">
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className={`admin-badge admin-badge--${message.status}`}>
                      {message.statusLabel}
                    </span>
                  </p>
                  <p>
                    <strong>Name:</strong> {message.fullName}
                  </p>
                  <p>
                    <strong>Email:</strong> {message.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {message.phone || "-"}
                  </p>
                  <p>
                    <strong>Country:</strong>{" "}
                    {message.countryLabel || message.country || "-"}
                  </p>
                  <p>
                    <strong>Reason:</strong>{" "}
                    {message.reasonLabel || message.reason || "-"}
                  </p>
                  <p>
                    <strong>Source page:</strong> {message.sourcePage || "-"}
                  </p>
                  <p>
                    <strong>Submitted:</strong> {formatDate(message.createdAt)}
                  </p>
                  <p>
                    <strong>Read at:</strong> {formatDate(message.readAt)}
                  </p>
                  <p>
                    <strong>Answered at:</strong> {formatDate(message.answeredAt)}
                  </p>
                </div>

                <div className="admin-contact-message-body">
                  <h3>Message</h3>
                  <p>{message.message}</p>
                </div>

                <div className="admin-status-form admin-mt">
                  <h3>Status actions</h3>
                  <div className="admin-inline-actions">
                    {statusActions.map((action) => (
                      <button
                        key={action.status}
                        type="button"
                        className="admin-button admin-button--ghost"
                        onClick={() => handleStatusUpdate(action.status)}
                        disabled={isUpdating || message.status === action.status}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>

                  <label className="admin-form-field">
                    Status
                    <select
                      className="admin-input"
                      value={message.status}
                      onChange={(event) => handleStatusUpdate(event.target.value)}
                      disabled={isUpdating}
                    >
                      {availableStatuses.map((item) => (
                        <option key={item} value={item}>
                          {formatStatusLabel(item)}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="admin-status-form admin-mt">
                  <h3>Admin note</h3>
                  <textarea
                    className="admin-input admin-input--textarea"
                    value={noteDraft}
                    onChange={(event) => setNoteDraft(event.target.value)}
                    placeholder="Internal note"
                  />

                  <button
                    type="button"
                    className="admin-button admin-button--primary admin-button--status-update"
                    onClick={handleNoteSave}
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Saving..." : "Save note"}
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminContactMessagesPage;
