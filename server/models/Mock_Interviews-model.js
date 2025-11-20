const { Schema, model } = require('mongoose');

const mockInterviewSchema = new Schema({
    interviewId: {
        type: String,
        required: true,
        unique: true
    },
    reportId: {
        type: Schema.Types.ObjectId,
        ref: 'Report',
    },
    requestId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    profile: {
        type: String,
        required: true
    },
    candidateName: {
        type: String,
        required: true
    },
    candidateEmail: {
        type: String,
        required: true
    },
    candidatePhone: {
        type: String,
        required: true
    },
    interviewerName: {
        type: String,
        required: true
    },
    experienceLevel: {
        type: String,
        required: true
    },
    interviewerChoice: {
        type: String,
        required: true
    },
    interviewerId: {
        type: Schema.Types.ObjectId,
        ref: 'Auth',
        required: true
    },
    interviewDate: {
        type: Date,
        required: true
    },
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    },
    notes: {
        type: String
    },
    status: {
        type: String,
        enum: ['scheduled', 'inProcess', 'completed', 'cancelled'],
        default: 'scheduled'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    deletedAt: {
        type: Date
    },
    isLinkSent: {
        type: Boolean,
        default: false
    },
    cancelledAt: {
        type: Date,
    },
    cancelledBy: {
        type: String,
        enum: ['Candidate', 'Interviewer', 'Recruitway', ""],
    },
}, { timestamps: true });

const MockInterviews = model('MockInterviews', mockInterviewSchema);

module.exports = MockInterviews;
