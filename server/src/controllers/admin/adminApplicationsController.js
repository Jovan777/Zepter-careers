const Application = require("../../models/Application");
const Candidate = require("../../models/Candidate");
require("../../models/Job");
require("../../models/Company");
require("../../models/Region");

const {
  APPLICATION_STATUSES,
  formatStatusLabel,
} = require("./adminApplicationHelpers");

const findApplicationByPublicId = async (publicId) => {
  return Application.findOne({ publicId: String(publicId).trim() });
};

const getAdminApplications = async (req, res) => {
  try {
    const status = req.query.status ? String(req.query.status).trim().toLowerCase() : "";
    const email = req.query.email ? String(req.query.email).trim().toLowerCase() : "";
    const search = req.query.search ? String(req.query.search).trim().toLowerCase() : "";

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (email) {
      const emailCandidates = await Candidate.find({
        email: { $regex: email, $options: "i" },
      }).select("_id");

      const candidateIdsFromEmail = emailCandidates.map((c) => c._id);
      filter.candidate = { $in: candidateIdsFromEmail };
    }

    const applications = await Application.find(filter)
      .populate("candidate", "firstName lastName email phone country city documents")
      .populate({
        path: "job",
        populate: [
          { path: "company", select: "name" },
          { path: "region", select: "name isoCode" },
        ],
      })
      .sort({ createdAt: -1 });

    let result = applications.map((application) => ({
      _id: application._id,
      publicId: application.publicId,
      appliedAt: application.createdAt,
      candidate: application.candidate,
      job: application.job,
      status: application.status,
      statusLabel: formatStatusLabel(application.status),
      reason: application.reason,
      cvDocument: application.cvDocument,
    }));

    if (search) {
      result = result.filter((item) => {
        const fullName =
          `${item.candidate?.firstName || ""} ${item.candidate?.lastName || ""}`.toLowerCase();
        const emailValue = String(item.candidate?.email || "").toLowerCase();
        const companyName = String(item.job?.company?.name || "").toLowerCase();
        const regionName = String(item.job?.region?.name || "").toLowerCase();
        const jobPublicId = String(item.job?.publicId || "").toLowerCase();
        const applicationPublicId = String(item.publicId || "").toLowerCase();

        return (
          fullName.includes(search) ||
          emailValue.includes(search) ||
          companyName.includes(search) ||
          regionName.includes(search) ||
          jobPublicId.includes(search) ||
          applicationPublicId.includes(search)
        );
      });
    }

    return res.status(200).json({
      statuses: APPLICATION_STATUSES,
      applications: result,
    });
  } catch (error) {
    console.error("Greška u getAdminApplications:", error);
    return res.status(500).json({
      message: "Greška pri dohvatanju prijava.",
      error: error.message,
    });
  }
};

const getAdminApplicationById = async (req, res) => {
  try {
    const { publicId } = req.params;

    if (!publicId || !String(publicId).trim()) {
      return res.status(400).json({
        message: "publicId je obavezan.",
      });
    }

    const application = await Application.findOne({
      publicId: String(publicId).trim(),
    })
      .populate("candidate", "firstName lastName email phone country city documents")
      .populate({
        path: "job",
        populate: [
          { path: "company", select: "name" },
          { path: "region", select: "name isoCode" },
        ],
      });

    if (!application) {
      return res.status(404).json({
        message: "Application nije pronađen.",
      });
    }

    return res.status(200).json({
  application: {
    _id: application._id,
    publicId: application.publicId,
    appliedAt: application.createdAt,
    candidate: application.candidate,
    job: application.job,
    status: application.status,
    statusLabel: formatStatusLabel(application.status),
    reason: application.reason,
    cvDocument: application.cvDocument,
    extraDocuments: application.extraDocuments,
    events: [...application.events].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    ),
  },
});
  } catch (error) {
    console.error("Greška u getAdminApplicationById:", error);
    return res.status(500).json({
      message: "Greška pri dohvatanju application detalja.",
      error: error.message,
    });
  }
};

const updateAdminApplicationStatus = async (req, res) => {
  try {
    const { publicId } = req.params;
    const { status, reason } = req.body;

    if (!publicId || !String(publicId).trim()) {
      return res.status(400).json({
        message: "publicId je obavezan.",
      });
    }

    if (!status || !APPLICATION_STATUSES.includes(String(status).trim().toLowerCase())) {
      return res.status(400).json({
        message: "Status nije validan.",
      });
    }

    const application = await findApplicationByPublicId(publicId);

    if (!application) {
      return res.status(404).json({
        message: "Application nije pronađen.",
      });
    }

    const nextStatus = String(status).trim().toLowerCase();
    const prevStatus = application.status;

    application.status = nextStatus;
    application.reason = typeof reason === "string" ? reason.trim() : application.reason;

    application.events.unshift({
      type: "status_changed",
      timestamp: new Date(),
      data: {
        to: nextStatus,
        from: prevStatus,
        reason: typeof reason === "string" ? reason.trim() : "",
      },
    });

    await application.save();

    return res.status(200).json({
      message: "Status prijave je uspešno izmenjen.",
      application: {
        _id: application._id,
        publicId: application.publicId,
        status: application.status,
        statusLabel: formatStatusLabel(application.status),
        reason: application.reason,
        events: application.events,
      },
    });
  } catch (error) {
    console.error("Greška u updateAdminApplicationStatus:", error);
    return res.status(500).json({
      message: "Greška pri izmeni statusa prijave.",
      error: error.message,
    });
  }
};

module.exports = {
  getAdminApplications,
  getAdminApplicationById,
  updateAdminApplicationStatus,
};