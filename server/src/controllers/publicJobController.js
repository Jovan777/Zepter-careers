const mongoose = require("mongoose");
const Job = require("../models/Job");
const JobTranslation = require("../models/JobTranslation");
require("../models/Company");
require("../models/Region");

const getRequestedLocale = (queryLocale) => {
    return queryLocale && queryLocale.trim() ? queryLocale.trim() : "en";
};

const getPublishedJobs = async (req, res) => {
    try {
        const locale = getRequestedLocale(req.query.locale);
        const search = req.query.search ? req.query.search.trim() : "";
        const companyId = req.query.company ? req.query.company.trim() : "";
        const regionId = req.query.region ? req.query.region.trim() : "";

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

        const jobs = await Job.find(jobFilter)
            .populate("company", "name")
            .populate("region", "name isoCode")
            .sort({ createdAt: -1 });

        const jobsWithTranslations = await Promise.all(
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

                if (!translation) {
                    console.log("Nema prevoda za job:", job._id.toString(), "locale:", locale);
                    return null;
                }

                return {
                    _id: job._id,
                    publicId: job.publicId,
                    title: translation.name,
                    company: job.company?.name || "",
                    region: job.region?.name || "",
                    regionIsoCode: job.region?.isoCode || "",
                    postedAt: job.publishStartAt || job.createdAt,
                    appliedCount: job.appliedCount,
                    locale: translation.locale,
                    locationOrLink: translation.locationOrLink || "",
                };
            })
        );

        let filteredJobs = jobsWithTranslations.filter(Boolean);

        if (search) {
            const searchLower = search.toLowerCase();
            filteredJobs = filteredJobs.filter((job) =>
                job.title.toLowerCase().includes(searchLower)
            );
        }

        return res.status(200).json(filteredJobs);
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
        const { id } = req.params;
        const normalizedId = String(id).trim();
        const locale = getRequestedLocale(req.query.locale);

        const jobQuery = {
            status: "published",
        };

        if (mongoose.Types.ObjectId.isValid(normalizedId)) {
            jobQuery.$or = [{ _id: normalizedId }, { publicId: normalizedId }];
        } else {
            jobQuery.publicId = normalizedId;
        }

        const job = await Job.findOne(jobQuery)
            .populate("company", "name legalEntity")
            .populate("region", "name isoCode");

        if (!job) {
            return res.status(404).json({
                message: "Posao nije pronađen.",
            });
        }

        let translation = await JobTranslation.findOne({
            job: job._id,
            locale,
        });

        /*
        console.log("job._id =", job._id);
        console.log("locale =", locale);

        const allTranslations = await JobTranslation.find({});
        console.log("allTranslations =", allTranslations);
        */

        if (!translation) {
            translation = await JobTranslation.findOne({
                job: job._id,
                locale: "en",
            });
        }

        if (!translation) {
            console.log("Job pronađen, ali nema prevoda:", {
                jobId: job._id.toString(),
                publicId: job.publicId,
                locale,
            });

            return res.status(404).json({
                message: "Prevod za posao nije pronađen.",
            });
        }

        

        return res.status(200).json({
            _id: job._id,
            publicId: job.publicId,
            company: job.company,
            region: job.region,
            status: job.status,
            postedAt: job.publishStartAt || job.createdAt,
            appliedCount: job.appliedCount,
            notes: job.notes,
            translation: {
                locale: translation.locale,
                name: translation.name,
                locationOrLink: translation.locationOrLink,
                whyThisPosition: translation.whyThisPosition,
                aboutZepter: translation.aboutZepter,
                responsibilities: translation.responsibilities,
                requirements: translation.requirements,
                whatZepterOffers: translation.whatZepterOffers,
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

module.exports = {
    getPublishedJobs,
    getJobById,
};