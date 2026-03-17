const Job = require("../../models/Job");
const JobTranslation = require("../../models/JobTranslation");
const Company = require("../../models/Company");
const Region = require("../../models/Region");
const Application = require("../../models/Application");
const {
  SUPPORTED_LOCALES,
  parseStringArray,
  normalizeLocale,
  isValidObjectId,
} = require("./adminHelpers");

const buildTranslationPayload = (body, localeOverride = null) => {
  const locale = localeOverride || normalizeLocale(body.locale);

  return {
    locale,
    name: body.name ? String(body.name).trim() : "",
    locationOrLink: body.locationOrLink ? String(body.locationOrLink).trim() : "",
    whyThisPosition: body.whyThisPosition ? String(body.whyThisPosition).trim() : "",
    aboutZepter: body.aboutZepter ? String(body.aboutZepter).trim() : "",
    responsibilities: parseStringArray(body.responsibilities),
    requirements: parseStringArray(body.requirements),
    whatZepterOffers: parseStringArray(body.whatZepterOffers),
    applyLabel: body.applyLabel ? String(body.applyLabel).trim() : "Apply",
    notes: body.translationNotes ? String(body.translationNotes).trim() : (body.notes ? String(body.notes).trim() : ""),
  };
};

const upsertJobTranslation = async (jobId, translationInput) => {
  if (!translationInput.name) {
    return null;
  }

  const existing = await JobTranslation.findOne({
    job: jobId,
    locale: translationInput.locale,
  });

  if (existing) {
    existing.name = translationInput.name;
    existing.locationOrLink = translationInput.locationOrLink;
    existing.whyThisPosition = translationInput.whyThisPosition;
    existing.aboutZepter = translationInput.aboutZepter;
    existing.responsibilities = translationInput.responsibilities;
    existing.requirements = translationInput.requirements;
    existing.whatZepterOffers = translationInput.whatZepterOffers;
    existing.applyLabel = translationInput.applyLabel;
    existing.notes = translationInput.notes;
    await existing.save();
    return existing;
  }

  return JobTranslation.create({
    job: jobId,
    ...translationInput,
  });
};

const getAdminJobs = async (req, res) => {
  try {
    const locale = normalizeLocale(req.query.locale);

    const jobs = await Job.find({})
      .populate("company", "name")
      .populate("region", "name isoCode")
      .sort({ publicId: -1, createdAt: -1 });

    const result = await Promise.all(
      jobs.map(async (job) => {
        let translation = await JobTranslation.findOne({ job: job._id, locale });

        if (!translation) {
          translation = await JobTranslation.findOne({ job: job._id, locale: "en" });
        }

        const fallbackName = translation?.name || "(No translation)";

        return {
          _id: job._id,
          publicId: job.publicId,
          name: fallbackName,
          localeUsed: translation?.locale || null,
          company: job.company,
          region: job.region,
          status: job.status,
          publishStartAt: job.publishStartAt,
          publishEndAt: job.publishEndAt,
          appliedCount: job.appliedCount,
          notes: job.notes,
        };
      })
    );

    return res.status(200).json({
      supportedLocales: SUPPORTED_LOCALES,
      jobs: result,
    });
  } catch (error) {
    console.error("Greška u getAdminJobs:", error);
    return res.status(500).json({
      message: "Greška pri dohvatanju admin jobs liste.",
      error: error.message,
    });
  }
};

const getAdminJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const locale = normalizeLocale(req.query.locale);

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: "Job id nije validan.",
      });
    }

    const job = await Job.findById(id)
      .populate("company", "name legalEntity")
      .populate("region", "name isoCode type");

    if (!job) {
      return res.status(404).json({
        message: "Job nije pronađen.",
      });
    }

    let activeTranslation = await JobTranslation.findOne({
      job: job._id,
      locale,
    });

    if (!activeTranslation) {
      activeTranslation = await JobTranslation.findOne({
        job: job._id,
        locale: "en",
      });
    }

    const translations = await JobTranslation.find({ job: job._id }).sort({ locale: 1 });

    return res.status(200).json({
      supportedLocales: SUPPORTED_LOCALES,
      job,
      activeTranslation,
      translations,
    });
  } catch (error) {
    console.error("Greška u getAdminJobById:", error);
    return res.status(500).json({
      message: "Greška pri dohvatanju job detalja.",
      error: error.message,
    });
  }
};

const createAdminJob = async (req, res) => {
  try {
    const {
      publicId,
      company,
      region,
      status,
      publishStartAt,
      publishEndAt,
      notes,
    } = req.body;

    if (!publicId || !String(publicId).trim()) {
      return res.status(400).json({
        message: "publicId je obavezan.",
      });
    }

    if (!company || !region) {
      return res.status(400).json({
        message: "company i region su obavezni.",
      });
    }

    if (!isValidObjectId(company) || !isValidObjectId(region)) {
      return res.status(400).json({
        message: "company ili region nisu validni ObjectId.",
      });
    }

    const existingPublicId = await Job.findOne({ publicId: String(publicId).trim() });
    if (existingPublicId) {
      return res.status(409).json({
        message: "Job sa ovim publicId već postoji.",
      });
    }

    const existingCompany = await Company.findById(company);
    const existingRegion = await Region.findById(region);

    if (!existingCompany || !existingRegion) {
      return res.status(404).json({
        message: "Kompanija ili region nisu pronađeni.",
      });
    }

    const job = await Job.create({
      publicId: String(publicId).trim(),
      company,
      region,
      status: status || "draft",
      publishStartAt: publishStartAt || null,
      publishEndAt: publishEndAt || null,
      notes: notes ? String(notes).trim() : "",
    });

    const translationPayload = buildTranslationPayload(req.body);

    let translation = null;
    if (translationPayload.name) {
      translation = await upsertJobTranslation(job._id, translationPayload);
    }

    return res.status(201).json({
      message: "Job je uspešno kreiran.",
      job,
      translation,
    });
  } catch (error) {
    console.error("Greška u createAdminJob:", error);
    return res.status(500).json({
      message: "Greška pri kreiranju job-a.",
      error: error.message,
    });
  }
};

const updateAdminJob = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: "Job id nije validan.",
      });
    }

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        message: "Job nije pronađen.",
      });
    }

    const {
      publicId,
      company,
      region,
      status,
      publishStartAt,
      publishEndAt,
      notes,
      locale,
    } = req.body;

    if (typeof publicId === "string" && publicId.trim() !== job.publicId) {
      const duplicatePublicId = await Job.findOne({
        publicId: publicId.trim(),
        _id: { $ne: job._id },
      });

      if (duplicatePublicId) {
        return res.status(409).json({
          message: "Drugi job već koristi ovaj publicId.",
        });
      }

      job.publicId = publicId.trim();
    }

    if (company) {
      if (!isValidObjectId(company)) {
        return res.status(400).json({
          message: "company nije validan ObjectId.",
        });
      }

      const existingCompany = await Company.findById(company);
      if (!existingCompany) {
        return res.status(404).json({
          message: "Kompanija nije pronađena.",
        });
      }

      job.company = company;
    }

    if (region) {
      if (!isValidObjectId(region)) {
        return res.status(400).json({
          message: "region nije validan ObjectId.",
        });
      }

      const existingRegion = await Region.findById(region);
      if (!existingRegion) {
        return res.status(404).json({
          message: "Region nije pronađen.",
        });
      }

      job.region = region;
    }

    if (typeof status === "string") {
      job.status = status;
    }

    if (publishStartAt !== undefined) {
      job.publishStartAt = publishStartAt || null;
    }

    if (publishEndAt !== undefined) {
      job.publishEndAt = publishEndAt || null;
    }

    if (typeof notes === "string") {
      job.notes = notes.trim();
    }

    await job.save();

    const translationPayload = buildTranslationPayload(req.body, locale || undefined);
    let translation = null;

    if (translationPayload.name) {
      translation = await upsertJobTranslation(job._id, translationPayload);
    }

    return res.status(200).json({
      message: "Job je uspešno izmenjen.",
      job,
      translation,
    });
  } catch (error) {
    console.error("Greška u updateAdminJob:", error);
    return res.status(500).json({
      message: "Greška pri izmeni job-a.",
      error: error.message,
    });
  }
};

const repostAdminJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { publishStartAt, publishEndAt } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: "Job id nije validan.",
      });
    }

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        message: "Job nije pronađen.",
      });
    }

    job.status = "published";
    job.publishStartAt = publishStartAt || new Date();
    job.publishEndAt = publishEndAt || null;

    await job.save();

    return res.status(200).json({
      message: "Job je uspešno repostovan.",
      job,
    });
  } catch (error) {
    console.error("Greška u repostAdminJob:", error);
    return res.status(500).json({
      message: "Greška pri repostovanju job-a.",
      error: error.message,
    });
  }
};

const deleteAdminJob = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: "Job id nije validan.",
      });
    }

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        message: "Job nije pronađen.",
      });
    }

    const applicationsCount = await Application.countDocuments({ job: job._id });

    if (applicationsCount > 0) {
      return res.status(409).json({
        message: "Job ne može da se obriše jer ima prijave.",
      });
    }

    await JobTranslation.deleteMany({ job: job._id });
    await job.deleteOne();

    return res.status(200).json({
      message: "Job je uspešno obrisan.",
    });
  } catch (error) {
    console.error("Greška u deleteAdminJob:", error);
    return res.status(500).json({
      message: "Greška pri brisanju job-a.",
      error: error.message,
    });
  }
};

module.exports = {
  getAdminJobs,
  getAdminJobById,
  createAdminJob,
  updateAdminJob,
  repostAdminJob,
  deleteAdminJob,
};