const { customAlphabet } = require('nanoid');
const Interview = require('../models/Interview-model');
const InterviewWithCV = require('../models/InterviewWithCV');
const MockInterviews = require('../models/Mock_Interviews-model');

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
        const existingInMock = await MockInterviews.findOne({ interviewId: uniqueId });

        isUnique = !existingInInterview && !existingInWithCV && !existingInMock;
    }

    return uniqueId;
};

module.exports = createUniqueInterviewId; // ✅ Correct export