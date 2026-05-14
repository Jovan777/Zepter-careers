const ExcelJS = require("exceljs");
const Candidate = require("../../models/Candidate");
const Application = require("../../models/Application");
const JobTranslation = require("../../models/JobTranslation");
require("../../models/Job");
require("../../models/Company");
require("../../models/Region");

const { formatStatusLabel } = require("./adminApplicationHelpers");

const findCandidateByPublicId = async (publicId) => {
  return Candidate.findOne({ publicId: String(publicId).trim() });
};

const normalizeText = (value) => String(value || "").trim();

const sanitizeExcelCell = (value) => {
  const text = value === undefined || value === null ? "" : String(value);

  // Zaštita od Excel formula injection.
  if (/^[=+\-@]/.test(text)) {
    return `'${text}`;
  }

  return text;
};

const buildCandidateFilter = ({ email, archived }) => {
  const filter = {};

  if (archived) {
    filter.isArchived = true;
  } else {
    filter.isArchived = { $ne: true };
  }

  if (email) {
    filter.email = { $regex: email, $options: "i" };
  }

  return filter;
};

const getJobPositionName = async (jobId, preferredLocale = "sr") => {
  if (!jobId) return "";

  let translation = await JobTranslation.findOne({
    job: jobId,
    locale: preferredLocale,
  }).select("name locale");

  if (!translation && preferredLocale !== "en") {
    translation = await JobTranslation.findOne({
      job: jobId,
      locale: "en",
    }).select("name locale");
  }

  if (!translation) {
    translation = await JobTranslation.findOne({
      job: jobId,
    })
      .sort({ locale: 1 })
      .select("name locale");
  }

  return translation?.name || "";
};

const filterCandidatesBySearch = (candidates, search) => {
  if (!search) return candidates;

  return candidates.filter((candidate) => {
    const fullName =
      `${candidate.firstName || ""} ${candidate.lastName || ""}`.toLowerCase();
    const emailValue = String(candidate.email || "").toLowerCase();
    const publicId = String(candidate.publicId || "").toLowerCase();
    const phone = String(candidate.phone || "").toLowerCase();
    const country = String(candidate.country || "").toLowerCase();
    const city = String(candidate.city || "").toLowerCase();

    return (
      fullName.includes(search) ||
      emailValue.includes(search) ||
      publicId.includes(search) ||
      phone.includes(search) ||
      country.includes(search) ||
      city.includes(search)
    );
  });
};

const getCandidatesList = async ({ email, search, archived }) => {
  const filter = buildCandidateFilter({ email, archived });

  let candidates = await Candidate.find(filter).sort(
    archived ? { archivedAt: -1, email: 1 } : { email: 1 }
  );

  candidates = filterCandidatesBySearch(candidates, search);

  return candidates;
};

const getAdminCandidates = async (req, res) => {
  try {
    const email = req.query.email
      ? String(req.query.email).trim().toLowerCase()
      : "";
    const search = req.query.search
      ? String(req.query.search).trim().toLowerCase()
      : "";

    const candidates = await getCandidatesList({
      email,
      search,
      archived: false,
    });

    return res.status(200).json({
      candidates,
    });
  } catch (error) {
    console.error("Greška u getAdminCandidates:", error);
    return res.status(500).json({
      message: "Greška pri dohvatanju kandidata.",
      error: error.message,
    });
  }
};

const getAdminArchivedCandidates = async (req, res) => {
  try {
    const email = req.query.email
      ? String(req.query.email).trim().toLowerCase()
      : "";
    const search = req.query.search
      ? String(req.query.search).trim().toLowerCase()
      : "";

    const candidates = await getCandidatesList({
      email,
      search,
      archived: true,
    });

    return res.status(200).json({
      candidates,
    });
  } catch (error) {
    console.error("Greška u getAdminArchivedCandidates:", error);
    return res.status(500).json({
      message: "Greška pri dohvatanju arhiviranih kandidata.",
      error: error.message,
    });
  }
};

const getAdminCandidateById = async (req, res) => {
  try {
    const { publicId } = req.params;

    if (!publicId || !String(publicId).trim()) {
      return res.status(400).json({
        message: "publicId je obavezan.",
      });
    }

    const candidate = await Candidate.findOne({
      publicId: String(publicId).trim(),
    }).populate("archivedBy", "email role");

    if (!candidate) {
      return res.status(404).json({
        message: "Kandidat nije pronađen.",
      });
    }

    const applications = await Application.find({
      candidate: candidate._id,
    })
      .populate({
        path: "job",
        populate: [
          { path: "company", select: "name" },
          { path: "region", select: "name isoCode" },
        ],
      })
      .sort({ createdAt: -1 });

    const mappedApplications = await Promise.all(
      applications.map(async (application) => {
        const jobObject = application.job?.toObject
          ? application.job.toObject()
          : application.job;

        const positionName = await getJobPositionName(
          application.job?._id,
          "sr"
        );

        return {
          _id: application._id,
          publicId: application.publicId,
          createdAt: application.createdAt,
          appliedAt: application.createdAt,
          status: application.status,
          statusLabel: formatStatusLabel(application.status),
          reason: application.reason,
          job: jobObject
            ? {
              ...jobObject,
              positionName,
            }
            : null,
        };
      })
    );

    return res.status(200).json({
      candidate,
      applications: mappedApplications,
    });
  } catch (error) {
    console.error("Greška u getAdminCandidateById:", error);
    return res.status(500).json({
      message: "Greška pri dohvatanju detalja kandidata.",
      error: error.message,
    });
  }
};

const archiveAdminCandidate = async (req, res) => {
  try {
    const { publicId } = req.params;
    const reason = normalizeText(req.body?.reason);

    if (!publicId || !String(publicId).trim()) {
      return res.status(400).json({
        message: "publicId je obavezan.",
      });
    }

    const candidate = await findCandidateByPublicId(publicId);

    if (!candidate) {
      return res.status(404).json({
        message: "Kandidat nije pronađen.",
      });
    }

    candidate.isArchived = true;
    candidate.archivedAt = new Date();
    candidate.archivedReason = reason;
    candidate.archivedBy = req.admin?._id || null;
    candidate.restoredAt = null;

    await candidate.save();

    return res.status(200).json({
      message: "Kandidat je uspešno arhiviran.",
      candidate,
    });
  } catch (error) {
    console.error("Greška u archiveAdminCandidate:", error);
    return res.status(500).json({
      message: "Greška pri arhiviranju kandidata.",
      error: error.message,
    });
  }
};

const restoreAdminCandidate = async (req, res) => {
  try {
    const { publicId } = req.params;

    if (!publicId || !String(publicId).trim()) {
      return res.status(400).json({
        message: "publicId je obavezan.",
      });
    }

    const candidate = await findCandidateByPublicId(publicId);

    if (!candidate) {
      return res.status(404).json({
        message: "Kandidat nije pronađen.",
      });
    }

    candidate.isArchived = false;
    candidate.archivedAt = null;
    candidate.archivedReason = "";
    candidate.archivedBy = null;
    candidate.restoredAt = new Date();

    await candidate.save();

    return res.status(200).json({
      message: "Kandidat je uspešno vraćen među aktivne.",
      candidate,
    });
  } catch (error) {
    console.error("Greška u restoreAdminCandidate:", error);
    return res.status(500).json({
      message: "Greška pri vraćanju kandidata.",
      error: error.message,
    });
  }
};

const exportCandidatesToExcel = async (req, res, archived) => {
  try {
    const email = req.query.email
      ? String(req.query.email).trim().toLowerCase()
      : "";
    const search = req.query.search
      ? String(req.query.search).trim().toLowerCase()
      : "";

    const candidates = await getCandidatesList({
      email,
      search,
      archived,
    });

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Zepter Careers Admin";
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet(
      archived ? "Archived Candidates" : "Active Candidates"
    );

    worksheet.columns = [
      { header: "Public ID", key: "publicId", width: 18 },
      { header: "First name", key: "firstName", width: 18 },
      { header: "Last name", key: "lastName", width: 18 },
      { header: "Email", key: "email", width: 30 },
      { header: "Phone", key: "phone", width: 18 },
      { header: "Country", key: "country", width: 18 },
      { header: "City", key: "city", width: 18 },
      { header: "Marketing consent", key: "marketingConsent", width: 18 },
      { header: "Accepted terms", key: "acceptedTerms", width: 18 },
      { header: "Created at", key: "createdAt", width: 22 },
      { header: "Archived", key: "isArchived", width: 14 },
      { header: "Archived at", key: "archivedAt", width: 22 },
      { header: "Archive reason", key: "archivedReason", width: 35 },
    ];

    candidates.forEach((candidate) => {
      worksheet.addRow({
        publicId: sanitizeExcelCell(candidate.publicId),
        firstName: sanitizeExcelCell(candidate.firstName),
        lastName: sanitizeExcelCell(candidate.lastName),
        email: sanitizeExcelCell(candidate.email),
        phone: sanitizeExcelCell(candidate.phone),
        country: sanitizeExcelCell(candidate.country),
        city: sanitizeExcelCell(candidate.city),
        marketingConsent: candidate.marketingConsent ? "Yes" : "No",
        acceptedTerms: candidate.acceptedTerms ? "Yes" : "No",
        createdAt: candidate.createdAt
          ? new Date(candidate.createdAt).toLocaleString("sr-RS")
          : "",
        isArchived: candidate.isArchived ? "Yes" : "No",
        archivedAt: candidate.archivedAt
          ? new Date(candidate.archivedAt).toLocaleString("sr-RS")
          : "",
        archivedReason: sanitizeExcelCell(candidate.archivedReason),
      });
    });

    worksheet.getRow(1).font = { bold: true };
    worksheet.views = [{ state: "frozen", ySplit: 1 }];

    const fileName = archived
      ? "zepter-archived-candidates.xlsx"
      : "zepter-active-candidates.xlsx";

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    await workbook.xlsx.write(res);
    return res.end();
  } catch (error) {
    console.error("Greška u exportCandidatesToExcel:", error);
    return res.status(500).json({
      message: "Greška pri exportu kandidata.",
      error: error.message,
    });
  }
};

const exportAdminCandidates = async (req, res) => {
  return exportCandidatesToExcel(req, res, false);
};

const exportAdminArchivedCandidates = async (req, res) => {
  return exportCandidatesToExcel(req, res, true);
};

module.exports = {
  getAdminCandidates,
  getAdminArchivedCandidates,
  getAdminCandidateById,
  archiveAdminCandidate,
  restoreAdminCandidate,
  exportAdminCandidates,
  exportAdminArchivedCandidates,
};