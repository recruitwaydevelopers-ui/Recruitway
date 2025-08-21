const { Schema, model } = require('mongoose');

const SkillSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    percentage: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    }
}, { _id: false });

const CodeEvaluationSchema = new Schema({
    type: {
        type: String,
        required: true,
        enum: ['positive', 'warning']
    },
    points: {
        type: [String],
        required: true
    }
}, { _id: false });

const CodeTaskSchema = new Schema({
    lang: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    evaluation: {
        type: [CodeEvaluationSchema],
        required: true
    }
}, { _id: false });

const InterviewReportSchema = new Schema({
    // Interview Id
    interviewId: {
        type: String,
        required: true
    },
    companyId: {
        type: Schema.Types.ObjectId,
        ref: 'Auth',
        required: true
    },
    interviewerId: {
        type: Schema.Types.ObjectId,
        ref: 'Auth',
        required: true
    },

    // Candidate Information
    candidateName: {
        type: String,
        required: true
    },
    candidateEmail: {
        type: String,
        required: true
    },

    // Position Information
    positionTitle: {
        type: String,
        required: true
    },
    interviewDate: {
        type: Date,
        required: true
    },

    // Metrics
    overallScore: {
        type: Number,
        min: 0,
        max: 100
    },
    questionsAnswered: {
        type: Number,
        min: 0
    },
    totalQuestions: {
        type: Number,
        min: 0
    },
    duration: {
        type: Number,
        min: 0
    }, // in minutes

    // Skills Assessment
    skills: {
        type: [SkillSchema],
        default: []
    },

    // Code Assessment
    codeTasks: {
        type: [CodeTaskSchema],
        default: []
    },

    // Summary
    interviewerSummary: {
        type: String
    }
}, { timestamps: true });

const Report = model('Report', InterviewReportSchema);

module.exports = Report