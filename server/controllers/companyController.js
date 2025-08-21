const CompanyProfile = require('../models/Auth/Company-model');
const cloudinary = require("../config/cloudinary");
const Job = require('../models/Job');
const CandidateProfile = require('../models/Auth/Candidate-model');
const Auth = require('../models/Auth/Auth-model');
const Notification = require('../models/Notification-modal');
const JobApplication = require('../models/JobApplication-model');
const Interview = require('../models/Interview-model');
const Report = require('../models/Report-model');
const SuperAdminProfile = require('../models/Auth/SuperAdmin-model');
const fs = require('fs');
const CVFORINTERVIEW = require('../models/CvForInterview');
const path = require('path');
const axios = require("axios")

const getProfile = async (req, res) => {
    try {
        const userId = req.user._id;

        let profile = await CompanyProfile.findOne({ userId });
        return res.status(200).json({ data: profile })

    } catch (error) {
        console.error("Error getiing company profile:", error);
        return res.status(500).json({ message: error.message });
    }
}

const createProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const files = req.files || {};
        const body = req.body;

        // Helper function to safely parse JSON strings
        const parseIfString = (value, defaultValue = {}) => {
            try {
                if (typeof value === 'string') {
                    return JSON.parse(value);
                }
                return value || defaultValue;
            } catch (err) {
                return defaultValue;
            }
        };

        // Process file uploads
        let profilePictureUrl = '';
        if (files.profilePicture) {
            const profilePictureResult = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'company_logos',
                        transformation: [{ width: 500, height: 500, crop: 'limit' }]
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                uploadStream.end(files.profilePicture[0].buffer);
            });
            profilePictureUrl = profilePictureResult.secure_url;
        }

        const user = await Auth.findOne({ _id: userId }).select("email")

        // Parse all input data
        const parsedData = {
            fullname: body.fullname || '',
            email: user.email || "",
            tagline: body.tagline || '',
            industry: body.industry || '',
            companySize: body.companySize || '',
            headquarters: body.headquarters || '',
            website: body.website || '',
            contactEmail: body.contactEmail || '',
            contactPhone: body.contactPhone || '',
            about: body.about || '',
            keyDetails: parseIfString(body.keyDetails, []),
            history: parseIfString(body.history, []),
            des: parseIfString(body.des, []),
            departments: parseIfString(body.departments, []),
            locations: parseIfString(body.locations, []),
            ceo: {
                ceoName: parseIfString(body.ceo, {}).ceoName || '',
                since: parseIfString(body.ceo, {}).since || ''
            },
            founder: {
                founderName: parseIfString(body.founder, {}).founderName || '',
                currentRole: parseIfString(body.founder, {}).currentRole || ''
            },
            socialMedia: {
                linkedin: parseIfString(body.socialMedia, {}).linkedin || '',
                twitter: parseIfString(body.socialMedia, {}).twitter || '',
                facebook: parseIfString(body.socialMedia, {}).facebook || ''
            },
            ...(profilePictureUrl && { profilePicture: profilePictureUrl })
        };

        // Find and update or create new profile
        const updatedProfile = await CompanyProfile.findOneAndUpdate(
            { userId },
            { $set: parsedData },
            {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true,
                runValidators: true
            }
        );

        return res.status(200).json({
            success: true,
            message: "Profile saved successfully",
            profile: updatedProfile
        });

    } catch (error) {
        console.error('Error saving profile:', error);

        // Handle specific error types
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                error: error.message
            });
        }

        if (error.message.includes('Cloudinary')) {
            return res.status(500).json({
                success: false,
                message: 'File upload failed',
                error: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

const createJobPost = async (req, res) => {
    const jobData = req.body;
    const userId = req?.user?._id;

    try {
        const newJobPost = new Job({
            userId,
            title: jobData.title,
            company: jobData.company,
            location: jobData.location,
            salary: jobData.salary,
            type: jobData.type,
            experience: jobData.experience,
            description: jobData.description,
            requirements: jobData.requirements,
            skills: jobData.skills,
            status: jobData.status,
        });

        await newJobPost.save();

        return res.status(200).json({ message: "Job post added successfully", jobDoc: newJobPost });
    } catch (error) {
        console.error("Error creating job post:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const uploadCvWithJobDetails = async (req, res) => {

    const { title, company, location, salary, type, experience, description, requirements, skills, notes } = req.body;

    const companyId = req?.user?._id;

    try {

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        // Upload each file to Cloudinary
        const uploadedCVs = [];

        for (const file of req.files) {
            const result = await cloudinary.uploader.upload(file.path, {
                resource_type: 'raw',
                folder: 'cv_uploads'
            });

            uploadedCVs.push({
                originalName: file.originalname,
                public_id: result.public_id,
                secure_url: result.secure_url,
                size: file.size,
                mimetype: file.mimetype,
                status: "Submitted"
            });

            fs.unlinkSync(file.path);
        }

        const newCVEntry = new CVFORINTERVIEW({
            companyId,
            title,
            company,
            location,
            salary,
            type,
            experience,
            description,
            notes,
            requirements: Array.isArray(requirements) ? requirements : [requirements],
            skills: Array.isArray(skills) ? skills : [skills],
            CvFile: uploadedCVs
        });

        await newCVEntry.save();

        res.status(200).json({ success: true, message: 'CVs uploaded and job entry created', data: newCVEntry });
    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({ error: 'Server error during upload' });
    }
};

const getAllCvWithJobDetails = async (req, res) => {
    const companyId = req?.user?._id;

    if (!companyId) {
        return res.status(401).json({ success: false, message: "Unauthorized: User ID missing or invalid" });
    }

    try {
        const cvs = await CVFORINTERVIEW.find({ companyId }).populate('companyId', 'email name')
        return res.status(200).json({ success: true, data: cvs });

    } catch (error) {
        console.error('Error fetching CVs:', error);
        return res.status(500).json({ message: error.message });
    }
};

const uploadSingleCvFilewhileEdit = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const application = await CVFORINTERVIEW.findById(applicationId);
        if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

        const file = req.file;
        if (!file) return res.status(400).json({ success: false, message: 'No file uploaded' });

        const result = await cloudinary.uploader.upload(file.path, {
            resource_type: 'raw',
            folder: 'cv_uploads'
        });

        const newCvFile = {
            originalName: file.originalname,
            public_id: result.public_id,
            secure_url: result.secure_url,
            size: file.size,
            mimetype: file.mimetype,
            status: "Submitted"
        };

        application.CvFile.push(newCvFile);
        await application.save();

        res.status(200).json({ success: true, data: newCvFile });
    } catch (error) {
        console.error('Upload CV error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const deleteSingleCvFilewhileEdit = async (req, res) => {
    try {
        const publicId = decodeURIComponent(req.params.publicId);

        const applicationCV = await CVFORINTERVIEW.findOne({ 'CvFile.public_id': publicId });
        if (!applicationCV) {
            return res.status(404).json({ success: false, message: 'CV File not found' });
        }

        // Find the index of the file to delete
        const fileIndex = applicationCV.CvFile.findIndex(file => file.public_id === publicId);
        if (fileIndex === -1) {
            return res.status(404).json({ success: false, message: 'File not found in CvFile array' });
        }

        // Delete file from Cloudinary
        await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });

        // Remove file from CvFile array
        applicationCV.CvFile.splice(fileIndex, 1);
        await applicationCV.save();

        res.status(200).json({ success: true, message: 'CV file deleted successfully' });
    } catch (error) {
        // console.error('Delete CV error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const editCvWithApplication = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const editedData = req.body;
        const companyId = req?.user?._id;

        const application = await CVFORINTERVIEW.findOne({ _id: applicationId, companyId });

        if (!application) {
            return res.status(404).json({ message: "CV Application not found or access denied." });
        }

        // Apply updates
        Object.assign(application, editedData);

        await application.save();

        return res.status(200).json({ message: "CV Application updated successfully." });
    } catch (error) {
        console.error("Error updating CV Application:", error);
        return res.status(500).json({ message: "Failed to update CV Application." });
    }
};

const deleteCvWithApplication = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const companyId = req?.user?._id;

        const deleted = await CVFORINTERVIEW.findOneAndDelete({ _id: applicationId, companyId });

        if (!deleted) {
            return res.status(404).json({ message: "CV Application not found or access denied." });
        }

        return res.status(200).json({ message: "CV Application deleted successfully." });
    } catch (error) {
        console.error("Error deleting CV Application:", error);
        return res.status(500).json({ message: "Failed to delete CV Application." });
    }
};

const downloadCV = async (req, res) => {
    const { url, name } = req.query;

    if (!url || !name) return res.status(400).send('Invalid request');

    try {
        const response = await axios.get(url, { responseType: 'stream' });

        res.setHeader('Content-Disposition', `attachment; filename="${name}"`);
        res.setHeader('Content-Type', response.headers['content-type']);

        response.data.pipe(res);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error downloading file');
    }
};

const getAllJob = async (req, res) => {
    const userId = req?.user?._id;
    console.log(userId);


    try {
        // Retrieve all job posts for the specific user
        const jobData = await Job.find({ userId })

        if (!jobData || jobData.length === 0) {
            return res.status(404).json({ message: "No jobs found for this Company." });
        }

        const sortedJobs = jobData.sort((a, b) => b.posted - a.posted);

        res.status(200).json({ jobs: sortedJobs });
    } catch (error) {
        console.error("Error fetching jobs:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const updateJobPost = async (req, res) => {
    const applicationId = req.params.jobId;
    const updatedJobData = req.body;
    const userId = req?.user?._id;

    try {
        // Find the job by jobId and userId
        const jobDoc = await Job.findOne({ _id: jobId, userId });

        if (!jobDoc) {
            return res.status(404).json({ message: "Job not found or you don't have permission to update it." });
        }

        // Update the job document with the new data
        Object.assign(jobDoc, updatedJobData);

        await jobDoc.save();

        return res.status(200).json({ message: "Job post updated successfully" });
    } catch (error) {
        console.error("Error updating job:", error);
        return res.status(500).json({ message: "Failed to update job post." });
    }
};

// const deleteJobPost = async (req, res) => {
//     const { jobId } = req.params;
//     const userId = req?.user?._id;

//     try {
//         // Find the job by jobId and userId, then delete it
//         const job = await Job.findOneAndDelete({ _id: jobId, userId });

//         if (!job) {
//             return res.status(404).json({ message: "Job not found or unauthorized access." });
//         }

//         res.status(200).json({ message: "Job deleted successfully." });
//     } catch (error) {
//         console.error("Error deleting job post:", error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// };

const deleteJobPost = async (req, res) => {
    const { jobId } = req.params;
    const userId = req?.user?._id;

    try {
        // Delete the job
        const job = await Job.findOneAndDelete({ _id: jobId, userId });

        if (!job) {
            return res.status(404).json({ message: "Job not found or unauthorized access." });
        }

        // Remove jobId from all JobApplication items
        await JobApplication.updateMany(
            { "items.jobId": jobId },
            { $pull: { items: { jobId } } }
        );

        await Interview.deleteMany({ jobId });

        res.status(200).json({ message: "Job deleted successfully." });
    } catch (error) {
        console.error("Error deleting job post:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getAllJobApplicants = async (req, res) => {
    try {
        const userId = req.user._id; // Employer's user ID

        // Find all jobs posted by this employer
        const employerJobs = await Job.find({ userId }).select('_id title company location salary type experience');

        if (!employerJobs || employerJobs.length === 0) {
            return res.status(404).json({ message: "No jobs found for this employer" });
        }

        // Extract job IDs
        const jobIds = employerJobs.map(job => job._id.toString());

        // Create a job map to easily attach job details later
        const jobMap = employerJobs.reduce((acc, job) => {
            acc[job._id.toString()] = {
                title: job.title,
                company: job.company,
                location: job.location,
                salary: job.salary,
                type: job.type,
                experience: job.experience
            };
            return acc;
        }, {});

        // Find all applications related to these jobs
        const applications = await JobApplication.find({ "items.jobId": { $in: jobIds } })
            .populate('applicantId', '_id') // populate only _id of user to match with CandidateProfile
            .lean();

        if (!applications || applications.length === 0) {
            return res.status(404).json({ message: "No applicants found for your jobs" });
        }

        // Collect userIds
        const userIds = applications.map(app => app.applicantId._id.toString());

        // Fetch candidate profiles
        const candidateProfiles = await CandidateProfile.find({ userId: { $in: userIds } }).lean();

        // Map userId to candidateProfile
        const profileMap = candidateProfiles.reduce((acc, profile) => {
            acc[profile.userId.toString()] = profile;
            return acc;
        }, {});

        const allApplicants = applications.flatMap(app =>
            app.items
                .filter(item => jobIds.includes(item.jobId.toString()))
                .map(item => ({
                    applicationId: item._id,
                    applicationJobId: item.jobId,
                    status: item.status,
                    appliedAt: app.createdAt,
                    jobDetails: jobMap[item.jobId.toString()] || null,
                    candidateProfile: profileMap[app.applicantId._id.toString()] || null
                }))
        );

        res.status(200).json({ success: true, applicants: allApplicants });
    } catch (error) {
        console.error("Error fetching applicants:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getJobApplicants = async (req, res) => {
    try {
        const { jobId } = req.params;
        const userId = req.user._id;  // Employer's user ID

        // Verify the job belongs to this employer
        const job = await Job.findOne({ userId, _id: jobId });
        if (!job) {
            return res.status(404).json({ message: "Job not found or unauthorized" });
        }

        // Get applicants for the specific job
        const applicants = await JobApplication.find({ "items.jobId": jobId })
            .populate('items.applicantId', 'name email')  // Populate user details (name, email) from Auth model
            .lean();

        if (!applicants || applicants.length === 0) {
            return res.status(404).json({ message: "No applicants for this job" });
        }

        res.status(200).json(applicants);
    } catch (error) {
        console.error("Error fetching applicants:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const updateApplicationStatus = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { status, candidateId } = req.body;
        const userId = req.user._id;

        // Find the application
        const application = await JobApplication.findOne({ applicantId: candidateId })

        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        const job = application.items.find((item) =>
            item.jobId.toString() === applicationId.toString()
        );

        // Verify the job belongs to this employer
        // const job = await Job.findOne({
        //     userId,
        //     _id: application.items.applicationId
        // });

        // if (!job) {
        //     return res.status(403).json({ message: "Unauthorized to update this application" });
        // }

        // Update application status

        job.status = status;
        await application.save();

        res.status(200).json({
            message: "Application status updated successfully",
        });
    } catch (error) {
        // console.error("Error updating application status:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

const getAllDoneInterviewsOfCompany = async (req, res) => {
    const companyId = req.user._id;

    try {
        // Only fetch interviews marked as "done"
        const interviews = await Interview.find({
            companyId,
            status: "completed"
        }).sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: interviews });
    } catch (error) {
        console.error("Error fetching done interviews:", error.message);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

const getReportOfEachCandidate = async (req, res) => {
    const { id: interviewId } = req.params;

    try {
        const report = await Report.findOne({ interviewId });

        if (!report) {
            return res.status(404).json({ success: false, message: 'Report not found' });
        }

        res.status(200).json({ success: true, data: report });
    } catch (err) {
        // console.error("Error fetching report:", err.message);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

async function getCompanyNotifications(req, res) {
    const { page = 1, limit = 5 } = req.query;
    const skip = (page - 1) * limit;
    const companyId = req.user._id;

    try {
        const notifications = await Notification.find({ companyId })
            .sort({ createdAt: -1 })
            // .lean()
            // .exec()
            .skip(skip)
            .limit(limit);

        // Transform notifications to match frontend requirements
        const formattedNotifications = notifications.map(notification => ({
            _id: notification._id,
            id: notification._id.toString(), // For React key purposes
            name: notification.title || 'Notification',
            message: notification.message,
            icon: notification.type === 'alert' ? 'alert-circle' :
                notification.type === 'message' ? 'message' :
                    notification.type === 'update' ? 'refresh' : 'bell',
            timestamp: notification.createdAt,
            read: notification.isRead || false,
            action: notification.actionRequired ? 'View' : null,
            // Additional fields that might be useful
            type: notification.type || 'general',
            priority: notification.priority || 'normal',
            metadata: notification.metadata || {}
        }));

        const total = await Notification.countDocuments({ companyId: companyId });
        const totalPages = Math.ceil(total / limit)

        res.json({
            success: true,
            notifications: formattedNotifications,
            unreadCount: notifications.filter(n => !n.isRead).length,
            lastUpdated: new Date()
        });

    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch notifications',
            error: error.message
        });
    }
}

const markAsRead = async (req, res) => {

    const { companyId } = req.params;  // Extract companyId from the request params

    try {
        // Find all notifications for the given companyId
        const allNotifications = await Notification.find({ companyId });

        // Check if notifications exist
        if (!allNotifications || allNotifications.length === 0) {
            return res.status(404).json({ message: "No notifications found for this company" });
        }

        // Update notifications to mark them as read
        await Notification.updateMany(
            { companyId },  // filter by companyId
            { $set: { isRead: true } }  // set the isRead field to true
        );

        // Optionally, return the updated notifications
        res.status(200).json({ success: true, message: "All notifications marked as read.", notifications: allNotifications });

    } catch (error) {
        // console.error("Error marking notifications as read:", error.message);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

const getDashboard = async (req, res) => {
    try {
        const interviews = await Interview.find({ company: req.user._id }).populate('interviewee interviewer');
        res.render('company/dashboard', { user: req.user, interviews });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving company dashboard data' });
    }
};

const scheduleInterview = async (req, res) => {
    try {
        const { interviewee, interviewer, date, time } = req.body;

        const newInterview = new Interview({
            company: req.user._id,
            interviewee,
            interviewer,
            date,
            time,
            status: 'Scheduled'
        });

        await newInterview.save();
        res.redirect('/company/dashboard');
    } catch (error) {
        res.status(500).json({ message: 'Error scheduling interview' });
    }
};

const getInterviewees = async (req, res) => {
    try {
        const interviewee = await Auth.find({ role: 'interviewee' });
        res.render('company/interviewee', { interviewee });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving interviewees' });
    }
};

const getInterviewers = async (req, res) => {
    try {
        const interviewer = await Auth.find({ role: 'interviewer' });
        res.render('company/interviewer', { interviewer });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving interviewer' });
    }
};

const cancelInterview = async (req, res) => {
    try {
        await Interview.findByIdAndDelete(req.params.id);
        res.redirect('/company/dashboard');
    } catch (error) {
        res.status(500).json({ message: 'Error canceling interview' });
    }
};

const getSuperAdmin = async (req, res) => {
    try {
        // Find all superadmin profiles where userId is linked to a superadmin
        const superAdmins = await SuperAdminProfile.find()
            .populate({
                path: 'userId',
                match: { role: 'superadmin' },
                select: '-password' // exclude password
            });

        // Filter out profiles where userId was not matched (i.e. not a superadmin)
        const filtered = superAdmins.filter(item => item.userId);

        if (filtered.length === 0) {
            return res.status(404).json({ message: "No superAdmin found" });
        }

        // Flatten the data: merge Auth (userId) fields into the profile
        const flattened = filtered.map(profile => {
            const { userId, ...profileData } = profile.toObject();
            return {
                ...profileData,
                ...userId // merged auth details like _id, email, role, etc.
            };
        });

        return res.status(200).json({ data: flattened });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while retrieving superAdmin",
            error: error.message
        });
    }
};

module.exports = {
    createProfile, getProfile, createJobPost, uploadCvWithJobDetails, getAllCvWithJobDetails, editCvWithApplication, deleteCvWithApplication,
    uploadSingleCvFilewhileEdit, deleteSingleCvFilewhileEdit, downloadCV,
    getAllJob, updateJobPost, deleteJobPost, getAllJobApplicants, getJobApplicants, updateApplicationStatus,
    getCompanyNotifications, markAsRead, getAllDoneInterviewsOfCompany, getReportOfEachCandidate,
    getDashboard, scheduleInterview, getInterviewees, getInterviewers, cancelInterview, getSuperAdmin
}
