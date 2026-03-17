const Job = require("../../models/Job");
const Application = require("../../models/Application");
const Region = require("../../models/Region");

const getDashboardStats = async (req, res) => {
    try {
        const activeJobs = await Job.countDocuments({ status: "published" });
        const totalJobs = await Job.countDocuments({});
        const totalApplications = await Application.countDocuments({});

        const pipelineAgg = await Application.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    status: "$_id",
                    count: 1,
                },
            },
            {
                $sort: { status: 1 },
            },
        ]);

        const topRegionsAgg = await Application.aggregate([
            {
                $lookup: {
                    from: "jobs",
                    localField: "job",
                    foreignField: "_id",
                    as: "jobData",
                },
            },
            { $unwind: "$jobData" },
            {
                $lookup: {
                    from: "regions",
                    localField: "jobData.region",
                    foreignField: "_id",
                    as: "regionData",
                },
            },
            { $unwind: "$regionData" },
            {
                $group: {
                    _id: "$regionData._id",
                    region: { $first: "$regionData.name" },
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    regionId: "$_id",
                    region: 1,
                    count: 1,
                },
            },
            {
                $sort: { count: -1, region: 1 },
            },
            {
                $limit: 10,
            },
        ]);

        return res.status(200).json({
            activeJobs,
            totalJobs,
            totalApplications,
            pipeline: pipelineAgg,
            topRegions: topRegionsAgg,
        });
    } catch (error) {
        console.error("Greška u getDashboardStats:", error);
        return res.status(500).json({
            message: "Greška pri dohvatanju dashboard statistike.",
            error: error.message,
        });
    }
};

module.exports = {
    getDashboardStats,
};