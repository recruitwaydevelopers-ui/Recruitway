const mongoose = require("mongoose");
const JobApplication = require("../models/JobApplication-model");
const Interview = require("../models/Interview-model");
const CandidateProfile = require("../models/Auth/Candidate-model");


const getUserProfileCompletion = async (req, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const profile = await CandidateProfile.findOne({ userId }).lean();

        if (!profile) {
            return res.status(404).json({
                message: 'User profile not found',
                completionPercentage: 0,
                breakdown: {},
                missingFields: []
            });
        }

        const sections = [
            // Basic info (total: 15)
            {
                key: 'fullname',
                label: 'Full Name',
                weight: 3,
                validate: (value) => !!value && typeof value === 'string' && value.trim().length > 0
            },
            {
                key: 'email',
                label: 'Email',
                weight: 3,
                validate: (value) => !!value && typeof value === 'string' && value.includes('@')
            },
            {
                key: 'phone',
                label: 'Phone',
                weight: 3,
                validate: (value) => !!value && typeof value === 'string' && value.trim().length >= 10
            },
            {
                key: 'gender',
                label: 'Gender',
                weight: 2,
                validate: (value) => !!value && ['male', 'female', 'other'].includes(value.toLowerCase())
            },
            {
                key: 'dob',
                label: 'Date of Birth',
                weight: 2,
                validate: (value) => !!value && !isNaN(new Date(value).getTime())
            },
            {
                key: 'location',
                label: 'Location',
                weight: 1,
                validate: (value) => !!value && typeof value === 'string' && value.trim().length > 0
            },
            {
                key: 'headline',
                label: 'Headline',
                weight: 1,
                validate: (value) => !!value && typeof value === 'string' && value.trim().length > 0
            },
            // Files (total: 15)
            {
                key: 'profilePicture',
                label: 'Profile Picture',
                weight: 5,
                validate: (value) => !!value && typeof value === 'string' && value.trim().length > 0
            },
            {
                key: 'resume',
                label: 'Resume',
                weight: 10,
                validate: (value) => !!value && typeof value === 'string' && value.trim().length > 0
            },
            // Text sections (total: 5)
            {
                key: 'summary',
                label: 'Summary',
                weight: 5,
                validate: (value) => !!value && typeof value === 'string' && value.trim().length >= 50
            },
            // Array fields (total: 55)
            {
                key: 'experience',
                label: 'Experience',
                weight: 20,
                validate: (value) => Array.isArray(value) && value.length > 0 &&
                    value.every(exp => exp.title && exp.company)
            },
            {
                key: 'education',
                label: 'Education',
                weight: 15,
                validate: (value) => Array.isArray(value) && value.length > 0 &&
                    value.every(edu => edu.institution && edu.degree)
            },
            {
                key: 'skills',
                label: 'Skills',
                weight: 10,
                validate: (value) => Array.isArray(value) && value.length > 0
            },
            {
                key: 'certifications',
                label: 'Certifications',
                weight: 5,
                validate: (value) => Array.isArray(value) && value.length > 0
            },
            {
                key: 'languages',
                label: 'Languages',
                weight: 3,
                validate: (value) => Array.isArray(value) && value.length > 0
            },
            {
                key: 'projects',
                label: 'Projects',
                weight: 2,
                validate: (value) => Array.isArray(value) && value.length > 0
            },
            // Social media (total: 10)
            {
                key: 'socialMedia',
                label: 'Social Media',
                weight: 10,
                validate: (value) => !!value && (
                    (value.linkedin && value.linkedin.trim().length > 0) ||
                    (value.github && value.github.trim().length > 0) ||
                    (value.twitter && value.twitter.trim().length > 0) ||
                    (value.facebook && value.facebook.trim().length > 0)
                )
            }
        ];

        let completion = 0;
        const breakdown = {};
        const missingFields = [];

        // Process all sections
        sections.forEach(section => {
            const value = profile[section.key];
            const isValid = section.validate(value);

            if (isValid) {
                completion += section.weight;
                breakdown[section.label] = section.weight;
            } else {
                missingFields.push(section.label);
                breakdown[section.label] = 0;
            }
        });

        // Cap at 100% (just in case)
        completion = Math.min(completion, 100);

        res.json({
            completionPercentage: completion,
            breakdown: breakdown,
            missingFields: missingFields
        });

    } catch (error) {
        console.error('Error calculating profile completion:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

const getUserApplicationStatusStats = async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ error: "userId is required" });
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: "Invalid userId" });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    try {
        const data = await JobApplication.aggregate([
            {
                $match: {
                    applicantId: userObjectId
                }
            },
            { $unwind: "$items" },
            {
                $lookup: {
                    from: "jobs",
                    localField: "items.jobId",
                    foreignField: "_id",
                    as: "job"
                }
            },
            { $unwind: { path: "$job", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    jobTitle: "$job.title",
                    status: "$items.status",
                    createdAt: "$items.createdAt",
                    companyId: "$items.companyId"
                }
            }
        ]);

        res.status(200).json({ data });
    } catch (error) {
        // console.error("Error fetching application status data:", error);
        return res.status(500).json({ success: false, message: 'Server error. Could not create user.' });
    }
};

const getUserInterviewStats = async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ error: "User is required" });
    }

    try {
        const interviews = await Interview.find({ candidateId: userId }).lean();

        res.status(200).json({ data: interviews });
    } catch (error) {
        console.error("Error fetching interviews:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { getUserProfileCompletion, getUserApplicationStatusStats, getUserInterviewStats };
