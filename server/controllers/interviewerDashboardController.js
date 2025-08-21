const InterviewerProfile = require("../models/Auth/Interviewer-model");
const Interview = require("../models/Interview-model");
const Report = require("../models/Report-model");

const getInterviewerProfileCompletion = async (req, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required',
                data: {
                    completionPercentage: 0,
                    breakdown: {},
                    missingFields: []
                }
            });
        }

        const profile = await InterviewerProfile.findOne({ userId }).lean();

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found',
                data: {
                    completionPercentage: 0,
                    breakdown: {},
                    missingFields: []
                }
            });
        }

        const sections = [
            // Basic Info (total: 25 points)
            {
                key: 'fullname',
                label: 'Full Name',
                weight: 5,
                validate: (value) => !!value && value.trim().length >= 2
            },
            {
                key: 'email',
                label: 'Email',
                weight: 5,
                validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
            },
            {
                key: 'phone',
                label: 'Phone',
                weight: 4,
                validate: (value) => !!value && /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{8,}$/.test(value)
            },
            {
                key: 'gender',
                label: 'Gender',
                weight: 3,
                validate: (value) => ['male', 'female', 'other', 'prefer not to say'].includes(value)
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
                weight: 2,
                validate: (value) => !!value && value.trim().length >= 3
            },
            {
                key: 'headline',
                label: 'Professional Headline',
                weight: 2,
                validate: (value) => !!value && value.trim().length >= 10
            },

            // Profile Assets (total: 15 points)
            {
                key: 'profilePicture',
                label: 'Profile Picture',
                weight: 5,
                validate: (value) => !!value && value.trim().length > 0
            },
            {
                key: 'summary',
                label: 'Professional Summary',
                weight: 10,
                validate: (value) => !!value && value.trim().length > 0
            },

            // Professional Background (total: 30 points)
            {
                key: 'yearsOfExperience',
                label: 'Years of Experience',
                weight: 4,
                validate: (value) => !!value && value.trim().length > 0
            },
            {
                key: 'experience',
                label: 'Work Experience',
                weight: 8,
                validate: (value) => Array.isArray(value) && value.length >= 1 &&
                    value.every(exp => exp?.title?.trim() && exp?.company?.trim())
            },
            {
                key: 'education',
                label: 'Education',
                weight: 7,
                validate: (value) => Array.isArray(value) && value.length >= 1 &&
                    value.every(edu => edu?.degree?.trim() && edu?.institution?.trim() && edu?.year)
            },
            {
                key: 'skills',
                label: 'Skills',
                weight: 6,
                validate: (value) => Array.isArray(value) && value.length >= 1 &&
                    value.every(skill => !!skill?.skill)
            },
            {
                key: 'certifications',
                label: 'Certifications',
                weight: 5,
                validate: (value) => Array.isArray(value) && value.length >= 1
            },
            {
                key: 'languages',
                label: 'Languages',
                weight: 2,
                validate: (value) => Array.isArray(value) && value.length >= 1
            },

            // Interview-Specific (total: 20 points)
            {
                key: 'interviewDomains',
                label: 'Interview Domains',
                weight: 12,
                validate: (value) => Array.isArray(value) && value.length >= 1
            },
            {
                key: 'availability',
                label: 'Availability',
                weight: 8,
                validate: (value) => Array.isArray(value) && value.length >= 1 &&
                    value.every(slot => slot?.day && slot?.time && slot?.timezone)
            },

            // Social Media (total: 10 points)
            {
                key: 'socialMedia',
                label: 'Social Profiles',
                weight: 10,
                validate: (value) => !!value && (
                    (value?.linkedin?.trim().length > 0) ||
                    (value?.github?.trim().length > 0) ||
                    (value?.twitter?.trim().length > 0)
                )
            }
        ];

        // Verify total = 100
        const total = sections.reduce((sum, section) => sum + section.weight, 0);

        let completion = 0;
        const breakdown = {};
        const missingFields = [];

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

const getInterviewerInterviewStats = async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ error: "User is required" });
    }

    try {
        const interviews = await Interview.find({ interviewerId: userId }).lean();

        res.status(200).json({ data: interviews });
    } catch (error) {
        console.error("Error fetching interviews:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getInterviewerReportsStats = async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ error: "User is required" });
    }

    try {
        const reports = await Report.find({ interviewerId: userId }).lean();

        res.status(200).json({ data: reports });
    } catch (error) {
        console.error("Error fetching reports:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { getInterviewerProfileCompletion, getInterviewerInterviewStats, getInterviewerReportsStats };