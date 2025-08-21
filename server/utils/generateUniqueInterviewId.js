const { customAlphabet } = require('nanoid');
const Interview = require('../models/Interview-model');
const InterviewWithCV = require('../models/InterviewWithCV');

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const generateInterviewId = customAlphabet(alphabet, 9);

const createUniqueInterviewId = async () => {
    let uniqueId;
    let isUnique = false;

    while (!isUnique) {
        uniqueId = generateInterviewId();

        // Check in both models
        const existingInInterview = await Interview.findOne({ interviewId: uniqueId });
        const existingInWithCV = await InterviewWithCV.findOne({ interviewId: uniqueId });

        isUnique = !existingInInterview && !existingInWithCV;
    }

    return uniqueId;
};

module.exports = createUniqueInterviewId; // ✅ Correct export