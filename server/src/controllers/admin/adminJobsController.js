const Job = require("../../models/Job");
const JobTranslation = require("../../models/JobTranslation");
const Company = require("../../models/Company");
const Region = require("../../models/Region");
const Application = require("../../models/Application");
const { PDFParse } = require("pdf-parse");
const {
  SUPPORTED_LOCALES,
  parseStringArray,
  normalizeLocale,
  isValidObjectId,
} = require("./adminHelpers");
const { sendJobAlertsForPublishedJob } = require("../../services/jobAlertService");
const {
  SELECTABLE_TEXT_ERROR,
  normalizeText,
  parseSerbianJobAdText,
} = require("../../services/jobPdfParserService");

const hasOwn = (source, key) => Object.prototype.hasOwnProperty.call(source, key);

const parseQrEnabled = (value) => {
  if (value === false) {
    return false;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return normalized !== "false" && normalized !== "0";
  }

  if (typeof value === "number") {
    return value !== 0;
  }

  return true;
};

const normalizeQrInput = (body = {}) => {
  const nestedQr = body.qr && typeof body.qr === "object" ? body.qr : {};
  const hasTargetUrl = hasOwn(body, "qrTargetUrl") || hasOwn(nestedQr, "targetUrl");
  const hasIsEnabled = hasOwn(body, "qrTrackingEnabled") || hasOwn(nestedQr, "isEnabled");

  return {
    hasTargetUrl,
    targetUrl: hasOwn(body, "qrTargetUrl")
      ? String(body.qrTargetUrl || "").trim()
      : String(nestedQr.targetUrl || "").trim(),
    hasIsEnabled,
    isEnabled: parseQrEnabled(
      hasOwn(body, "qrTrackingEnabled")
        ? body.qrTrackingEnabled
        : nestedQr.isEnabled
    ),
  };
};

const buildTranslationPayload = (body, localeOverride = null) => {
  const locale = localeOverride || normalizeLocale(body.locale);

  return {
    locale,
    name: body.name ? String(body.name).trim() : "",
    locationLabel: body.locationLabel ? String(body.locationLabel).trim() : "",
    shortDescription: body.shortDescription
      ? String(body.shortDescription).trim()
      : "",
    intro: parseStringArray(body.intro),
    whyThisPosition: body.whyThisPosition
      ? String(body.whyThisPosition).trim()
      : "",
    aboutZepter: body.aboutZepter ? String(body.aboutZepter).trim() : "",
    qualifications: parseStringArray(body.qualifications),
    responsibilities: parseStringArray(body.responsibilities),
    requirements: parseStringArray(body.requirements),
    whatZepterOffers: parseStringArray(body.whatZepterOffers),
    howToApply: parseStringArray(body.howToApply),
    closingText: body.closingText ? String(body.closingText).trim() : "",
    footerNote: body.footerNote ? String(body.footerNote).trim() : "",
    fieldPresence: {
      howToApply: hasOwn(body, "howToApply"),
      closingText: hasOwn(body, "closingText"),
      footerNote: hasOwn(body, "footerNote"),
    },
    applyLabel: body.applyLabel ? String(body.applyLabel).trim() : "Apply",
    notes: body.translationNotes
      ? String(body.translationNotes).trim()
      : body.notes
        ? String(body.notes).trim()
        : "",
  };
};

const normalizeJobInput = (body) => {
  return {
    publicId: body.publicId ? String(body.publicId).trim() : "",
    company: body.company ? String(body.company).trim() : "",
    region: body.region ? String(body.region).trim() : "",
    status: body.status ? String(body.status).trim() : "",
    publishStartAt: body.publishStartAt || null,
    publishEndAt: body.publishEndAt || null,
    notes: body.notes ? String(body.notes).trim() : "",
    workArea: body.workArea ? String(body.workArea).trim() : "",
    employmentType: body.employmentType
      ? String(body.employmentType).trim()
      : "",
    locationType: body.locationType ? String(body.locationType).trim() : "",
  };
};

const findJobByPublicId = async (publicId) => {
  return Job.findOne({ publicId: String(publicId).trim() });
};

const getNextJobPublicId = async () => {
  const latestNumericJob = await Job.aggregate([
    {
      $match: {
        publicId: { $regex: "^\\d+$" },
      },
    },
    {
      $addFields: {
        publicIdNumber: { $toInt: "$publicId" },
      },
    },
    {
      $sort: {
        publicIdNumber: -1,
      },
    },
    {
      $limit: 1,
    },
  ]);

  const lastNumber = latestNumericJob[0]?.publicIdNumber || 0;
  return String(lastNumber + 1);
};

const resolveTranslationForLocale = async (jobId, locale) => {
  let translation = await JobTranslation.findOne({
    job: jobId,
    locale,
  });

  if (!translation && locale !== "en") {
    translation = await JobTranslation.findOne({
      job: jobId,
      locale: "en",
    });
  }

  return translation;
};

const upsertJobTranslation = async (jobObjectId, translationInput) => {
  if (!translationInput.name) {
    return null;
  }

  const existing = await JobTranslation.findOne({
    job: jobObjectId,
    locale: translationInput.locale,
  });

  if (existing) {
    existing.name = translationInput.name;
    existing.locationLabel = translationInput.locationLabel;
    existing.shortDescription = translationInput.shortDescription;
    existing.intro = translationInput.intro;
    existing.whyThisPosition = translationInput.whyThisPosition;
    existing.aboutZepter = translationInput.aboutZepter;
    existing.qualifications = translationInput.qualifications;
    existing.responsibilities = translationInput.responsibilities;
    existing.requirements = translationInput.requirements;
    existing.whatZepterOffers = translationInput.whatZepterOffers;
    if (translationInput.fieldPresence?.howToApply) {
      existing.howToApply = translationInput.howToApply;
    }
    if (translationInput.fieldPresence?.closingText) {
      existing.closingText = translationInput.closingText;
    }
    if (translationInput.fieldPresence?.footerNote) {
      existing.footerNote = translationInput.footerNote;
    }
    existing.applyLabel = translationInput.applyLabel;
    existing.notes = translationInput.notes;
    await existing.save();
    return existing;
  }

  const createInput = { ...translationInput };
  delete createInput.fieldPresence;

  return JobTranslation.create({
    job: jobObjectId,
    ...createInput,
  });
};

const importJobPdf = async (req, res) => {
  let parser = null;

  try {
    if (!req.file) {
      return res.status(400).json({
        message: "PDF file is required under field name pdf.",
      });
    }

    parser = new PDFParse({ data: req.file.buffer });
    const result = await parser.getText();
    const text = normalizeText(result.text || "");

    if (!text || text.length < 50) {
      return res.status(400).json({
        message: SELECTABLE_TEXT_ERROR,
      });
    }

    const parsed = parseSerbianJobAdText(text);

    return res.status(200).json({
      parsed,
      rawTextPreview: text.slice(0, 1000),
    });
  } catch (error) {
    console.error("Greška u importJobPdf:", error);

    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      message:
        statusCode === 400
          ? error.message
          : "Greška pri parsiranju PDF oglasa.",
      error: error.message,
    });
  } finally {
    if (parser) {
      try {
        await parser.destroy();
      } catch (destroyError) {
        console.error("Greška pri zatvaranju PDF parsera:", destroyError);
      }
    }
  }
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
        const translation = await resolveTranslationForLocale(job._id, locale);
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
          workArea: job.workArea || "",
          employmentType: job.employmentType || "",
          locationType: job.locationType || "",
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
    const { publicId } = req.params;
    const locale = normalizeLocale(req.query.locale);

    if (!publicId || !String(publicId).trim()) {
      return res.status(400).json({
        message: "publicId je obavezan.",
      });
    }

    const job = await Job.findOne({
      publicId: String(publicId).trim(),
    })
      .populate("company", "name legalEntity")
      .populate("region", "name isoCode type");

    if (!job) {
      return res.status(404).json({
        message: "Job nije pronađen.",
      });
    }

    const activeTranslation = await resolveTranslationForLocale(job._id, locale);

    const translations = await JobTranslation.find({
      job: job._id,
    }).sort({ locale: 1 });

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
    const normalized = normalizeJobInput(req.body);
    const qrInput = normalizeQrInput(req.body);

    const {
      publicId,
      company,
      region,
      status,
      publishStartAt,
      publishEndAt,
      notes,
      workArea,
      employmentType,
      locationType,
    } = normalized;

    let finalPublicId = publicId;

    if (!finalPublicId) {
      finalPublicId = await getNextJobPublicId();
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

    const existingPublicId = await Job.findOne({ publicId: finalPublicId });
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
      publicId: finalPublicId,
      company,
      region,
      status: status || "draft",
      publishStartAt: publishStartAt || null,
      publishEndAt: publishEndAt || null,
      notes,
      workArea,
      employmentType,
      locationType: locationType || "onsite",
      qr: {
        targetUrl: qrInput.hasTargetUrl ? qrInput.targetUrl : "",
        isEnabled: qrInput.hasIsEnabled ? qrInput.isEnabled : true,
      },
    });

    const translationPayload = buildTranslationPayload(req.body);
    let translation = null;

    if (translationPayload.name) {
      translation = await upsertJobTranslation(job._id, translationPayload);
    }

    let alertResult = null;

    if (job.status === "published") {
      alertResult = await sendJobAlertsForPublishedJob(job);
    }

    return res.status(201).json({
      message: "Job je uspešno kreiran.",
      job,
      translation,
      alerts: alertResult,
    });
  } catch (error) {
    console.error("Greška u createAdminJob:", error);

    if (error.code === 11000 && error.keyPattern?.publicId) {
      return res.status(409).json({
        message: "Job publicId already exists. Please try again.",
      });
    }

    return res.status(500).json({
      message: "Greška pri kreiranju job-a.",
      error: error.message,
    });
  }
};

const updateAdminJob = async (req, res) => {
  try {
    const { publicId } = req.params;

    if (!publicId || !String(publicId).trim()) {
      return res.status(400).json({
        message: "publicId je obavezan.",
      });
    }

    const job = await findJobByPublicId(publicId);

    if (!job) {
      return res.status(404).json({
        message: "Job nije pronađen.",
      });
    }

    const previousStatus = job.status;

    const {
      publicId: nextPublicId,
      company,
      region,
      status,
      publishStartAt,
      publishEndAt,
      notes,
      locale,
      workArea,
      employmentType,
      locationType,
    } = normalizeJobInput(req.body);
    const qrInput = normalizeQrInput(req.body);

    if (nextPublicId && nextPublicId !== job.publicId) {
      const duplicatePublicId = await Job.findOne({
        publicId: nextPublicId,
        _id: { $ne: job._id },
      });

      if (duplicatePublicId) {
        return res.status(409).json({
          message: "Drugi job već koristi ovaj publicId.",
        });
      }

      job.publicId = nextPublicId;
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

    if (status) {
      job.status = status;
    }

    if (req.body.publishStartAt !== undefined) {
      job.publishStartAt = publishStartAt || null;
    }

    if (req.body.publishEndAt !== undefined) {
      job.publishEndAt = publishEndAt || null;
    }

    if (typeof req.body.notes === "string") {
      job.notes = notes;
    }

    if (typeof req.body.workArea === "string") {
      job.workArea = workArea;
    }

    if (typeof req.body.employmentType === "string") {
      job.employmentType = employmentType;
    }

    if (typeof req.body.locationType === "string") {
      job.locationType = locationType || "onsite";
    }

    if (qrInput.hasTargetUrl) {
      job.set("qr.targetUrl", qrInput.targetUrl);
    }

    if (qrInput.hasIsEnabled) {
      job.set("qr.isEnabled", qrInput.isEnabled);
    }

    await job.save();

    let alertResult = null;

    if (previousStatus !== "published" && job.status === "published") {
      alertResult = await sendJobAlertsForPublishedJob(job);
    }

    const translationPayload = buildTranslationPayload(req.body, locale || undefined);
    let translation = null;

    if (translationPayload.name) {
      translation = await upsertJobTranslation(job._id, translationPayload);
    }

    return res.status(200).json({
      message: "Job je uspešno izmenjen.",
      job,
      translation,
      alerts: alertResult,
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
    const { publicId } = req.params;
    const { publishStartAt, publishEndAt } = req.body;

    if (!publicId || !String(publicId).trim()) {
      return res.status(400).json({
        message: "publicId je obavezan.",
      });
    }

    const job = await findJobByPublicId(publicId);

    if (!job) {
      return res.status(404).json({
        message: "Job nije pronađen.",
      });
    }

    job.status = "published";
    job.publishStartAt = publishStartAt || new Date();
    job.publishEndAt = publishEndAt || null;

    await job.save();

    const alertResult = await sendJobAlertsForPublishedJob(job);

    return res.status(200).json({
      message: "Job je uspešno repostovan.",
      job,
      alerts: alertResult,
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
    const { publicId } = req.params;

    if (!publicId || !String(publicId).trim()) {
      return res.status(400).json({
        message: "publicId je obavezan.",
      });
    }

    const job = await findJobByPublicId(publicId);

    if (!job) {
      return res.status(404).json({
        message: "Job nije pronađen.",
      });
    }

    const applicationsCount = await Application.countDocuments({
      job: job._id,
    });

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
  importJobPdf,
  getAdminJobs,
  getAdminJobById,
  createAdminJob,
  updateAdminJob,
  repostAdminJob,
  deleteAdminJob,
};
