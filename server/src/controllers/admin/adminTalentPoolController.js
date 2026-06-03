const TalentPoolApplication = require("../../models/TalentPoolApplication");

const TALENT_POOL_STATUSES = TalentPoolApplication.TALENT_POOL_STATUSES;
const AREA_OF_INTEREST_VALUES = TalentPoolApplication.TALENT_POOL_AREA_OF_INTEREST;

const STATUS_LABELS = {
  new: "New",
  reviewed: "Reviewed",
  contacted: "Contacted",
  interview: "Interview",
  talent_pool: "Talent Pool",
  rejected: "Rejected",
  archived: "Archived",
};

const AREA_OF_INTEREST_LABELS = {
  sales: "Prodaja",
  marketing: "Marketing",
  it: "IT",
  finance: "Finansije",
  hr: "HR",
  management: "Menadžment",
  administration: "Administracija",
  logistics: "Logistika",
  legal: "Pravo",
  customer_support: "Korisnička podrška",
  other: "Drugo",
};

const areaOfInterestOptions = AREA_OF_INTEREST_VALUES.map((value) => ({
  value,
  label: AREA_OF_INTEREST_LABELS[value] || value,
}));

const formatStatusLabel = (status) => STATUS_LABELS[status] || status;

const formatAreaOfInterestLabel = (areaOfInterest) =>
  AREA_OF_INTEREST_LABELS[areaOfInterest] || areaOfInterest || "";

const normalizeString = (value) =>
  typeof value === "string" ? value.trim() : "";

const buildSearchFilter = ({ search, status, areaOfInterest }) => {
  const filter = {};

  if (status) {
    filter.status = status;
  }

  if (areaOfInterest) {
    filter.areaOfInterest = areaOfInterest;
  }

  if (search) {
    const regex = { $regex: search, $options: "i" };
    filter.$or = [
      { firstName: regex },
      { lastName: regex },
      { email: regex },
      { phone: regex },
      { publicId: regex },
    ];
  }

  return filter;
};

const mapListItem = (application) => ({
  _id: application._id,
  publicId: application.publicId,
  submittedAt: application.createdAt,
  firstName: application.firstName,
  lastName: application.lastName,
  email: application.email,
  phone: application.phone,
  areaOfInterest: application.areaOfInterest,
  areaOfInterestLabel: formatAreaOfInterestLabel(application.areaOfInterest),
  status: application.status,
  statusLabel: formatStatusLabel(application.status),
  reason: application.reason,
  cvDocument: application.cvDocument,
});

const getAdminTalentPoolApplications = async (req, res) => {
  try {
    const search = normalizeString(req.query.search);
    const status = normalizeString(req.query.status);
    const areaOfInterest = normalizeString(req.query.areaOfInterest);

    if (status && !TALENT_POOL_STATUSES.includes(status)) {
      return res.status(400).json({ message: "Status nije validan." });
    }

    if (areaOfInterest && !AREA_OF_INTEREST_VALUES.includes(areaOfInterest)) {
      return res.status(400).json({
        message: "Oblast interesovanja nije validna.",
      });
    }

    const applications = await TalentPoolApplication.find(
      buildSearchFilter({ search, status, areaOfInterest })
    ).sort({ createdAt: -1 });

    return res.status(200).json({
      statuses: TALENT_POOL_STATUSES,
      areaOfInterestOptions,
      applications: applications.map(mapListItem),
    });
  } catch (error) {
    console.error("Greška u getAdminTalentPoolApplications:", error);
    return res.status(500).json({
      message: "Greška pri dohvatanju Talent Pool prijava.",
      error: error.message,
    });
  }
};

const getAdminTalentPoolApplicationById = async (req, res) => {
  try {
    const publicId = normalizeString(req.params.publicId);

    if (!publicId) {
      return res.status(400).json({ message: "publicId je obavezan." });
    }

    const application = await TalentPoolApplication.findOne({ publicId });

    if (!application) {
      return res.status(404).json({
        message: "Talent Pool prijava nije pronađena.",
      });
    }

    return res.status(200).json({
      statuses: TALENT_POOL_STATUSES,
      areaOfInterestOptions,
      application: {
        ...mapListItem(application),
        message: application.message,
        acceptedTerms: application.acceptedTerms,
        acceptedTermsAt: application.acceptedTermsAt,
        marketingConsent: application.marketingConsent,
        sourceLocale: application.sourceLocale,
        events: [...application.events].sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        ),
      },
    });
  } catch (error) {
    console.error("Greška u getAdminTalentPoolApplicationById:", error);
    return res.status(500).json({
      message: "Greška pri dohvatanju Talent Pool detalja.",
      error: error.message,
    });
  }
};

const updateAdminTalentPoolApplicationStatus = async (req, res) => {
  try {
    const publicId = normalizeString(req.params.publicId);
    const nextStatus = normalizeString(req.body.status).toLowerCase();
    const reason = normalizeString(req.body.reason);

    if (!publicId) {
      return res.status(400).json({ message: "publicId je obavezan." });
    }

    if (!TALENT_POOL_STATUSES.includes(nextStatus)) {
      return res.status(400).json({ message: "Status nije validan." });
    }

    const application = await TalentPoolApplication.findOne({ publicId });

    if (!application) {
      return res.status(404).json({
        message: "Talent Pool prijava nije pronađena.",
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
      message: "Status Talent Pool prijave je uspešno izmenjen.",
      application: {
        ...mapListItem(application),
        events: application.events,
      },
    });
  } catch (error) {
    console.error("Greška u updateAdminTalentPoolApplicationStatus:", error);
    return res.status(500).json({
      message: "Greška pri izmeni statusa Talent Pool prijave.",
      error: error.message,
    });
  }
};

module.exports = {
  getAdminTalentPoolApplications,
  getAdminTalentPoolApplicationById,
  updateAdminTalentPoolApplicationStatus,
};
