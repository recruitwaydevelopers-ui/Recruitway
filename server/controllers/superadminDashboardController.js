const Auth = require("../models/Auth/Auth-model");
const CompanyProfile = require("../models/Auth/Company-model");
const Interview = require("../models/Interview-model");
const Job = require("../models/Job");
const JobApplication = require("../models/JobApplication-model");
const Report = require("../models/Report-model");

const getAllCompaniesWithProfileAndVerificationStatus = async (req, res) => {
    try {
        // Find all company users from the Auth model
        const allCompanyUsers = await Auth.find({ role: "company" }).select("_id isVerified");

        if (!allCompanyUsers || allCompanyUsers.length === 0) {
            return res.status(404).json({ message: "No Company found." });
        }

        // Extract company user ids
        const companyUserIds = allCompanyUsers.map(user => user._id);

        // Find company profiles based on userId
        const companyProfiles = await CompanyProfile.find({ userId: { $in: companyUserIds } });

        if (!companyProfiles || companyProfiles.length === 0) {
            return res.status(404).json({ message: "No company profiles found." });
        }

        // Merge `isVerified` from Auth into each company profile
        const companiesWithVerificationStatus = companyProfiles.map(profile => {
            const authUser = allCompanyUsers.find(user => user._id.toString() === profile.userId.toString());
            return {
                ...profile.toObject(), // Spread all fields of the company profile
                isVerified: authUser ? authUser.isVerified : false // Add isVerified from Auth
            };
        });

        // Filter companies that have fullName
        const filteredCompanies = companiesWithVerificationStatus.filter(company =>
            company.fullname && company.fullname.trim().length > 0
        );

        res.status(200).json({ companies: filteredCompanies });


        // res.status(200).json({ companies: companiesWithVerificationStatus });
    } catch (error) {
        // console.error(error);
        res.status(500).json({ message: "Server error while fetching companies." });
    }
};

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
        const jobApplications = await JobApplication.find().populate("items.jobId").sort({ createdAt: -1 });        
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


module.exports = { getAllCompaniesWithProfileAndVerificationStatus, getSuperAdminJobStats, getSuperAdminJobApplicationStats, getSuperAdminInterviewStats, getSuperAdminReportsStats }



