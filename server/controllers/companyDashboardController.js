const Interview = require("../models/Interview-model");
const JobApplication = require("../models/JobApplication-model");
const mongoose = require("mongoose");
const Report = require("../models/Report-model");

const getApplicationStatusStats = async (req, res) => {
    const { companyId } = req.params;

    if (!companyId) {
        return res.status(400).json({ error: "companyId is required" });
    }

    try {
        const data = await JobApplication.aggregate([
            { $unwind: "$items" },
            {
                $match: {
                    "items.companyId": new mongoose.Types.ObjectId(companyId),
                },
            },
            {
                $lookup: {
                    from: "jobs",
                    localField: "items.jobId",
                    foreignField: "_id",
                    as: "job",
                },
            },
            { $unwind: "$job" },
            {
                $project: {
                    jobTitle: "$job.title",
                    status: "$items.status",
                    createdAt: "$items.createdAt",
                },
            },
        ]);

        res.status(200).json({ data });
    } catch (error) {
        console.error("Error fetching job status data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getInterviewStats = async (req, res) => {
    const { companyId } = req.params;

    if (!companyId) {
        return res.status(400).json({ error: "companyId is required" });
    }

    try {
        const interviews = await Interview.find({ companyId }).lean();

        res.status(200).json({ data: interviews });
    } catch (error) {
        console.error("Error fetching interviews:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getReportsStats = async (req, res) => {
    const { companyId } = req.params;

    if (!companyId) {
        return res.status(400).json({ error: "companyId is required" });
    }

    try {
        const reports = await Report.find({ companyId }).lean();

        res.status(200).json({ data: reports });
    } catch (error) {
        console.error("Error fetching reports:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


module.exports = { getApplicationStatusStats, getInterviewStats, getReportsStats }