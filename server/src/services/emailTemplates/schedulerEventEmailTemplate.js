const EVENT_TYPE_LABELS_SR = {
  screening: "Screening razgovor",
  interview: "Intervju",
  meeting: "Sastanak",
};

const escapeHtml = (value) =>
  String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const formatDateTime = (value, timezone) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  try {
    return new Intl.DateTimeFormat("sr-RS", {
      dateStyle: "full",
      timeStyle: "short",
      timeZone: timezone || "Europe/Belgrade",
    }).format(date);
  } catch (error) {
    return new Intl.DateTimeFormat("sr-RS", {
      dateStyle: "full",
      timeStyle: "short",
    }).format(date);
  }
};

const getEventTypeLabelSr = (eventType) =>
  EVENT_TYPE_LABELS_SR[eventType] || eventType || "Termin";

const schedulerEventEmailTemplate = ({
  candidateName,
  jobTitle,
  eventType,
  start,
  end,
  timezone,
  locationOrLink,
  notes,
  action = "created",
}) => {
  const safeCandidateName = candidateName || "kandidate";
  const safeJobTitle = jobTitle || "odabranu poziciju";
  const typeLabel = getEventTypeLabelSr(eventType);
  const startLabel = formatDateTime(start, timezone);
  const endLabel = formatDateTime(end, timezone);
  const trimmedTimezone = timezone || "Europe/Belgrade";
  const trimmedLocationOrLink =
    typeof locationOrLink === "string" ? locationOrLink.trim() : "";
  const trimmedNotes = typeof notes === "string" ? notes.trim() : "";
  const isUpdate = action === "updated";

  const subject = isUpdate
    ? "Zepter Careers - izmenjen termin"
    : "Zepter Careers - zakazan termin";

  const intro = isUpdate
    ? `Obaveštavamo Vas da je izmenjen termin u okviru Vaše prijave za poziciju "${safeJobTitle}".`
    : `Obaveštavamo Vas da je zakazan termin u okviru Vaše prijave za poziciju "${safeJobTitle}".`;

  const textParts = [
    `Poštovani/a ${safeCandidateName},`,
    "",
    intro,
    "",
    `Tip termina: ${typeLabel}`,
  ];

  if (startLabel) textParts.push(`Vreme početka: ${startLabel}`);
  if (endLabel) textParts.push(`Vreme završetka: ${endLabel}`);
  if (trimmedTimezone) textParts.push(`Vremenska zona: ${trimmedTimezone}`);
  if (trimmedLocationOrLink) {
    textParts.push(`Lokacija/link: ${trimmedLocationOrLink}`);
  }
  if (trimmedNotes) textParts.push("", `Napomena: ${trimmedNotes}`);

  textParts.push(
    "",
    "Srdačan pozdrav,",
    "Zepter Careers",
    "",
    "Ovo je automatsko obaveštenje Zepter Careers sistema."
  );

  const html = `
    <p>Poštovani/a ${escapeHtml(safeCandidateName)},</p>
    <p>${escapeHtml(intro)}</p>
    <p><strong>Tip termina:</strong> ${escapeHtml(typeLabel)}</p>
    ${startLabel ? `<p><strong>Vreme početka:</strong> ${escapeHtml(startLabel)}</p>` : ""}
    ${endLabel ? `<p><strong>Vreme završetka:</strong> ${escapeHtml(endLabel)}</p>` : ""}
    ${
      trimmedTimezone
        ? `<p><strong>Vremenska zona:</strong> ${escapeHtml(trimmedTimezone)}</p>`
        : ""
    }
    ${
      trimmedLocationOrLink
        ? `<p><strong>Lokacija/link:</strong> ${escapeHtml(trimmedLocationOrLink)}</p>`
        : ""
    }
    ${trimmedNotes ? `<p><strong>Napomena:</strong> ${escapeHtml(trimmedNotes)}</p>` : ""}
    <p>Srdačan pozdrav,<br />Zepter Careers</p>
    <hr />
    <p>Ovo je automatsko obaveštenje Zepter Careers sistema.</p>
  `;

  return {
    subject,
    html,
    text: textParts.join("\n"),
  };
};

module.exports = {
  schedulerEventEmailTemplate,
  getEventTypeLabelSr,
};
