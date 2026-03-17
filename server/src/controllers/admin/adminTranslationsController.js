const Job = require("../../models/Job");
const JobTranslation = require("../../models/JobTranslation");
require("../../models/Company");
require("../../models/Region");

const {
  SUPPORTED_LOCALES,
  parseStringArray,
  normalizeLocale,
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
    notes: body.notes ? String(body.notes).trim() : "",
  };
};

const findJobByPublicId = async (publicId) => {
  return Job.findOne({ publicId: String(publicId).trim() });
};

const upsertTranslation = async (jobObjectId, locale, body) => {
  const payload = buildTranslationPayload(body, locale);

  if (!payload.name) {
    throw new Error("Naziv prevoda je obavezan.");
  }

  let translation = await JobTranslation.findOne({
    job: jobObjectId,
    locale: payload.locale,
  });

  if (!translation) {
    translation = await JobTranslation.create({
      job: jobObjectId,
      ...payload,
    });
    return translation;
  }

  translation.name = payload.name;
  translation.locationOrLink = payload.locationOrLink;
  translation.whyThisPosition = payload.whyThisPosition;
  translation.aboutZepter = payload.aboutZepter;
  translation.responsibilities = payload.responsibilities;
  translation.requirements = payload.requirements;
  translation.whatZepterOffers = payload.whatZepterOffers;
  translation.applyLabel = payload.applyLabel;
  translation.notes = payload.notes;

  await translation.save();
  return translation;
};

const getTranslationJobs = async (req, res) => {
  try {
    const locale = normalizeLocale(req.query.locale);

    const jobs = await Job.find({})
      .populate("company", "name")
      .populate("region", "name")
      .sort({ publicId: -1 });

    const items = await Promise.all(
      jobs.map(async (job) => {
        let translation = await JobTranslation.findOne({
          job: job._id,
          locale,
        });

        if (!translation) {
          translation = await JobTranslation.findOne({
            job: job._id,
            locale: "en",
          });
        }

        return {
          _id: job._id,
          publicId: job.publicId,
          name: translation?.name || "(No translation)",
          localeUsed: translation?.locale || null,
          company: job.company?.name || "",
          region: job.region?.name || "",
        };
      })
    );

    return res.status(200).json({
      supportedLocales: SUPPORTED_LOCALES,
      jobs: items,
    });
  } catch (error) {
    console.error("Greška u getTranslationJobs:", error);
    return res.status(500).json({
      message: "Greška pri dohvatanju jobs za translation manager.",
      error: error.message,
    });
  }
};

const getJobTranslationsOverview = async (req, res) => {
  try {
    const { publicId } = req.params;

    if (!publicId || !String(publicId).trim()) {
      return res.status(400).json({
        message: "publicId je obavezan.",
      });
    }

    const job = await Job.findOne({
      publicId: String(publicId).trim(),
    })
      .populate("company", "name")
      .populate("region", "name isoCode");

    if (!job) {
      return res.status(404).json({
        message: "Job nije pronađen.",
      });
    }

    const translations = await JobTranslation.find({
      job: job._id,
    }).sort({ locale: 1 });

    const matrix = translations.map((t) => ({
      locale: t.locale,
      name: t.name,
      whyThisPosition: t.whyThisPosition,
      aboutZepter: t.aboutZepter,
      responsibilities: t.responsibilities,
      requirements: t.requirements,
      whatZepterOffers: t.whatZepterOffers,
      applyLabel: t.applyLabel,
      notes: t.notes,
    }));

    return res.status(200).json({
      supportedLocales: SUPPORTED_LOCALES,
      job,
      translations,
      matrix,
    });
  } catch (error) {
    console.error("Greška u getJobTranslationsOverview:", error);
    return res.status(500).json({
      message: "Greška pri dohvatanju translation manager pregleda.",
      error: error.message,
    });
  }
};

const getJobTranslationByLocale = async (req, res) => {
  try {
    const { publicId, locale } = req.params;

    if (!publicId || !String(publicId).trim()) {
      return res.status(400).json({
        message: "publicId je obavezan.",
      });
    }

    const job = await Job.findOne({
      publicId: String(publicId).trim(),
    })
      .populate("company", "name")
      .populate("region", "name isoCode");

    if (!job) {
      return res.status(404).json({
        message: "Job nije pronađen.",
      });
    }

    const translation = await JobTranslation.findOne({
      job: job._id,
      locale: normalizeLocale(locale),
    });

    if (!translation) {
      return res.status(404).json({
        message: "Prevod nije pronađen.",
      });
    }

    return res.status(200).json({
      job,
      translation,
    });
  } catch (error) {
    console.error("Greška u getJobTranslationByLocale:", error);
    return res.status(500).json({
      message: "Greška pri dohvatanju prevoda.",
      error: error.message,
    });
  }
};

const saveJobTranslation = async (req, res) => {
  try {
    const { publicId } = req.params;
    const locale = normalizeLocale(req.body.locale);

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

    const translation = await upsertTranslation(job._id, locale, req.body);

    return res.status(200).json({
      message: "Prevod je uspešno sačuvan.",
      translation,
    });
  } catch (error) {
    console.error("Greška u saveJobTranslation:", error);
    return res.status(500).json({
      message: "Greška pri čuvanju prevoda.",
      error: error.message,
    });
  }
};

const updateJobTranslationByLocale = async (req, res) => {
  try {
    const { publicId, locale } = req.params;

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

    const translation = await upsertTranslation(
      job._id,
      normalizeLocale(locale),
      req.body
    );

    return res.status(200).json({
      message: "Prevod je uspešno izmenjen.",
      translation,
    });
  } catch (error) {
    console.error("Greška u updateJobTranslationByLocale:", error);
    return res.status(500).json({
      message: "Greška pri izmeni prevoda.",
      error: error.message,
    });
  }
};

const deleteJobTranslationByLocale = async (req, res) => {
  try {
    const { publicId, locale } = req.params;

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

    const translation = await JobTranslation.findOne({
      job: job._id,
      locale: normalizeLocale(locale),
    });

    if (!translation) {
      return res.status(404).json({
        message: "Prevod nije pronađen.",
      });
    }

    await translation.deleteOne();

    return res.status(200).json({
      message: "Prevod je uspešno obrisan.",
    });
  } catch (error) {
    console.error("Greška u deleteJobTranslationByLocale:", error);
    return res.status(500).json({
      message: "Greška pri brisanju prevoda.",
      error: error.message,
    });
  }
};

const copyJobTranslation = async (req, res) => {
  try {
    const { publicId } = req.params;
    const { fromLocale, toLocale } = req.body;

    if (!publicId || !String(publicId).trim()) {
      return res.status(400).json({
        message: "publicId je obavezan.",
      });
    }

    if (!fromLocale || !toLocale) {
      return res.status(400).json({
        message: "fromLocale i toLocale su obavezni.",
      });
    }

    const job = await findJobByPublicId(publicId);

    if (!job) {
      return res.status(404).json({
        message: "Job nije pronađen.",
      });
    }

    const sourceLocale = normalizeLocale(fromLocale);
    const targetLocale = normalizeLocale(toLocale);

    if (sourceLocale === targetLocale) {
      return res.status(400).json({
        message: "fromLocale i toLocale ne mogu biti isti.",
      });
    }

    const sourceTranslation = await JobTranslation.findOne({
      job: job._id,
      locale: sourceLocale,
    });

    if (!sourceTranslation) {
      return res.status(404).json({
        message: "Izvorni prevod nije pronađen.",
      });
    }

    let targetTranslation = await JobTranslation.findOne({
      job: job._id,
      locale: targetLocale,
    });

    if (!targetTranslation) {
      targetTranslation = await JobTranslation.create({
        job: job._id,
        locale: targetLocale,
        name: sourceTranslation.name,
        locationOrLink: sourceTranslation.locationOrLink,
        whyThisPosition: sourceTranslation.whyThisPosition,
        aboutZepter: sourceTranslation.aboutZepter,
        responsibilities: sourceTranslation.responsibilities,
        requirements: sourceTranslation.requirements,
        whatZepterOffers: sourceTranslation.whatZepterOffers,
        applyLabel: sourceTranslation.applyLabel,
        notes: sourceTranslation.notes,
      });
    } else {
      targetTranslation.name = sourceTranslation.name;
      targetTranslation.locationOrLink = sourceTranslation.locationOrLink;
      targetTranslation.whyThisPosition = sourceTranslation.whyThisPosition;
      targetTranslation.aboutZepter = sourceTranslation.aboutZepter;
      targetTranslation.responsibilities = sourceTranslation.responsibilities;
      targetTranslation.requirements = sourceTranslation.requirements;
      targetTranslation.whatZepterOffers = sourceTranslation.whatZepterOffers;
      targetTranslation.applyLabel = sourceTranslation.applyLabel;
      targetTranslation.notes = sourceTranslation.notes;
      await targetTranslation.save();
    }

    return res.status(200).json({
      message: "Prevod je uspešno kopiran.",
      translation: targetTranslation,
    });
  } catch (error) {
    console.error("Greška u copyJobTranslation:", error);
    return res.status(500).json({
      message: "Greška pri kopiranju prevoda.",
      error: error.message,
    });
  }
};

module.exports = {
  getTranslationJobs,
  getJobTranslationsOverview,
  getJobTranslationByLocale,
  saveJobTranslation,
  updateJobTranslationByLocale,
  deleteJobTranslationByLocale,
  copyJobTranslation,
};