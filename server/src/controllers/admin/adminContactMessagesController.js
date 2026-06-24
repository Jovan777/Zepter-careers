const mongoose = require("mongoose");
const ContactMessage = require("../../models/ContactMessage");

const STATUSES = ContactMessage.CONTACT_MESSAGE_STATUSES;

const STATUS_LABELS = {
  new: "New",
  read: "Read",
  answered: "Answered",
  archived: "Archived",
};

const normalizeString = (value) =>
  typeof value === "string" ? value.trim() : "";

const formatStatusLabel = (status) => STATUS_LABELS[status] || status;

const buildPreview = (message) => {
  const normalized = normalizeString(message).replace(/\s+/g, " ");
  return normalized.length > 140
    ? `${normalized.slice(0, 140).trim()}...`
    : normalized;
};

const mapContactMessage = (message) => ({
  _id: message._id,
  fullName: message.fullName,
  firstName: message.firstName,
  lastName: message.lastName,
  email: message.email,
  phone: message.phone,
  country: message.country,
  countryLabel: message.countryLabel,
  reason: message.reason,
  reasonLabel: message.reasonLabel,
  message: message.message,
  messagePreview: buildPreview(message.message),
  sourcePage: message.sourcePage,
  status: message.status,
  statusLabel: formatStatusLabel(message.status),
  readAt: message.readAt,
  answeredAt: message.answeredAt,
  adminNote: message.adminNote,
  createdAt: message.createdAt,
  updatedAt: message.updatedAt,
});

const buildFilter = ({ search, status }) => {
  const filter = {};

  if (status) {
    filter.status = status;
  }

  if (search) {
    const regex = { $regex: search, $options: "i" };
    filter.$or = [
      { fullName: regex },
      { firstName: regex },
      { lastName: regex },
      { email: regex },
      { phone: regex },
      { countryLabel: regex },
      { reasonLabel: regex },
      { message: regex },
    ];
  }

  return filter;
};

const findMessageById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  return ContactMessage.findById(id);
};

const getAdminContactMessages = async (req, res) => {
  try {
    const search = normalizeString(req.query.search);
    const status = normalizeString(req.query.status);

    if (status && !STATUSES.includes(status)) {
      return res.status(400).json({ message: "Status nije validan." });
    }

    const messages = await ContactMessage.find(
      buildFilter({ search, status })
    ).sort({ createdAt: -1 });

    return res.status(200).json({
      statuses: STATUSES,
      messages: messages.map(mapContactMessage),
    });
  } catch (error) {
    console.error("Greska u getAdminContactMessages:", error);
    return res.status(500).json({
      message: "Greska pri dohvatanju kontakt poruka.",
    });
  }
};

const getAdminContactMessagesUnreadCount = async (_req, res) => {
  try {
    const count = await ContactMessage.countDocuments({ status: "new" });

    return res.status(200).json({ count });
  } catch (error) {
    console.error("Greska u getAdminContactMessagesUnreadCount:", error);
    return res.status(500).json({
      message: "Greska pri dohvatanju broja novih kontakt poruka.",
    });
  }
};

const getAdminContactMessageById = async (req, res) => {
  try {
    const message = await findMessageById(normalizeString(req.params.id));

    if (!message) {
      return res.status(404).json({ message: "Kontakt poruka nije pronadjena." });
    }

    return res.status(200).json({
      statuses: STATUSES,
      message: mapContactMessage(message),
    });
  } catch (error) {
    console.error("Greska u getAdminContactMessageById:", error);
    return res.status(500).json({
      message: "Greska pri dohvatanju kontakt poruke.",
    });
  }
};

const updateStatusDates = (message, nextStatus) => {
  const now = new Date();

  if ((nextStatus === "read" || nextStatus === "answered") && !message.readAt) {
    message.readAt = now;
  }

  if (nextStatus === "answered" && !message.answeredAt) {
    message.answeredAt = now;
  }
};

const updateAdminContactMessageStatus = async (req, res) => {
  try {
    const nextStatus = normalizeString(req.body.status).toLowerCase();

    if (!STATUSES.includes(nextStatus)) {
      return res.status(400).json({ message: "Status nije validan." });
    }

    const message = await findMessageById(normalizeString(req.params.id));

    if (!message) {
      return res.status(404).json({ message: "Kontakt poruka nije pronadjena." });
    }

    message.status = nextStatus;
    updateStatusDates(message, nextStatus);

    await message.save();

    const unreadCount = await ContactMessage.countDocuments({ status: "new" });

    return res.status(200).json({
      message: "Status kontakt poruke je uspesno izmenjen.",
      contactMessage: mapContactMessage(message),
      unreadCount,
    });
  } catch (error) {
    console.error("Greska u updateAdminContactMessageStatus:", error);
    return res.status(500).json({
      message: "Greska pri izmeni statusa kontakt poruke.",
    });
  }
};

const updateAdminContactMessageNote = async (req, res) => {
  try {
    const adminNote = normalizeString(req.body.adminNote);
    const message = await findMessageById(normalizeString(req.params.id));

    if (!message) {
      return res.status(404).json({ message: "Kontakt poruka nije pronadjena." });
    }

    message.adminNote = adminNote;
    await message.save();

    return res.status(200).json({
      message: "Napomena je uspesno sacuvana.",
      contactMessage: mapContactMessage(message),
    });
  } catch (error) {
    console.error("Greska u updateAdminContactMessageNote:", error);
    return res.status(500).json({
      message: "Greska pri cuvanju napomene.",
    });
  }
};

module.exports = {
  getAdminContactMessages,
  getAdminContactMessagesUnreadCount,
  getAdminContactMessageById,
  updateAdminContactMessageStatus,
  updateAdminContactMessageNote,
};
