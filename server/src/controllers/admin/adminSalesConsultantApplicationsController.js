const SalesConsultantApplication = require("../../models/SalesConsultantApplication");

const STATUSES =
  SalesConsultantApplication.SALES_CONSULTANT_APPLICATION_STATUSES;

const STATUS_LABELS = {
  new: "New",
  contacted: "Contacted",
  in_progress: "In progress",
  accepted: "Accepted",
  rejected: "Rejected",
  archived: "Archived",
};

const normalizeString = (value) =>
  typeof value === "string" ? value.trim() : "";

const formatStatusLabel = (status) => STATUS_LABELS[status] || status;

const getMotivationText = (application) =>
  application.message || application.motivation || "";

const mapApplication = (application) => ({
  _id: application._id,
  publicId: application.publicId,
  firstName: application.firstName,
  lastName: application.lastName,
  email: application.email,
  phone: application.phone,
  country: application.country,
  city: application.city,
  message: getMotivationText(application),
  motivation: application.motivation,
  cvDocument: application.cvDocument,
  acceptedTerms: application.acceptedTerms,
  acceptedTermsAt: application.acceptedTermsAt,
  marketingConsent: application.marketingConsent,
  status: application.status,
  statusLabel: formatStatusLabel(application.status),
  reason: application.reason,
  createdAt: application.createdAt,
  updatedAt: application.updatedAt,
});

const buildFilter = ({ search, status }) => {
  const filter = {};

  if (status) {
    filter.status = status;
  }

  if (search) {
    const regex = { $regex: search, $options: "i" };
    filter.$or = [
      { publicId: regex },
      { firstName: regex },
      { lastName: regex },
      { email: regex },
      { phone: regex },
      { country: regex },
      { city: regex },
    ];
  }

  return filter;
};

const getAdminSalesConsultantApplications = async (req, res) => {
  try {
    const search = normalizeString(req.query.search);
    const status = normalizeString(req.query.status);

    if (status && !STATUSES.includes(status)) {
      return res.status(400).json({ message: "Status nije validan." });
    }

    const applications = await SalesConsultantApplication.find(
      buildFilter({ search, status })
    ).sort({ createdAt: -1 });

    return res.status(200).json({
      statuses: STATUSES,
      applications: applications.map(mapApplication),
    });
  } catch (error) {
    console.error("Greška u getAdminSalesConsultantApplications:", error);
    return res.status(500).json({
      message: "Greška pri dohvatanju prijava za konsultante prodaje.",
      error: error.message,
    });
  }
};

const getAdminSalesConsultantApplicationById = async (req, res) => {
  try {
    const publicId = normalizeString(req.params.publicId);

    if (!publicId) {
      return res.status(400).json({ message: "publicId je obavezan." });
    }

    const application = await SalesConsultantApplication.findOne({ publicId });

    if (!application) {
      return res.status(404).json({
        message: "Prijava za konsultanta prodaje nije pronađena.",
      });
    }

    return res.status(200).json({
      statuses: STATUSES,
      application: {
        ...mapApplication(application),
        events: [...application.events].sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        ),
      },
    });
  } catch (error) {
    console.error("Greška u getAdminSalesConsultantApplicationById:", error);
    return res.status(500).json({
      message: "Greška pri dohvatanju detalja prijave za konsultanta prodaje.",
      error: error.message,
    });
  }
};

const updateAdminSalesConsultantApplicationStatus = async (req, res) => {
  try {
    const publicId = normalizeString(req.params.publicId);
    const nextStatus = normalizeString(req.body.status).toLowerCase();
    const reason = normalizeString(req.body.reason);

    if (!publicId) {
      return res.status(400).json({ message: "publicId je obavezan." });
    }

    if (!STATUSES.includes(nextStatus)) {
      return res.status(400).json({ message: "Status nije validan." });
    }

    const application = await SalesConsultantApplication.findOne({ publicId });

    if (!application) {
      return res.status(404).json({
        message: "Prijava za konsultanta prodaje nije pronađena.",
      });
    }

    const prevStatus = application.status;
    application.status = nextStatus;
    application.reason = reason;
    application.events.unshift({
      type: "status_changed",
      timestamp: new Date(),
      data: {
        from: prevStatus,
        to: nextStatus,
        reason,
      },
    });

    await application.save();

    return res.status(200).json({
      message: "Status prijave za konsultanta prodaje je uspešno izmenjen.",
      application: {
        ...mapApplication(application),
        events: application.events,
      },
    });
  } catch (error) {
    console.error("Greška u updateAdminSalesConsultantApplicationStatus:", error);
    return res.status(500).json({
      message: "Greška pri izmeni statusa prijave za konsultanta prodaje.",
      error: error.message,
    });
  }
};

module.exports = {
  getAdminSalesConsultantApplications,
  getAdminSalesConsultantApplicationById,
  updateAdminSalesConsultantApplicationStatus,
};
