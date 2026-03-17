const mongoose = require("mongoose");
const Candidate = require("../../models/Candidate");
const Application = require("../../models/Application");
require("../../models/Job");
require("../../models/Company");
require("../../models/Region");

const { formatStatusLabel } = require("./adminApplicationHelpers");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const getAdminCandidates = async (req, res) => {
  try {
    const email = req.query.email ? String(req.query.email).trim().toLowerCase() : "";
    const search = req.query.search ? String(req.query.search).trim().toLowerCase() : "";

    const filter = {};

    if (email) {
      filter.email = { $regex: email, $options: "i" };
    }

    let candidates = await Candidate.find(filter).sort({ email: 1 });

    if (search) {
      candidates = candidates.filter((candidate) => {
        const fullName =
          `${candidate.firstName || ""} ${candidate.lastName || ""}`.toLowerCase();
        const emailValue = String(candidate.email || "").toLowerCase();

        return fullName.includes(search) || emailValue.includes(search);
      });
    }

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

const getAdminCandidateById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: "Candidate id nije validan.",
      });
    }

    const candidate = await Candidate.findById(id);

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

    const mappedApplications = applications.map((application) => ({
      _id: application._id,
      appliedAt: application.createdAt,
      status: application.status,
      statusLabel: formatStatusLabel(application.status),
      reason: application.reason,
      job: application.job,
    }));

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

module.exports = {
  getAdminCandidates,
  getAdminCandidateById,
};