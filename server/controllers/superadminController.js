const cloudinary = require("../config/cloudinary");
const Auth = require('../models/Auth/Auth-model');
const SuperAdminProfile = require('../models/Auth/SuperAdmin-model');
const CompanyProfile = require('../models/Auth/Company-model');
const Job = require('../models/Job');
const JobApplication = require('../models/JobApplication-model');
const CandidateProfile = require('../models/Auth/Candidate-model');
const Interview = require('../models/Interview-model');
const { default: mongoose } = require('mongoose');
const axios = require("axios");
const { sendInterviewEmail } = require('../utils/interview-emailService');
const bcrypt = require('bcrypt');
const InterviewerProfile = require("../models/Auth/Interviewer-model");
const createUniqueInterviewId = require("../utils/generateUniqueInterviewId");
const CVForInterview = require("../models/CvForInterview");
const InterviewWithCV = require("../models/InterviewWithCV");
const { loginController } = require("./authController");

const addUser = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        // console.log(email, password, role);

        if (!email || !password || !role) {
            return res.status(400).json({ success: false, message: 'Please provide email, password, and role' });
        }

        const existingUser = await Auth.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Encrypt password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt)

        const user = new Auth({
            email,
            password: hashedPassword,
            role,
            isVerified: true,
        });

        await user.save();

        // 📧 Send confirmation email
        await sendInterviewEmail({
            to: email,
            subject: 'User Created',
            template: 'addNewUser',
            context: {
                email,
                password,
                role
            }
        });

        return res.status(201).json({ success: true, message: 'User created successfully' });
    } catch (error) {
        // console.error('Error adding user:', error);
        return res.status(500).json({ success: false, message: 'Server error. Could not create user.' });
    }
};

const getProfile = async (req, res) => {
    try {
        const userId = req.user._id;

        let profile = await SuperAdminProfile.findOne({ userId });
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

        // Process file uploads
        let profilePictureUrl = '';
        if (files.profilePicture) {
            const profilePictureResult = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'Super_Admin_Profile_Pic',
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
            fullname: body.fullName || '',
            email: user.email || "",
            phone: body.phoneNumber || "",
            address: body.address || "",
            ...(profilePictureUrl && { profilePicture: profilePictureUrl })
        };

        // Find and update or create new profile
        const updatedProfile = await SuperAdminProfile.findOneAndUpdate(
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

const getAllCompaniesWithJobs = async (req, res) => {
    try {

        const allCompanyUsers = await Auth.find({ role: "company" }).select("_id");

        if (!allCompanyUsers || allCompanyUsers.length === 0) {
            return res.status(404).json({ message: "No Company found." });
        }

        const companyUserIds = allCompanyUsers.map(user => user._id);

        const companyProfiles = await CompanyProfile.find({ userId: { $in: companyUserIds } });

        if (!companyProfiles || companyProfiles.length === 0) {
            return res.status(404).json({ message: "No company profiles found." });
        }

        const allJobs = await Job.find({ userId: { $in: companyUserIds } });

        const companiesWithJobs = companyProfiles.map(company => {
            const jobs = allJobs.filter(job => job.userId.toString() === company.userId.toString());
            return {
                company,
                jobs
            };
        });

        return res.status(200).json({ companiesWithJobs });

    } catch (error) {
        console.error("Error fetching company data:", error);
        res.status(500).json({ message: "Server error. Please try again later.", error: error.message });
    }
};

const getAllJobsOfSingleCompany = async (req, res) => {
    const { companyId } = req.params;

    if (!companyId) {
        return res.status(400).json({ error: "Company ID is required." });
    }

    try {
        const allJobs = await Job.find({ userId: companyId }).sort({ posted: -1 });

        if (!allJobs || allJobs.length === 0) {
            return res.status(404).json({ message: "No jobs found for this company." });
        }

        return res.status(200).json({ jobs: allJobs });
    } catch (error) {
        console.error("Error fetching company jobs:", error);
        return res.status(500).json({
            error: "Server error. Please try again later.",
            details: error.message
        });
    }
};

const getDetailsOfSingleJob = async (req, res) => {
    const { jobId } = req.params;

    if (!jobId) {
        return res.status(400).json({ message: "Job ID is required." });
    }

    try {
        const jobDetail = await Job.findById(jobId);

        if (!jobDetail) {
            return res.status(404).json({ message: "Job not found." });
        }

        return res.status(200).json({ jobDetail });
    } catch (error) {
        // console.error("Error fetching job details:", error);
        return res.status(500).json({ error: "Server error. Please try again later.", message: error.message });
    }
};

const changeJobStatus = async (req, res) => {
    const { jobId } = req.params;
    const { status } = req.body;

    const validStatuses = ["Active", "Inactive", "Draft"];

    if (!jobId) {
        return res.status(400).json({ message: 'Job ID is required.' });
    }

    if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid or missing job status.' });
    }

    try {
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({ message: 'Job not found.' });
        }

        if (job.status === status) {
            return res.status(400).json({ message: 'Job already has the specified status.' });
        }

        job.status = status;
        await job.save();

        return res.status(200).json({ message: 'Job status updated successfully.' });
    } catch (error) {
        // console.error('Error updating job status:', error);
        return res.status(500).json({ message: 'Server error while updating job status.' });
    }
};

const changeAsFlagged = async (req, res) => {
    const { jobId } = req.params;

    if (!jobId) {
        return res.status(400).json({ message: 'Job ID is required.' });
    }

    try {
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({ message: 'Job not found.' });
        }

        if (job.isFlagged) {
            return res.status(400).json({ message: 'Job is already marked as flagged.' });
        }

        job.isFlagged = true;
        await job.save();

        return res.status(200).json({ message: 'Job successfully marked as flagged.' });
    } catch (error) {
        // console.error('Error marking job as flagged:', error);
        return res.status(500).json({ message: 'Server error while flagging the job.' });
    }
};

const changeAsUnFlagged = async (req, res) => {
    const { jobId } = req.params;

    if (!jobId) {
        return res.status(400).json({ message: 'Job ID is required.' });
    }

    try {
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({ message: 'Job not found.' });
        }

        if (!job.isFlagged) {
            return res.status(400).json({ message: 'Job is not flagged yet.' });
        }

        job.isFlagged = false;
        await job.save();

        return res.status(200).json({ message: 'Job was successfully removed from flagged status.' });

    } catch (error) {
        // console.error('Error marking job as flagged:', error);
        return res.status(500).json({ message: 'Server error while flagging the job.' });
    }
};

const deleteJob = async (req, res) => {
    const { jobId } = req.params;

    try {
        // Find the job by jobId and userId, then delete it
        const job = await Job.findOneAndDelete({ _id: jobId });

        if (!job) {
            return res.status(404).json({ message: "Job not found or unauthorized access." });
        }

        // Remove jobId from all JobApplication items
        await JobApplication.updateMany(
            { "items.jobId": jobId },
            { $pull: { items: { jobId } } }
        );

        res.status(200).json({ message: "Job deleted successfully." });
    } catch (error) {
        console.error("Error deleting job post:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getAllApplicants = async (req, res) => {
    const { jobId } = req.params;

    if (!jobId) {
        return res.status(400).json({ message: "Job ID is required." });
    }

    try {
        const applications = await JobApplication.find({ "items.jobId": jobId })
            .populate('applicantId')
            .lean();

        if (!applications || applications.length === 0) {
            return res.status(404).json({ message: "No applicants found for this job." });
        }

        const shortlistedApplications = applications.flatMap(app => {
            const shortlistedItems = app.items.filter(item =>
                item.jobId.toString() === jobId && item.status === "Shortlisted" || item.status === "Interview Scheduled"
            );

            if (shortlistedItems.length === 0) return [];

            return shortlistedItems.map(item => ({
                authUser: app.applicantId,
                item
            }));
        });

        if (shortlistedApplications.length === 0) {
            return res.status(404).json({ message: "No shortlisted applicants found for this job." });
        }

        const candidateProfiles = await CandidateProfile.find({
            userId: { $in: shortlistedApplications.map(app => app.authUser._id) }
        }).lean();

        const profileMap = new Map(candidateProfiles.map(profile => [profile.userId.toString(), profile]));

        const enrichedApplicants = shortlistedApplications.map(app => ({
            candidateProfile: profileMap.get(app.authUser._id.toString()) || null,
            item: app.item
        }));

        const jobDetail = await Job.findById(jobId).lean();
        if (!jobDetail) {
            return res.status(404).json({ message: "Job not found." });
        }

        return res.status(200).json({ job: jobDetail, applicants: enrichedApplicants });

    } catch (error) {
        console.error("Error fetching applicants:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const getSingleApplicants = async (req, res) => {
    const { id } = req.params;

    // Validation: Check if id is provided
    if (!id) {
        return res.status(400).json({ message: "Applicant ID is required." });
    }

    try {
        // Find the applicant profile by user ID
        const applicantProfile = await CandidateProfile.findOne({ userId: id });

        if (!applicantProfile) {
            return res.status(404).json({ message: "Applicant not found." });
        }

        return res.status(200).json({ applicantProfile });
    } catch (error) {
        console.error("Error fetching applicant profile:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

const createInterviews = async (req, res) => {
    try {
        const {
            candidateId,
            candidateName,
            interviewerId,
            interviewerName,
            jobId,
            jobTitle,
            companyId,
            companyName,
            start,
            end,
            status = 'scheduled',
            notes,
        } = req.body;

        // 🔍 Required field validation
        const requiredFields = [candidateId, candidateName, interviewerId, interviewerName, jobId, jobTitle, companyId, companyName, start, end];
        if (requiredFields.some(field => !field)) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields',
            });
        }

        // 🕒 Date validation
        const startDate = new Date(start);
        const endDate = new Date(end);
        if (isNaN(startDate) || isNaN(endDate) || startDate >= endDate) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or illogical start/end time',
            });
        }

        // ✅ Entity existence validation
        const [candidate, job, interviewer] = await Promise.all([
            CandidateProfile.findOne({ userId: candidateId }),
            Job.findById(jobId),
            InterviewerProfile.findOne({ userId: interviewerId }),
        ]);
        if (!candidate) return res.status(404).json({ success: false, message: 'Candidate not found' });
        if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
        if (!interviewer) return res.status(404).json({ success: false, message: 'Interviewer not found' });

        // 🆔 Generate unique interviewId
        const interviewId = await createUniqueInterviewId();

        // 💾 Save Interview
        const interview = await Interview.create({
            interviewId,
            candidateId,
            candidateName,
            jobId,
            jobTitle,
            companyId,
            companyName,
            interviewerId,
            interviewerName,
            start: startDate,
            end: endDate,
            notes,
            status,
            isActive: true,
        });

        // 🔄 Update JobApplication status
        await JobApplication.findOneAndUpdate(
            { applicantId: candidateId, 'items.jobId': jobId },
            { $set: { 'items.$.status': 'Interview Scheduled' } }
        );

        // const interviewLink = `${process.env.CLIENT_URL}/interview-room/${interviewId}`;

        // 📧 Send confirmation email to candidate
        await sendInterviewEmail({
            to: candidate.email,
            subject: 'Interview Scheduled',
            template: 'Candidate-Interview-Scheduled',
            context: {
                candidateName: candidate.fullname,
                jobTitle: job.title,
                interviewerName,
                date: startDate.toLocaleDateString(),
                time: startDate.toLocaleTimeString(),
                endTime: endDate.toLocaleTimeString(),
                notes: notes || 'None provided',
            }
        });

        // 📧 Send confirmation email to interviewer
        await sendInterviewEmail({
            to: interviewer.email,
            subject: 'Interview Scheduled',
            template: 'Interviewer-Interview-Scheduled',
            context: {
                candidateName: candidate.fullname,
                jobTitle: job.title,
                interviewerName,
                date: startDate.toLocaleDateString(),
                time: startDate.toLocaleTimeString(),
                endTime: endDate.toLocaleTimeString(),
                notes: notes || 'None provided',
            }
        });

        return res.status(201).json({
            success: true,
            message: 'Interview scheduled successfully',
            data: {
                interview,
            },
        });

    } catch (error) {
        console.error('Schedule Interview Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while scheduling interview',
        });
    }
};

const updateInterview = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Basic validation
        const requiredFields = ['candidateId', 'jobId', 'interviewerId', 'interviewerName', 'start', 'end'];
        for (const field of requiredFields) {
            if (!updateData[field]) {
                return res.status(400).json({
                    success: false,
                    message: `Missing required field: ${field}`
                });
            }
        }

        // Fetch the existing interview
        const existingInterview = await Interview.findById(id);
        if (!existingInterview) {
            return res.status(404).json({ success: false, message: 'Interview not found' });
        }

        // Prevent changing candidate/job for existing interview
        if (existingInterview.candidateId.toString() !== updateData.candidateId ||
            existingInterview.jobId.toString() !== updateData.jobId) {
            return res.status(400).json({
                success: false,
                message: 'Cannot change candidate or job for existing interview'
            });
        }

        // Date handling
        const startDate = new Date(updateData.start);
        const endDate = new Date(updateData.end);
        if (startDate >= endDate) {
            return res.status(400).json({ success: false, message: 'End time must be after start time' });
        }

        // Check for conflicts
        const conflictingInterview = await Interview.findOne({
            _id: { $ne: id },
            start: { $lt: endDate },
            end: { $gt: startDate },
            status: { $ne: "cancelled" },
            $or: [
                { interviewerId: updateData.interviewerId },
                { candidateId: updateData.candidateId }
            ]
        });

        if (conflictingInterview) {
            return res.status(409).json({
                success: false,
                message: 'Scheduling conflict detected',
                conflictWith: conflictingInterview.interviewerId.equals(updateData.interviewerId)
                    ? 'interviewer'
                    : 'candidate',
                conflictingInterviewId: conflictingInterview._id
            });
        }

        // 🆔 Generate unique interviewId
        const interviewId = await createUniqueInterviewId();

        // Update interview in DB
        const updatedInterview = await Interview.findByIdAndUpdate(
            id,
            {
                $set: {
                    interviewId,
                    interviewerId: updateData.interviewerId,
                    interviewerName: updateData.interviewerName,
                    start: startDate,
                    end: endDate,
                    notes: updateData.notes,
                    status: "scheduled",
                    cancelledAt: "",
                    cancelledBy: "",
                    updatedAt: Date.now(),
                    isActive: true,
                    isLinkSent: false
                }
            },
            { new: true, runValidators: true }
        ).populate('candidateId', 'fullname email')
            .populate('jobId', 'title')
            .populate('interviewerId', 'fullname email');

        // 🔄 Update JobApplication status
        await JobApplication.findOneAndUpdate(
            { applicantId: updatedInterview.candidateId._id, 'items.jobId': updatedInterview.jobId._id },
            { $set: { 'items.$.status': 'Interview Scheduled' } }
        );

        await sendInterviewEmail({
            to: updatedInterview.candidateId.email,
            subject: 'Your Interview Details Have Changed',
            template: 'Candidate-Interview-Update',
            context: {
                candidateName: updatedInterview.candidateName,
                jobTitle: updatedInterview.jobId.title,
                interviewerName: updatedInterview.interviewerName,
                date: updatedInterview.start.toLocaleDateString(),
                oldTime: existingInterview.start.toLocaleString(),
                newTime: updatedInterview.start.toLocaleString(),
                endTime: updatedInterview.end.toLocaleString(),
                notes: updatedInterview.notes
            }
        });

        await sendInterviewEmail({
            to: updatedInterview.interviewerId.email,
            subject: 'Your Interview Details Have Changed',
            template: 'Interviewer-Interview-Update',
            context: {
                candidateName: updatedInterview.candidateId.fullname,
                jobTitle: updatedInterview.jobId.title,
                interviewerName: updatedInterview.interviewerName,
                date: updatedInterview.start.toLocaleDateString(),
                oldTime: existingInterview.start.toLocaleString(),
                newTime: updatedInterview.start.toLocaleString(),
                endTime: updatedInterview.end.toLocaleString(),
                notes: updatedInterview.notes
            }
        });

        return res.status(200).json({
            success: true,
            message: 'Interview updated successfully',
            data: updatedInterview
        });

    } catch (error) {
        console.error('Error updating interview:', error.response?.data || error.message);
        return res.status(500).json({
            success: false,
            message: 'Failed to update interview',
            error: error.message
        });
    }
};

const deleteInterview = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if interview exists and populate candidate and job
        const interview = await Interview.findById(id)
            .populate('candidateId', 'fullname email')
            .populate('jobId', 'title')
            .populate("interviewerId", "fullname email");

        if (!interview) {
            return res.status(404).json({
                success: false,
                message: 'Interview not found'
            });
        }

        const emailContext = {
            jobId: interview.jobId._id,
            jobTitle: interview.jobId.title,
            date: interview.start.toLocaleDateString(),
            startTime: interview.start.toLocaleString(),
            endTime: interview.end.toLocaleString(),
            interviewerEmail: interview.interviewerId.email,
            interviewerId: interview.interviewerId._id,
            interviewerName: interview.interviewerName,
            candidateEmail: interview.candidateId.email,
            candidateId: interview.candidateId._id,
            candidateName: interview.fullname
        };

        const deletedInterview = await Interview.findByIdAndDelete(id);

        await JobApplication.findOneAndUpdate(
            {
                applicantId: emailContext.candidateId,
                'items.jobId': emailContext.jobId
            },
            {
                $set: { 'items.$.status': 'Shortlisted' }
            }
        );



        console.log(interview);
        // return;

        // Send cancellation email to candidate
        await sendInterviewEmail({
            to: deletedInterview.candidateId.email,
            subject: 'Interview Cancellation Notice',
            template: 'Interview-Cancellation-Candidate',
            context: {
                candidateName: deletedInterview.candidateId.fullname,
                jobTitle: deletedInterview.jobId.title,
                scheduledTime: deletedInterview.start.toLocaleString(),
                reason: 'Administrative decision'
            }
        });

        // Send cancellation email to interiewer
        await sendInterviewEmail({
            to: deletedInterview.candidateId.email,
            subject: 'Interview Cancellation Notice',
            template: 'Interview-Cancellation-Candidate',
            context: {
                candidateName: deletedInterview.candidateId.fullname,
                jobTitle: deletedInterview.jobId.title,
                scheduledTime: deletedInterview.start.toLocaleString(),
                reason: 'Administrative decision'
            }
        });

        res.status(200).json({
            success: true,
            message: 'Interview cancelled successfully',
            data: deletedInterview
        });

    } catch (error) {
        console.error('Error deleting interview:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to cancel interview',
            error: error.message
        });
    }
};

const getAllAuth = async (req, res) => {
    try {
        const users = await Auth.find().sort({ createdAt: -1 });

        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'No auth records found', auth: [] });
        }

        res.status(200).json({ auth: users });
    } catch (err) {
        console.error('Error fetching auth records:', err.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const verifyUser = async (req, res) => {
    const { id } = req.params
    try {
        const user = await Auth.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'User already verified' });
        }

        user.isVerified = true;
        await user.save();

        // Send the verification email
        await sendInterviewEmail({
            to: user.email,
            subject: 'Account Verification',
            template: 'accountVerificationDone',
            context: {
                email: user.email
            }
        });

        res.json({ message: 'Account verified successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

const revokeVerification = async (req, res) => {
    const { id } = req.params
    try {
        const user = await Auth.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.isVerified) {
            return res.status(400).json({ message: 'User is not verified' });
        }

        user.isVerified = false;
        await user.save();

        // Send the verification email
        await sendInterviewEmail({
            to: user.email,
            subject: 'Account Verification',
            template: 'accountVerificationRevoke',
            context: {
                email: user.email
            }
        });

        res.json({ message: 'Verification revoked successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

const changeUserRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;

        // Validate role
        const validRoles = ['user', 'company', 'interviewer', 'superadmin'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ success: false, message: 'Invalid role specified' });
        }

        // Verify the user exists
        const user = await Auth.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Prevent modifying the current superadmin
        if (user._id.toString() === req.user.id) {
            return res.status(400).json({ success: false, message: 'Cannot change your own role' });
        }

        // Update user role
        user.role = role;
        await user.save();

        res.status(200).json({ success: true, message: 'User role updated successfully' });
    } catch (error) {
        console.error('Error changing user role:', error);
        res.status(500).json({ success: false, message: 'Failed to change user role' });
    }
};

const getAllCompaniesWithVerificationStatus = async (req, res) => {
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

        res.status(200).json({ companies: companiesWithVerificationStatus });
    } catch (error) {
        // console.error(error);
        res.status(500).json({ message: "Server error while fetching companies." });
    }
};

const makeCompaniesVerified = async (req, res) => {
    const { companyId } = req.params;
    try {
        const updatedCompany = await Auth.findByIdAndUpdate(companyId, { isVerified: true }, { new: true });

        if (!updatedCompany) {
            return res.status(404).json({ message: "Company not found." });
        }

        res.status(200).json({ message: "Company marked as verified." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error." });
    }
};

const makeCompaniesUnverified = async (req, res) => {
    const { companyId } = req.params;
    try {
        const updatedCompany = await Auth.findByIdAndUpdate(companyId, { isVerified: false }, { new: true });

        if (!updatedCompany) {
            return res.status(404).json({ message: "Company not found." });
        }

        res.status(200).json({ message: "Company marked as unverified." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error." });
    }
};

const getAllCandidatesWithVerificationStatus = async (req, res) => {
    try {
        // Find all candidate users from the Auth model
        const allCandidatesUsers = await Auth.find({ role: "user" }).select("_id isVerified");

        if (!allCandidatesUsers || allCandidatesUsers.length === 0) {
            return res.status(404).json({ message: "No Candidates found." });
        }

        // Extract candidate user ids
        const candidateUserIds = allCandidatesUsers.map(user => user._id);

        // Find candidate profiles based on userId
        const candidateProfiles = await CandidateProfile.find({ userId: { $in: candidateUserIds } });

        if (!candidateProfiles || candidateProfiles.length === 0) {
            return res.status(404).json({ message: "No candidate profiles found." });
        }

        // Merge `isVerified` from Auth into each candidate profile
        const candidateWithVerificationStatus = candidateProfiles.map(profile => {
            const authUser = allCandidatesUsers.find(user => user._id.toString() === profile.userId.toString());
            return {
                ...profile.toObject(), // Spread all fields of the candidate profile
                isVerified: authUser ? authUser.isVerified : false // Add isVerified from Auth
            };
        });

        res.status(200).json({ candidates: candidateWithVerificationStatus });
    } catch (error) {
        // console.error(error);
        res.status(500).json({ message: "Server error while fetching candidates." });
    }
};

const makeCandidatesVerified = async (req, res) => {
    const { candidateId } = req.params;

    try {
        const candidate = await Auth.findByIdAndUpdate(
            candidateId,
            { isVerified: true },
            { new: true }
        );

        console.log(candidate);


        if (!candidate) {
            return res.status(404).json({ message: "Candidate not found." });
        }
        res.status(200).json({ message: "Candidate marked as verified." });
    } catch (error) {
        console.error("Error verifying candidate:", error);
        res.status(500).json({ message: "Server error." });
    }
};

const makeCandidatesUnverified = async (req, res) => {
    const { candidateId } = req.params;

    try {
        const candidate = await Auth.findByIdAndUpdate(
            candidateId,
            { isVerified: false },
            { new: true }
        );

        if (!candidate) {
            return res.status(404).json({ message: "Candidate not found." });
        }
        res.status(200).json({ message: "Candidate marked as unverified." });
    } catch (error) {
        console.error("Error un-verifying candidate:", error);
        res.status(500).json({ message: "Server error." });
    }
};

const getAllShortlistedCandidates = async (req, res) => {
    try {
        const applications = await JobApplication.find({ "items.status": "Shortlisted" });

        const shortlisted = [];

        for (const app of applications) {
            const candidate = await CandidateProfile.findOne({ userId: app.applicantId }).lean();
            if (!candidate) continue;

            for (const item of app.items) {
                if (item.status === "Shortlisted") {
                    const job = await Job.findById(item.jobId).lean();
                    const company = await CompanyProfile.findOne({ userId: item.companyId }).lean();

                    shortlisted.push({
                        _id: item._id,
                        candidateId: candidate.userId,
                        candidateName: candidate.fullname,
                        jobId: job?._id || "N/A",
                        jobTitle: job?.title || "N/A",
                        companyId: company?.userId || "N/A",
                        companyName: company?.fullname || "N/A",
                        candidateEmail: candidate?.email || "N/A",
                        candidatePhone: candidate?.phone || "N/A",
                        profilePicture: candidate?.profilePicture || null,
                        shortlistedAt: item.updatedAt || item.createdAt || null
                    });
                }
            }
        }

        return res.status(200).json({ shortlisted })
    } catch (err) {
        console.error("Error fetching shortlisted candidates:", err);
        res.status(500).json({ message: "Server Error" });
    }
};

const getAllInterviewesOfAllCandidates = async (req, res) => {
    try {
        const interviews = await Interview.find()
            .populate('candidateId', 'name email') // include name and email
            .populate('interviewerId', 'name email') // include name and email
            .lean();

        const userIds = interviews.map(i => i.candidateId?._id).filter(Boolean);

        const profiles = await CandidateProfile.find({ userId: { $in: userIds } })
            .select('userId profilePicture')
            .lean();

        const profileMap = profiles.reduce((acc, profile) => {
            acc[profile.userId.toString()] = profile.profilePicture;
            return acc;
        }, {});

        const formatted = interviews.map((intv) => ({
            isLinkSent: intv.isLinkSent,
            _id: intv._id,
            candidateId: intv.candidateId?._id || null,
            candidateName: intv.candidateId?.name || intv.candidateName,
            candidateEmail: intv.candidateId?.email || null,
            interviewerName: intv.interviewerId?.name || intv.interviewerName,
            interviewerEmail: intv.interviewerId?.email || null,
            profilePicture: profileMap[intv.candidateId?._id?.toString()] || null,
            jobId: intv.jobId,
            jobTitle: intv.jobTitle,
            companyId: intv.companyId,
            companyName: intv.companyName,
            start: intv.start,
            end: intv.end,
            notes: intv.notes,
            status: intv.status,
            isActive: intv.isActive,
            createdAt: intv.createdAt,
            updatedAt: intv.updatedAt,
            interviewId: intv.interviewId
        }));

        return res.status(200).json({ interviewes: formatted });
    } catch (error) {
        console.error("Error getting interview data:", error);
        return res.status(500).json({ message: error.message });
    }
};

const getCandidateAllInterviews = async (req, res) => {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid candidate ID." });
    }

    try {
        const interviews = await Interview.find({ candidateId: id });
        res.status(200).json({ data: interviews });
    } catch (error) {
        console.error("Error retrieving interviews:", error);
        res.status(500).json({ message: "Error retrieving interview data." });
    }
};

const sendInterviewEmails = async (req, res) => {
    const { id } = req.params;
    const {
        meetingCode, email, interviewerEmail, emailSubject, emailMessage, interviewerEmailSubject,
        interviewerEmailMessage, candidateName, interviewerName, jobTitle, scheduledDate, scheduledStartTime, scheduledEndTime } = req.body;

    if (
        !email || !interviewerEmail || !meetingCode ||
        !emailSubject || !emailMessage ||
        !interviewerEmailSubject || !interviewerEmailMessage
    ) {
        return res.status(400).json({ error: "All fields are required" });
    }

    // Parse time string in format "05:35 PM GMT+5:30"
    function parseTime(timeStr) {
        if (!timeStr) return null;

        // Updated regex to include GMT offset part
        const timeMatch = timeStr.match(/(\d{1,2}):(\d{2}) (AM|PM) GMT([+-]\d{1,2}:\d{2})/i);
        if (!timeMatch) return null;

        let hours = parseInt(timeMatch[1], 10);
        const minutes = parseInt(timeMatch[2], 10);
        const period = timeMatch[3].toUpperCase();

        // Convert to 24-hour format
        if (period === 'PM' && hours < 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;

        return { hours, minutes };
    }

    // Format date with time range
    function formatScheduledTime(dateStr, startTimeStr, endTimeStr) {
        if (!dateStr || !startTimeStr || !endTimeStr) return 'Time to be determined';

        // Parse the date - it's already in "Monday, June 16, 2025" format
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return 'Invalid date format';

        // Parse times
        const start = parseTime(startTimeStr);
        const end = parseTime(endTimeStr);
        if (!start || !end) return 'Invalid time format';

        // Format date as "Monday, June 16, 2025" (same as input)
        const dateFormatted = dateStr;

        // Format times as "5:35 PM" (without GMT offset)
        const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
        const startFormatted = new Date(date);
        startFormatted.setHours(start.hours, start.minutes);
        const endFormatted = new Date(date);
        endFormatted.setHours(end.hours, end.minutes);

        const startTime = startFormatted.toLocaleTimeString('en-US', timeOptions);
        const endTime = endFormatted.toLocaleTimeString('en-US', timeOptions);

        return `${dateFormatted} from ${startTime} to ${endTime}`;
    }

    const details = formatScheduledTime(scheduledDate, scheduledStartTime, scheduledEndTime)

    try {
        // Send to Candidate
        await sendInterviewEmail({
            to: email,
            subject: emailSubject,
            template: 'interviewInviteCandidate',
            context: {
                name: candidateName,
                meetingCode,
                jobTitle,
                scheduledTime: details,
                message: emailMessage
            }
        });

        // Send to Interviewer
        await sendInterviewEmail({
            to: interviewerEmail,
            subject: interviewerEmailSubject,
            template: 'interviewInviteInterviewer',
            context: {
                name: interviewerName,
                candidateName,
                meetingCode,
                jobTitle,
                scheduledTime: details,
                message: interviewerEmailMessage
            }
        });

        // Optional: mark as sent in DB
        await Interview.findByIdAndUpdate(id, { isLinkSent: true });

        res.status(200).json({ message: "Emails sent successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to send interview emails" });
    }
};

// const markAsCancelled = async (req, res) => {
//     const { interviewId } = req.params; // Interview ID from route parameters

//     try {
//         // Find the interview by ID and update its status to "Cancelled"
//         const interview = await Interview.findByIdAndUpdate(
//             interviewId,
//             { status: 'cancelled', isActive: false },
//             { new: true }
//         );

//         if (!interview) {
//             return res.status(404).json({ message: 'Interview not found' });
//         }

//         await JobApplication.findOneAndUpdate(
//             { applicantId: candidateId, 'items.jobId': jobId },
//             { $set: { 'items.$.status': 'Applied' } }
//         );

//         // Send cancellation email
//         await sendInterviewEmail({
//             to: deletedInterview.candidateId.email,
//             subject: 'Interview Cancellation Notice',
//             template: 'interviewCancellation',
//             context: {
//                 candidateName: deletedInterview.candidateId.fullname,
//                 jobTitle: deletedInterview.jobId.title,
//                 scheduledTime: deletedInterview.start.toLocaleString(),
//                 reason: 'Administrative decision'
//             }
//         });
//         res.status(200).json({ message: 'Interview status successfully updated to Cancelled' });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Failed to update interview status', error: err.message });
//     }
// };

const markAsCancelled = async (req, res) => {
    const { interviewId } = req.params;

    try {
        // Update interview status to "cancelled" and deactivate it
        const interview = await Interview.findByIdAndUpdate(
            interviewId,
            { status: 'cancelled', isActive: false, cancelledBy: 'Recruitway', cancelledAt: Date.now() },
            { new: true }
        ).populate('candidateId jobId'); // Populate candidate and job info for email

        if (!interview) {
            return res.status(404).json({ message: 'Interview not found' });
        }

        // Revert job application status to "Shortlisted"
        await JobApplication.findOneAndUpdate(
            { applicantId: interview.candidateId._id, 'items.jobId': interview.jobId._id },
            { $set: { 'items.$.status': 'Shortlisted' } }
        );

        // Send cancellation email to candidate
        await sendInterviewEmail({
            to: interview.candidateId.email,
            subject: 'Interview Cancellation Notice',
            template: 'interviewCancellation',
            context: {
                candidateName: interview.candidateName,
                jobTitle: interview.jobTitle,
                scheduledTime: interview.start.toLocaleString(),
                reason: 'Administrative decision'
            }
        });

        res.status(200).json({ message: 'Interview status successfully updated to Cancelled' });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Failed to update interview status',
            error: err.message
        });
    }
};

const getAllJobsWithCV = async (req, res) => {
    try {
        const allJobsWithCV = await CVForInterview.find();
        if (allJobsWithCV.length === 0) {
            return res.status(404).json({ message: 'No jobs with CVs found.' });
        }
        res.status(200).json({ data: allJobsWithCV });
    } catch (error) {
        console.error('Error retrieving jobs with CV:', error);
        res.status(500).json({ message: 'Internal server error while retrieving jobs with CV.' });
    }
};

const getAllCVForInterviewOfSingleJob = async (req, res) => {
    const { jobId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
        return res.status(400).json({ message: 'Invalid job ID format.' });
    }

    try {
        const jobWithCV = await CVForInterview.findById(jobId);
        if (!jobWithCV) {
            return res.status(404).json({ message: 'No CV found for the specified job ID.' });
        }

        res.status(200).json({ data: jobWithCV });
    } catch (error) {
        console.error('Error retrieving CVs for job:', error);
        res.status(500).json({ message: 'Internal server error while retrieving CVs for the job.' });
    }
};

const getCVInterviews = async (req, res) => {
    const { jobId, cvId } = req.params;

    // Validate MongoDB ObjectIds
    if (!mongoose.Types.ObjectId.isValid(jobId) || !mongoose.Types.ObjectId.isValid(cvId)) {
        return res.status(400).json({ message: "Invalid job ID or CV ID." });
    }

    try {
        const interviews = await InterviewWithCV.find({
            jobId: jobId,
            cvId: cvId
        }).sort({ start: 1 });

        res.status(200).json({ data: interviews });
    } catch (error) {
        console.error("Error retrieving interviews:", error);
        res.status(500).json({ message: "Error retrieving interview data." });
    }
};

const scheduleInterviewWithCV = async (req, res) => {
    try {
        const { jobId } = req.params;
        const {
            jobTitle,
            candidateName,
            candidateEmail,
            candidatePhone,
            interviewerName,
            interviewerId,
            interviewDate,
            start,
            end,
            notes,
            status
        } = req.body.interviewDetails;

        const { cvId } = req.body;

        if (
            !jobId || !cvId || !jobTitle ||
            !candidateName || !candidateEmail || !candidatePhone ||
            !interviewerName || !interviewerId || !interviewDate || !start || !end
        ) {
            return res.status(400).json({ message: 'All required fields must be filled' });
        }

        const interviewStart = new Date(`${interviewDate}T${start}`);
        const interviewEnd = new Date(`${interviewDate}T${end}`);
        if (isNaN(interviewStart) || isNaN(interviewEnd)) {
            return res.status(400).json({ message: 'Invalid or illogical start/end time' });
        }

        const cvDoc = await CVForInterview.findById(jobId).lean();
        if (!cvDoc) {
            return res.status(404).json({ message: "CV not found" });
        }

        const companyProfile = await CompanyProfile.findOne({ userId: cvDoc.companyId }).select("userId fullname").lean();

        const companyName = companyProfile ? companyProfile.fullname : null;
        const companyId = companyProfile ? companyProfile.userId : null;

        const BUFFER_MINUTES = 10;
        const BUFFER_MS = BUFFER_MINUTES * 60 * 1000;
        const bufferedStart = new Date(interviewStart.getTime() - BUFFER_MS);
        const bufferedEnd = new Date(interviewEnd.getTime() + BUFFER_MS);

        const conflictingInterview = await InterviewWithCV.findOne({
            interviewerId,
            status: { $in: ['scheduled', 'inProcess'] },
            isActive: true,
            $or: [
                {
                    start: { $lt: bufferedEnd },
                    end: { $gt: bufferedStart }
                }
            ]
        });

        if (conflictingInterview) {
            return res.status(409).json({
                message: `Time conflict: Interviewer has another interview within ${BUFFER_MINUTES} mins.`
            });
        }

        const interviewerDetails = await InterviewerProfile.findOne({ userId: interviewerId });
        const interviewId = await createUniqueInterviewId();

        const newInterview = new InterviewWithCV({
            interviewId,
            companyId,
            cvId,
            jobId,
            jobTitle,
            companyName,
            candidateName,
            candidateEmail,
            candidatePhone,
            interviewerName,
            interviewerId,
            interviewDate: new Date(interviewDate),
            start: interviewStart,
            end: interviewEnd,
            notes: notes || '',
            status: 'scheduled',
            isLinkSent: false
        });

        await newInterview.save();

        const job = await CVForInterview.findById(jobId);
        if (!job) return res.status(404).json({ message: "Job not found" });

        const cvObjectId = new mongoose.Types.ObjectId(cvId);
        const exactCV = job.CvFile.find(cv => cv._id.equals(cvObjectId));

        if (!exactCV) return res.status(404).json({ message: "CV not found in job's CvFile list" });

        exactCV.status = "Interview Scheduled";
        await job.save();

        await sendInterviewEmail({
            to: candidateEmail,
            subject: 'Interview Scheduled',
            template: 'Random-Candidate-Interview-Scheduled',
            context: {
                candidateName,
                jobTitle: job.title,
                interviewerName,
                date: interviewDate,
                time: interviewStart.toLocaleTimeString(),
                endTime: interviewEnd.toLocaleTimeString(),
                interviewUrl: `${process.env.FRONTEND_URL}/videoroomforCVInterview`,
                notes: notes || 'None provided',
            }
        });

        await sendInterviewEmail({
            to: interviewerDetails.email,
            subject: 'Interview Scheduled',
            template: 'Interviewer-Interview-Scheduled',
            context: {
                candidateName,
                jobTitle: job.title,
                interviewerName,
                date: interviewDate,
                time: interviewStart.toLocaleTimeString(),
                endTime: interviewEnd.toLocaleTimeString(),
                notes: notes || 'None provided',
            }
        });

        return res.status(201).json({
            message: 'Interview scheduled successfully',
            interview: newInterview
        });

    } catch (error) {
        console.error('Error scheduling interview:', error);
        return res.status(500).json({ message: 'Server error while scheduling interview', error: error.message });
    }
};

const updateCVInterview = async (req, res) => {
    const { cvId, jobId, formDataId } = req.params;
    const {
        jobTitle,
        candidateName,
        candidateEmail,
        candidatePhone,
        interviewerName,
        interviewerId,
        interviewDate,
        start,
        end,
        notes,
        status
    } = req.body;

    try {
        if (
            !jobId || !cvId || !jobTitle ||
            !candidateName || !candidateEmail || !candidatePhone ||
            !interviewerName || !interviewerId || !interviewDate || !start || !end
        ) {
            return res.status(400).json({ message: 'All required fields must be filled' });
        }

        const interviewStart = new Date(`${interviewDate}T${start}`);
        const interviewEnd = new Date(`${interviewDate}T${end}`);
        if (isNaN(interviewStart) || isNaN(interviewEnd)) {
            return res.status(400).json({ message: 'Invalid interview time' });
        }

        const BUFFER_MINUTES = 10;
        const BUFFER_MS = BUFFER_MINUTES * 60 * 1000;
        const bufferedStart = new Date(interviewStart.getTime() - BUFFER_MS);
        const bufferedEnd = new Date(interviewEnd.getTime() + BUFFER_MS);

        const conflicting = await InterviewWithCV.findOne({
            _id: { $ne: formDataId },
            interviewerId,
            status: { $in: ['scheduled', 'inProcess'] },
            isActive: true,
            $or: [
                {
                    start: { $lt: bufferedEnd },
                    end: { $gt: bufferedStart }
                }
            ]
        });

        if (conflicting) {
            return res.status(409).json({
                message: `Time conflict: Interviewer has another interview within ${BUFFER_MINUTES} mins.`
            });
        }

        const interview = await InterviewWithCV.findById(formDataId);
        if (!interview) {
            return res.status(404).json({ message: 'Interview not found' });
        }

        const interviewerDetails = await InterviewerProfile.findOne({ userId: interviewerId });
        const newInterviewId = await createUniqueInterviewId();

        Object.assign(interview, {
            interviewId: newInterviewId,
            jobId,
            cvId,
            jobTitle,
            candidateName,
            candidateEmail,
            candidatePhone,
            interviewerName,
            interviewerId,
            interviewDate: new Date(interviewDate),
            start: interviewStart,
            end: interviewEnd,
            notes: notes || '',
            cancelledAt: "",
            cancelledBy: "",
            status: 'scheduled',
            isActive: true,
            isLinkSent: false
        });

        await interview.save();

        await sendInterviewEmail({
            to: candidateEmail,
            subject: 'Your Interview Details Have Changed',
            template: 'Candidate-Interview-Update',
            context: {
                candidateName,
                jobTitle,
                interviewerName,
                date: interviewDate,
                oldTime: interview.start.toLocaleTimeString(),
                newTime: interviewStart.toLocaleTimeString(),
                endTime: interviewEnd.toLocaleTimeString(),
                notes,
                interviewUrl: `${process.env.FRONTEND_URL}/videoroomforCVInterview`,
            }
        });

        await sendInterviewEmail({
            to: interviewerDetails.email,
            subject: 'Your Interview Details Have Changed',
            template: 'Interviewer-Interview-Update',
            context: {
                candidateName,
                jobTitle,
                interviewerName,
                date: interviewDate,
                oldTime: interview.start.toLocaleTimeString(),
                newTime: interviewStart.toLocaleTimeString(),
                endTime: interviewEnd.toLocaleTimeString(),
                notes
            }
        });

        return res.status(200).json({
            message: 'Interview updated successfully',
            interview
        });

    } catch (error) {
        console.error('Error updating interview:', error);
        return res.status(500).json({ message: 'Server error while updating interview', error: error.message });
    }
};

const cancelCVInterview = async (req, res) => {
    try {
        const { cvId, jobId, formDataId } = req.params;

        const interview = await InterviewWithCV.findOne({
            _id: formDataId,
            cvId,
            jobId,
            isActive: true
        });

        if (!interview) {
            return res.status(404).json({ message: 'Interview not found' });
        }

        interview.status = 'cancelled';
        interview.isActive = false;
        interview.cancelledBy = 'Recruitway';
        interview.cancelledAt = Date.now()
        await interview.save();

        return res.status(200).json({ message: 'Interview cancelled successfully' });

    } catch (error) {
        // console.error('Error cancelling interview:', error);
        return res.status(500).json({ message: error.message });
    }
};

const deleteCVInterview = async (req, res) => {
    try {
        const { cvId, jobId, formDataId } = req.params;

        const deleted = await InterviewWithCV.findOneAndDelete({
            _id: formDataId,
            cvId,
            jobId
        });

        if (!deleted) {
            return res.status(404).json({ message: 'Interview not found or already deleted' });
        }

        return res.status(200).json({ message: 'Interview deleted successfully' });

    } catch (error) {
        // console.error('Error deleting interview:', error);
        return res.status(500).json({ message: error.message });
    }
};

const getAllInterviewesOfAllCandidatesByCV = async (req, res) => {
    try {
        // Fetch all interviews
        const interviews = await InterviewWithCV.find()
            .populate('interviewerId', 'name email')
            .lean();

        // Map interviews and inject company name
        const formatted = interviews.map((intv) => ({
            isLinkSent: intv.isLinkSent,
            _id: intv._id,
            candidateName: intv.candidateName,
            candidateEmail: intv.candidateEmail || null,
            interviewerName: intv.interviewerName,
            interviewerEmail: intv.interviewerId?.email || null,
            jobId: intv.jobId,
            jobTitle: intv.jobTitle,
            companyId: intv.companyId || null,
            companyName: intv.companyName,
            start: intv.start,
            end: intv.end,
            notes: intv.notes,
            status: intv.status,
            isActive: intv.isActive,
            createdAt: intv.createdAt,
            updatedAt: intv.updatedAt,
            interviewId: intv.interviewId,
            cvId: intv.cvId
        }));

        return res.status(200).json({ interviewes: formatted });
    } catch (error) {
        console.error("Error getting interview data:", error);
        return res.status(500).json({ message: error.message });
    }
};

const sendInterviewEmailsForCV = async (req, res) => {
    const { id } = req.params;
    const {
        meetingCode, email, interviewerEmail, emailSubject, emailMessage, interviewerEmailSubject,
        interviewerEmailMessage, candidateName, interviewerName, jobTitle, scheduledDate, scheduledStartTime, scheduledEndTime } = req.body;

    if (
        !email || !interviewerEmail || !meetingCode ||
        !emailSubject || !emailMessage ||
        !interviewerEmailSubject || !interviewerEmailMessage
    ) {
        return res.status(400).json({ error: "All fields are required" });
    }

    // Parse time string in format "05:35 PM GMT+5:30"
    function parseTime(timeStr) {
        if (!timeStr) return null;

        // Updated regex to include GMT offset part
        const timeMatch = timeStr.match(/(\d{1,2}):(\d{2}) (AM|PM) GMT([+-]\d{1,2}:\d{2})/i);
        if (!timeMatch) return null;

        let hours = parseInt(timeMatch[1], 10);
        const minutes = parseInt(timeMatch[2], 10);
        const period = timeMatch[3].toUpperCase();

        // Convert to 24-hour format
        if (period === 'PM' && hours < 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;

        return { hours, minutes };
    }

    // Format date with time range
    function formatScheduledTime(dateStr, startTimeStr, endTimeStr) {
        if (!dateStr || !startTimeStr || !endTimeStr) return 'Time to be determined';

        // Parse the date - it's already in "Monday, June 16, 2025" format
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return 'Invalid date format';

        // Parse times
        const start = parseTime(startTimeStr);
        const end = parseTime(endTimeStr);
        if (!start || !end) return 'Invalid time format';

        // Format date as "Monday, June 16, 2025" (same as input)
        const dateFormatted = dateStr;

        // Format times as "5:35 PM" (without GMT offset)
        const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
        const startFormatted = new Date(date);
        startFormatted.setHours(start.hours, start.minutes);
        const endFormatted = new Date(date);
        endFormatted.setHours(end.hours, end.minutes);

        const startTime = startFormatted.toLocaleTimeString('en-US', timeOptions);
        const endTime = endFormatted.toLocaleTimeString('en-US', timeOptions);

        return `${dateFormatted} from ${startTime} to ${endTime}`;
    }

    const details = formatScheduledTime(scheduledDate, scheduledStartTime, scheduledEndTime)

    try {
        // Send to Candidate
        await sendInterviewEmail({
            to: email,
            subject: emailSubject,
            template: 'InterviewInviteRandomCandidate',
            context: {
                name: candidateName,
                meetingCode,
                jobTitle,
                scheduledTime: details,
                message: emailMessage,
                interviewUrl: `${process.env.FRONTEND_URL}/videoroomforCVInterview`
            }
        });

        // Send to Interviewer
        await sendInterviewEmail({
            to: interviewerEmail,
            subject: interviewerEmailSubject,
            template: 'interviewInviteInterviewer',
            context: {
                name: interviewerName,
                candidateName,
                meetingCode,
                jobTitle,
                scheduledTime: details,
                message: interviewerEmailMessage
            }
        });

        // Optional: mark as sent in DB
        await InterviewWithCV.findByIdAndUpdate(id, { isLinkSent: true });

        res.status(200).json({ message: "Emails sent successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to send interview emails" });
    }
};

const getAllInterviewers = async (req, res) => {
    try {
        const users = await Auth.find({ role: "interviewer" }).select("email");

        const profiles = await InterviewerProfile.find();

        const profiledUserIds = new Set(profiles.map(profile => profile.userId.toString()));

        const usersWithoutProfiles = users.filter(user => !profiledUserIds.has(user._id.toString()));

        const merged = [
            ...profiles.map(profile => ({ data: profile })),
            ...usersWithoutProfiles.map(user => ({ data: user }))
        ];

        res.status(200).json({
            success: true,
            count: merged.length,
            data: merged
        });
    } catch (error) {
        console.error("Error fetching interviewer data:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch interviewer data",
            error: error.message
        });
    }
};

const createInterviewer = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email) {
            return res
                .status(400)
                .json({ success: false, message: "Email is required" });
        }
        if (!password) {
            return res
                .status(400)
                .json({ success: false, message: "Password is required" });
        }

        const normalizedEmail = email.toLowerCase();
        const existing = await Auth.findOne({ email: normalizedEmail });
        if (existing) {
            return res
                .status(409)
                .json({
                    success: false,
                    message: "Interviewer with this email already exists",
                });
        }

        // Encrypt password

        const salt = bcrypt.genSaltSync(10);
        const hashPassword = await bcrypt.hashSync(password, salt);

        // Create a new user
        const newInterviewer = new Auth({
            email: email.toLowerCase(),
            password: hashPassword,
            role: "interviewer",
            isVerified: true,
        });

        await newInterviewer.save();

        await sendInterviewEmail({
            to: email,
            subject: "Interviewer Registration",
            template: "interviewer-welcome",
            context: {
                email: email,
                password: password,
                role: "Interviewer",
            },
        });

        res
            .status(201)
            .json({ success: true, message: "Interviewer Created Successfully" });
    } catch (error) {
        res
            .status(500)
            .json({
                success: false,
                message: "Failed to create interviewer",
                error: error.message,
            });
    }
};

const deleteInterviewer = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        await InterviewerProfile.findOneAndDelete({ userId });

        await Auth.findByIdAndDelete(userId);

        res.status(200).json({ message: 'Interviewer deleted successfully' });

    } catch (error) {
        console.error('Error deleting interviewer:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getInterviewersProfile = async (req, res) => {
    const { id } = req.params

    try {
        const profile = await InterviewerProfile.findById(id)

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found",
            });
        }

        res.status(200).json({ success: true, data: profile });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch profile",
            error: error.message,
        });
    }
}

module.exports = {
    addUser, getProfile, createProfile, getAllCompaniesWithJobs, getAllJobsOfSingleCompany, getDetailsOfSingleJob, changeJobStatus,
    changeAsFlagged, changeAsUnFlagged, deleteJob, getAllApplicants, getSingleApplicants,
    getAllAuth, verifyUser, revokeVerification, changeUserRole,
    createInterviews, updateInterview, getCandidateAllInterviews, deleteInterview,
    getAllCompaniesWithVerificationStatus, makeCompaniesVerified, makeCompaniesUnverified,
    getAllCandidatesWithVerificationStatus, makeCandidatesVerified, makeCandidatesUnverified, getAllShortlistedCandidates, getAllInterviewesOfAllCandidates,
    sendInterviewEmails, markAsCancelled,
    getAllJobsWithCV, getAllCVForInterviewOfSingleJob, scheduleInterviewWithCV, getCVInterviews,
    getAllInterviewers, createInterviewer, deleteInterviewer, getInterviewersProfile, updateCVInterview, cancelCVInterview, deleteCVInterview,
    getAllInterviewesOfAllCandidatesByCV, sendInterviewEmailsForCV
}
