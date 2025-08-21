const Auth = require("../models/Auth/Auth-model");
const cloudinary = require("../config/cloudinary");
const InterviewerProfile = require("../models/Auth/Interviewer-model");
const { calculateExactAge } = require("../utils/calculateExactAge");
const Interview = require("../models/Interview-model");
const { sendInterviewEmail } = require('../utils/interview-emailService');
const JobApplication = require("../models/JobApplication-model");
const InterviewWithCV = require("../models/InterviewWithCV");
const AccessToken = require('twilio').jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

const getProfile = async (req, res) => {
    const userId = req.user._id;
    try {
        const profile = await InterviewerProfile.findOne({ userId });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found",
            });
        }

        res.status(200).json({
            success: true,
            data: profile,
        });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch profile",
            error: error.message,
        });
    }
};

const createOrUpdateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const files = req.files || {};
        const body = req.body;

        // Parse stringified fields from FormData
        const parsedData = {
            fullname: body.fullname,
            headline: body.headline,
            location: body.location,
            phone: body.phone,
            summary: body.summary,
            gender: body.gender,
            dob: body.dob,
            yearsOfExperience: body.yearsOfExperience,
            socialMedia: JSON.parse(body.socialMedia || "{}"),
            experience: JSON.parse(body.experience || "[]"),
            education: JSON.parse(body.education || "[]"),
            skills: JSON.parse(body.skills || "[]"),
            certifications: JSON.parse(body.certifications || "[]"),
            languages: JSON.parse(body.languages || "[]"),
            interviewDomains: JSON.parse(body.interviewDomains || "[]"),
            availability: JSON.parse(body.availability || "[]"),
        };

        // Calculate age if DOB is provided
        if (parsedData.dob) {
            parsedData.age = calculateExactAge(parsedData.dob);
        }

        // Upload profile picture to Cloudinary if exists
        let profilePictureUrl = "";
        if (files.profilePicture) {
            const profilePicResult = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: "interviewer_profile_pictures",
                        transformation: [{ width: 500, height: 500, crop: "limit" }],
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                uploadStream.end(files.profilePicture[0].buffer);
            });
            profilePictureUrl = profilePicResult.secure_url;
        }

        // Get user email
        const user = await Auth.findOne({ _id: userId }).select("email");

        // Prepare profile data
        const profileData = {
            user: userId,
            email: user.email,
            ...parsedData,
            ...(profilePictureUrl && { profilePicture: profilePictureUrl }),
        };

        // Validate required fields
        const requiredFields = [
            "fullname",
            "headline",
            "location",
            "phone",
            "summary",
            "yearsOfExperience",
        ];

        const missingFields = requiredFields.filter((field) => !profileData[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(", ")}`,
            });
        }

        // Validate interview domains (at least one required)
        if (profileData.interviewDomains.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one interview domain is required",
            });
        }

        // Validate availability (at least one slot required)
        if (profileData.availability.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one availability slot is required",
            });
        }

        // Find existing profile or create new one
        let profile = await InterviewerProfile.findOneAndUpdate(
            { userId },
            profileData,
            {
                new: true,
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true, // Ensures default values are set for new documents
            }
        );

        res.status(201).json({
            success: true,
            message: "Profile saved successfully",
            data: profile,
        });
    } catch (err) {
        console.error("Error saving profile:", err);

        // Handle specific error types
        if (err instanceof SyntaxError) {
            return res.status(400).json({
                success: false,
                message: "Invalid data format",
                error: "Malformed JSON in one of the fields",
            });
        }

        if (err.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                error: err.message,
            });
        }

        if (err.message.includes("Cloudinary")) {
            return res.status(500).json({
                success: false,
                message: "File upload failed",
                error: err.message,
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to save profile",
            error: err.message,
        });
    }
};

const getInterviewerInterviews = async (req, res) => {

    try {
        const interviews = await Interview.find({
            interviewerId: req.user.id,
            // isActive: true
        })
            .sort({ start: 1 })
            .lean();

        res.json(interviews);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getInterviewerInterviewsbycv = async (req, res) => {

    try {
        const interviews = await InterviewWithCV.find({
            interviewerId: req.user.id,
            // isActive: true
        })
            .sort({ start: 1 })
            .lean();

        res.json(interviews);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

const cancelInterview = async (req, res) => {
    const _id = req.params.id;
    const interviewerId = req.user._id;

    try {
        const interview = await Interview.findOne({
            _id: _id,
            interviewerId: interviewerId
        }).populate("candidateId", "email fullname");

        if (!interview) {
            return res.status(404).json({ message: 'Interview not found' });
        }

        if (interview.status === 'cancelled') {
            return res.status(400).json({ message: 'Interview is already cancelled' });
        }

        interview.status = 'cancelled';
        interview.isActive = false;
        interview.cancelledAt = Date.now();
        interview.cancelledBy = 'Interviewer';
        await interview.save();


        // Update JobApplication status for the candidate
        await JobApplication.findOneAndUpdate(
            {
                applicantId: interview.candidateId._id,
                'items.jobId': interview.jobId
            },
            {
                $set: { 'items.$.status': 'Shortlisted' }
            }
        );

        // Send cancellation email
        await sendInterviewEmail({
            to: interview.candidateId.email,
            subject: 'Your Interview Has Been Cancelled',
            template: 'Interview-Cancelled-By-Interviewer',
            context: {
                candidateName: interview.candidateName,
                jobTitle: interview.jobTitle,
                interviewerName: interview.interviewerName,
                date: interview.start.toLocaleDateString(),
                time: interview.start.toLocaleTimeString(),
                endTime: interview.end.toLocaleTimeString(),
                location: interview.location
            }
        });

        res.status(200).json({ message: 'Interview cancelled successfully' });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Failed to cancel interview', error: error.message });
    }
};

const getInterviewDetailsForInterviewer = async (req, res) => {
    try {
        const interview = await Interview.findOne({
            interviewId: req.params.id,
            interviewerId: req.user.id
        }).populate('candidateId', 'fullname email');

        if (!interview) {
            return res.status(404).json({ message: 'Interview not found or access denied' });
        }

        res.status(200).json({
            ...interview.toObject(),
            candidate: interview.candidateId
        });
    } catch (error) {
        console.error('Interviewer details error:', error);
        res.status(500).json({
            message: 'Failed to fetch interview details',
            error: error.message
        });
    }
};

const generateTokenForInterviewer = async (req, res) => {
    try {
        const { identity, room } = req.body;

        if (!identity || !room) {
            return res.status(400).json({ error: 'Identity and room name are required' });
        }

        // Add expiration time (4 hours)
        const token = new AccessToken(
            process.env.TWILIO_ACCOUNT_SID,
            process.env.TWILIO_API_KEY,
            process.env.TWILIO_SECRET_KEY,
            { identity, ttl: 14400 }
        );

        const videoGrant = new VideoGrant({
            room,
            maxParticipantDuration: 14400
        });
        token.addGrant(videoGrant);

        // Add audio and video permissions
        token.addGrant(new VideoGrant());
        // token.addGrant(new AudioGrant());

        res.status(200).json({
            token: token.toJwt(),
            identity,
            room
        });
    } catch (error) {
        console.error('Interviewer token error:', error);
        res.status(500).json({
            error: 'Failed to generate video token',
            details: error.message
        });
    }
};


module.exports = {
    createOrUpdateProfile, getProfile, getInterviewerInterviews, getInterviewerInterviewsbycv,
    cancelInterview, getInterviewDetailsForInterviewer, generateTokenForInterviewer,
};
