const Application = require("../../models/Application");
const Candidate = require("../../models/Candidate");
const ExcelJS = require("exceljs");
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

const sanitizeExcelCell = (value) => {
  const text = value === undefined || value === null ? "" : String(value);

  if (/^[=+\-@]/.test(text)) {
    return `'${text}`;
  }

  return text;
};

const buildApplicationsFilter = async ({ status, email }) => {
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

  return filter;
};

const mapApplicationListItems = (applications) => {
  return applications.map((application) => ({
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
};

const filterApplicationsBySearch = (items, search) => {
  if (!search) return items;

  return items.filter((item) => {
    const fullName =
      `${item.candidate?.firstName || ""} ${item.candidate?.lastName || ""}`.toLowerCase();
    const emailValue = String(item.candidate?.email || "").toLowerCase();
    const phone = String(item.candidate?.phone || "").toLowerCase();
    const country = String(item.candidate?.country || "").toLowerCase();
    const city = String(item.candidate?.city || "").toLowerCase();
    const companyName = String(item.job?.company?.name || "").toLowerCase();
    const regionName = String(item.job?.region?.name || "").toLowerCase();
    const jobPublicId = String(item.job?.publicId || "").toLowerCase();
    const applicationPublicId = String(item.publicId || "").toLowerCase();

    return (
      fullName.includes(search) ||
      emailValue.includes(search) ||
      phone.includes(search) ||
      country.includes(search) ||
      city.includes(search) ||
      companyName.includes(search) ||
      regionName.includes(search) ||
      jobPublicId.includes(search) ||
      applicationPublicId.includes(search)
    );
  });
};

const getApplicationsList = async ({ status, email, search }) => {
  const filter = await buildApplicationsFilter({ status, email });

  const applications = await Application.find(filter)
    .populate(
      "candidate",
      "publicId firstName lastName email phone country city documents isArchived archivedAt archivedReason"
    )
    .populate({
      path: "job",
      populate: [
        { path: "company", select: "name" },
        { path: "region", select: "name isoCode" },
      ],
    })
    .sort({ createdAt: -1 });

  let result = mapApplicationListItems(applications);
  result = filterApplicationsBySearch(result, search);

  return result;
};


/*
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
*/

const getAdminApplications = async (req, res) => {
  try {
    const status = req.query.status
      ? String(req.query.status).trim().toLowerCase()
      : "";
    const email = req.query.email
      ? String(req.query.email).trim().toLowerCase()
      : "";
    const search = req.query.search
      ? String(req.query.search).trim().toLowerCase()
      : "";

    const result = await getApplicationsList({
      status,
      email,
      search,
    });

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

const exportAdminApplications = async (req, res) => {
  try {
    const status = req.query.status
      ? String(req.query.status).trim().toLowerCase()
      : "";
    const email = req.query.email
      ? String(req.query.email).trim().toLowerCase()
      : "";
    const search = req.query.search
      ? String(req.query.search).trim().toLowerCase()
      : "";

    const applications = await getApplicationsList({
      status,
      email,
      search,
    });

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Zepter Careers Admin";
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet("Applications");

    worksheet.columns = [
      { header: "Application ID", key: "applicationPublicId", width: 22 },
      { header: "Applied at", key: "appliedAt", width: 22 },
      { header: "Status", key: "status", width: 18 },
      { header: "Status label", key: "statusLabel", width: 20 },
      { header: "Reason", key: "reason", width: 35 },
      { header: "Candidate ID", key: "candidatePublicId", width: 20 },
      { header: "First name", key: "firstName", width: 18 },
      { header: "Last name", key: "lastName", width: 18 },
      { header: "Email", key: "email", width: 30 },
      { header: "Phone", key: "phone", width: 18 },
      { header: "Country", key: "country", width: 18 },
      { header: "City", key: "city", width: 18 },
      { header: "Candidate archived", key: "candidateArchived", width: 20 },
      { header: "Job ID", key: "jobPublicId", width: 18 },
      { header: "Company", key: "company", width: 24 },
      { header: "Region", key: "region", width: 22 },
      { header: "CV file", key: "cvFile", width: 32 },
    ];

    applications.forEach((application) => {
      worksheet.addRow({
        applicationPublicId: sanitizeExcelCell(application.publicId),
        appliedAt: application.appliedAt
          ? new Date(application.appliedAt).toLocaleString("sr-RS")
          : "",
        status: sanitizeExcelCell(application.status),
        statusLabel: sanitizeExcelCell(application.statusLabel),
        reason: sanitizeExcelCell(application.reason),
        candidatePublicId: sanitizeExcelCell(application.candidate?.publicId),
        firstName: sanitizeExcelCell(application.candidate?.firstName),
        lastName: sanitizeExcelCell(application.candidate?.lastName),
        email: sanitizeExcelCell(application.candidate?.email),
        phone: sanitizeExcelCell(application.candidate?.phone),
        country: sanitizeExcelCell(application.candidate?.country),
        city: sanitizeExcelCell(application.candidate?.city),
        candidateArchived: application.candidate?.isArchived ? "Yes" : "No",
        jobPublicId: sanitizeExcelCell(application.job?.publicId),
        company: sanitizeExcelCell(application.job?.company?.name),
        region: sanitizeExcelCell(application.job?.region?.name),
        cvFile: sanitizeExcelCell(application.cvDocument?.fileName),
      });
    });

    worksheet.getRow(1).font = { bold: true };
    worksheet.views = [{ state: "frozen", ySplit: 1 }];

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="zepter-applications.xlsx"'
    );

    await workbook.xlsx.write(res);
    return res.end();
  } catch (error) {
    console.error("Greška u exportAdminApplications:", error);
    return res.status(500).json({
      message: "Greška pri exportu prijava.",
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
  exportAdminApplications,
};