const Interview = require("../models/Interview-model");
const Job = require("../models/Job");
const JobApplication = require("../models/JobApplication-model");
const Report = require("../models/Report-model");

const getSuperAdminJobStats = async (req, res) => {
    try {
        const jobposts = await Job.find().sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: jobposts });
    } catch (error) {
        console.error('Error fetching job stats:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch job stats', error: error.message });
    }
};

const getSuperAdminJobApplicationStats = async (req, res) => {
    try {
        const jobApplications = await JobApplication.find().sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: jobApplications });
    } catch (error) {
        console.error('Error fetching job application stats:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch job application stats', error: error.message });
    }
};

const getSuperAdminInterviewStats = async (req, res) => {
    try {
        const interviews = await Interview.find().sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: interviews });
    } catch (error) {
        console.error('Error fetching interview stats:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch interview stats', error: error.message });
    }
};

const getSuperAdminReportsStats = async (req, res) => {
    try {
        const reports = await Report.find().sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: reports });
    } catch (error) {
        console.error('Error fetching report stats:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch report stats', error: error.message });
    }
};


module.exports = { getSuperAdminJobStats, getSuperAdminJobApplicationStats, getSuperAdminInterviewStats, getSuperAdminReportsStats }



