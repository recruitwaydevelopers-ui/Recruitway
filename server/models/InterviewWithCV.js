const { Schema, model } = require('mongoose');

const interviewwithcvSchema = new Schema({
    interviewId: {
        type: String,
        required: true,
        unique: true
    },
    companyId: {
        type: Schema.Types.ObjectId,
        ref: 'Auth',
        required: true
    },
    cvId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    jobId: {
        type: Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    jobTitle: {
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

const InterviewWithCV = model('InterviewWithCV', interviewwithcvSchema);

module.exports = InterviewWithCV;
