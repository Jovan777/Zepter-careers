const STATUS_LABELS_SR = {
  new: "Nova prijava",
  screening: "U procesu pregleda",
  interview: "Intervju",
  offer: "Ponuda",
  onboarding: "Onboarding",
  hired: "Primljen/a",
  rejected: "Odbijeno",
  withdrawn: "Povučeno",
  archived: "Arhivirano",
};

const escapeHtml = (value) =>
  String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const getApplicationStatusLabelSr = (status) =>
  STATUS_LABELS_SR[status] || status || "";

const applicationStatusEmailTemplate = ({
  candidateName,
  jobTitle,
  companyName,
  status,
  reason,
  applicationPublicId,
}) => {
  const safeCandidateName = candidateName || "kandidate";
  const safeJobTitle = jobTitle || "odabranu poziciju";
  const safeCompanyName = companyName || "Zepter";
  const translatedStatus = getApplicationStatusLabelSr(status);
  const trimmedReason = typeof reason === "string" ? reason.trim() : "";
  const trimmedApplicationPublicId =
    typeof applicationPublicId === "string" ? applicationPublicId.trim() : "";

  const subject = "Zepter Careers - status Vaše prijave";

  const textParts = [
    `Poštovani/a ${safeCandidateName},`,
    "",
    `Obaveštavamo Vas da je status Vaše prijave za poziciju "${safeJobTitle}" u kompaniji ${safeCompanyName} ažuriran.`,
    "",
    `Trenutni status prijave: ${translatedStatus}`,
  ];

  if (trimmedApplicationPublicId) {
    textParts.push(`Broj prijave: ${trimmedApplicationPublicId}`);
  }

  if (trimmedReason) {
    textParts.push("", `Napomena: ${trimmedReason}`);
  }

  textParts.push(
    "",
    "Srdačan pozdrav,",
    "Zepter Careers",
    "",
    "Ovo je automatsko obaveštenje Zepter Careers sistema."
  );

  const html = `
    <p>Poštovani/a ${escapeHtml(safeCandidateName)},</p>
    <p>
      Obaveštavamo Vas da je status Vaše prijave za poziciju
      <strong>&quot;${escapeHtml(safeJobTitle)}&quot;</strong>
      u kompaniji ${escapeHtml(safeCompanyName)} ažuriran.
    </p>
    <p><strong>Trenutni status prijave:</strong> ${escapeHtml(translatedStatus)}</p>
    ${
      trimmedApplicationPublicId
        ? `<p><strong>Broj prijave:</strong> ${escapeHtml(trimmedApplicationPublicId)}</p>`
        : ""
    }
    ${
      trimmedReason
        ? `<p><strong>Napomena:</strong> ${escapeHtml(trimmedReason)}</p>`
        : ""
    }
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
  applicationStatusEmailTemplate,
  getApplicationStatusLabelSr,
};
