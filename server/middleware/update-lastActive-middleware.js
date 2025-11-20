const CandidateProfile = require("../models/Auth/Candidate-model");
const CompanyProfile = require("../models/Auth/Company-model");
const InterviewerProfile = require("../models/Auth/Interviewer-model");
const SuperAdminProfile = require("../models/Auth/SuperAdmin-model");

const updateLastActive = async (req, res, next) => {
    try {
        if (req.user && req.user._id) {
            let model;

            // Select the appropriate model based on user role
            switch (req.user.role) {
                case 'interviewee':
                    model = CandidateProfile;
                    break;
                case 'company':
                    model = CompanyProfile;
                    break;
                case 'interviewer':
                    model = InterviewerProfile;
                    break;
                default:
                    model = SuperAdminProfile;
                    break;
            }

            // Ensure lastActive field is defined in the model schema
            await model.findOneAndUpdate(
                { userId: req.user._id },
                { $set: { lastActive: new Date() } },
                { new: true, upsert: true }
            );
        }
        next();
    } catch (error) {
        console.error("Failed to update last active:", error.message);
        next();  // Continue to next middleware even if error occurs
    }
};

module.exports = updateLastActive;

