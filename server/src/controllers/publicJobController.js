const mongoose = require("mongoose");
const Job = require("../models/Job");
const JobTranslation = require("../models/JobTranslation");
require("../models/Company");
require("../models/Region");

const getRequestedLocale = (queryLocale) => {
  return queryLocale && queryLocale.trim() ? queryLocale.trim() : "en";
};

const normalizeQueryValue = (value) => {
  return value ? String(value).trim() : "";
};

const parsePositiveInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) || parsed <= 0 ? fallback : parsed;
};

const mapEmploymentTypeLabel = (value) => {
  const map = {
    full_time: "Full-Time",
    part_time: "Part-Time",
    contract: "Contract",
    internship: "Internship",
    temporary: "Temporary",
  };

  return map[value] || value || "";
};

const mapLocationTypeLabel = (value) => {
  const map = {
    onsite: "On-site",
    remote: "Remote",
    hybrid: "Hybrid",
  };

  return map[value] || value || "";
};

const resolveTranslation = async (jobId, locale) => {
  let translation = await JobTranslation.findOne({ job: jobId, locale });

  if (!translation && locale !== "en") {
    translation = await JobTranslation.findOne({ job: jobId, locale: "en" });
  }

  return translation;
};

const getPublishedJobs = async (req, res) => {
  try {
    const locale = getRequestedLocale(req.query.locale);
    const search = normalizeQueryValue(req.query.search);
    const companyId = normalizeQueryValue(req.query.company);
    const regionId = normalizeQueryValue(req.query.region);
    const workArea = normalizeQueryValue(req.query.workArea);
    const locationType = normalizeQueryValue(req.query.locationType);
    const employmentType = normalizeQueryValue(req.query.employmentType);

    const page = parsePositiveInt(req.query.page, 1);
    const limit = parsePositiveInt(req.query.limit, 10);

    const jobFilter = {
      status: "published",
    };

    if (companyId) {
      if (!mongoose.Types.ObjectId.isValid(companyId)) {
        return res.status(400).json({
          message: "Prosleđeni company nije validan ObjectId.",
        });
      }
      jobFilter.company = companyId;
    }

    if (regionId) {
      if (!mongoose.Types.ObjectId.isValid(regionId)) {
        return res.status(400).json({
          message: "Prosleđeni region nije validan ObjectId.",
        });
      }
      jobFilter.region = regionId;
    }

    if (workArea) {
      jobFilter.workArea = workArea;
    }

    if (locationType) {
      jobFilter.locationType = locationType;
    }

    if (employmentType) {
      jobFilter.employmentType = employmentType;
    }

    const jobs = await Job.find(jobFilter)
      .populate("company", "name")
      .populate("region", "name isoCode")
      .sort({ publishStartAt: -1, createdAt: -1 });

    const mapped = await Promise.all(
      jobs.map(async (job) => {
        const translation = await resolveTranslation(job._id, locale);

        if (!translation) {
          return null;
        }

        return {
          publicId: job.publicId,
          title: translation.name,
          company: {
            id: job.company?._id || null,
            name: job.company?.name || "",
          },
          location: {
            regionId: job.region?._id || null,
            regionName: job.region?.name || "",
            regionIsoCode: job.region?.isoCode || "",
            locationType: job.locationType || "",
            label:
              translation.locationLabel ||
              job.region?.name ||
              "",
          },
          employmentType: job.employmentType,
          employmentTypeLabel: mapEmploymentTypeLabel(job.employmentType),
          workArea: job.workArea || "",
          postedAt: job.publishStartAt || job.createdAt,
          appliedCount: job.appliedCount,
          locale: translation.locale,
          shortDescription: translation.shortDescription || "",
          qualifications: translation.qualifications || [],
        };
      })
    );

    let filtered = mapped.filter(Boolean);

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter((job) => {
        return (
          job.title.toLowerCase().includes(searchLower) ||
          job.company.name.toLowerCase().includes(searchLower) ||
          job.location.label.toLowerCase().includes(searchLower) ||
          (job.shortDescription || "").toLowerCase().includes(searchLower) ||
          (job.workArea || "").toLowerCase().includes(searchLower) ||
          (job.qualifications || []).some((q) =>
            String(q).toLowerCase().includes(searchLower)
          )
        );
      });
    }

    const totalItems = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / limit));
    const start = (page - 1) * limit;
    const items = filtered.slice(start, start + limit);

    return res.status(200).json({
      items,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Greška u getPublishedJobs:", error);

    return res.status(500).json({
      message: "Greška pri dohvatanju poslova.",
      error: error.message,
    });
  }
};

const getJobById = async (req, res) => {
  try {
    const { publicId } = req.params;
    const locale = getRequestedLocale(req.query.locale);

    if (!publicId || !String(publicId).trim()) {
      return res.status(400).json({
        message: "publicId je obavezan.",
      });
    }

    const job = await Job.findOne({
      publicId: String(publicId).trim(),
      status: "published",
    })
      .populate("company", "name legalEntity")
      .populate("region", "name isoCode");

    if (!job) {
      return res.status(404).json({
        message: "Posao nije pronađen.",
      });
    }

    const translation = await resolveTranslation(job._id, locale);

    if (!translation) {
      return res.status(404).json({
        message: "Prevod za posao nije pronađen.",
      });
    }

    return res.status(200).json({
      publicId: job.publicId,
      status: job.status,
      postedAt: job.publishStartAt || job.createdAt,
      appliedCount: job.appliedCount,
      notes: job.notes,
      company: job.company,
      location: {
        regionId: job.region?._id || null,
        regionName: job.region?.name || "",
        regionIsoCode: job.region?.isoCode || "",
        locationType: job.locationType || "",
        label: translation.locationLabel || job.region?.name || "",
      },
      employmentType: job.employmentType,
      employmentTypeLabel: mapEmploymentTypeLabel(job.employmentType),
      workArea: job.workArea || "",
      translation: {
        locale: translation.locale,
        title: translation.name,
        shortDescription: translation.shortDescription,
        intro: translation.intro || [],
        whyThisPosition: translation.whyThisPosition,
        aboutZepter: translation.aboutZepter,
        qualifications: translation.qualifications || [],
        responsibilities: translation.responsibilities || [],
        requirements: translation.requirements || [],
        whatZepterOffers: translation.whatZepterOffers || [],
        applyLabel: translation.applyLabel,
      },
    });
  } catch (error) {
    console.error("Greška u getJobById:", error);

    return res.status(500).json({
      message: "Greška pri dohvatanju detalja posla.",
      error: error.message,
    });
  }
};

const getJobFilters = async (_req, res) => {
  try {
    const jobs = await Job.find({ status: "published" })
      .populate("region", "name isoCode")
      .lean();

    const uniqueWorkAreas = [...new Set(jobs.map((j) => j.workArea).filter(Boolean))];
    const uniqueEmploymentTypes = [...new Set(jobs.map((j) => j.employmentType).filter(Boolean))];
    const uniqueLocationTypes = [...new Set(jobs.map((j) => j.locationType).filter(Boolean))];

    const regionsMap = new Map();

    jobs.forEach((job) => {
      if (job.region?._id) {
        regionsMap.set(String(job.region._id), {
          value: String(job.region._id),
          label: job.region.name,
          isoCode: job.region.isoCode || "",
        });
      }
    });

    return res.status(200).json({
      workAreas: uniqueWorkAreas.map((value) => ({
        value,
        label: value,
      })),
      employmentTypes: uniqueEmploymentTypes.map((value) => ({
        value,
        label: mapEmploymentTypeLabel(value),
      })),
      locationTypes: uniqueLocationTypes.map((value) => ({
        value,
        label: mapLocationTypeLabel(value),
      })),
      regions: Array.from(regionsMap.values()).sort((a, b) =>
        a.label.localeCompare(b.label)
      ),
      locales: [
        { value: "sr", label: "Srpski" },
        { value: "en", label: "English" },
      ],
    });
  } catch (error) {
    console.error("Greška u getJobFilters:", error);

    return res.status(500).json({
      message: "Greška pri dohvatanju filtera za poslove.",
      error: error.message,
    });
  }
};

module.exports = {
  getPublishedJobs,
  getJobById,
  getJobFilters,
};