const { Schema, model } = require('mongoose');

const skillSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    score: {
        type: Number,
        min: 0,
        max: 10,
        required: true
    },
    percentage: {
        type: Number,
        min: 0,
        max: 100,
        required: true
    }
});

const codeEvaluationSchema = new Schema({
    type: {
        type: String,
        enum: ['positive', 'improvement'],
        required: true
    },
    points: [{
        type: String,
        required: true
    }]
});

const feedbackSchema = new Schema({
    technicalSkills: [String],  // Changed from [feedbackPointSchema] to [String]
    communicationSkills: [String],  // Changed from [feedbackPointSchema] to [String]
    behavioralSkills: [String],  // Changed from [feedbackPointSchema] to [String]
    jobSpecificCompetencies: [String],  // Changed from [feedbackPointSchema] to [String]
    communicationRating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    behavioralRating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    }
});

const interviewReportSchema = new Schema({
    interviewId: {
        type: String,
        required: true,
        index: true
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
    interviewType: {
        type: String,
        enum: ['technical', 'non-technical'],
        required: true
    },
    candidateName: {
        type: String,
        required: true,
        trim: true
    },
    candidateEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    positionTitle: {
        type: String,
        required: true,
        trim: true
    },
    interviewDate: {
        type: Date,
        required: true
    },
    duration: {
        type: Number,
        required: true,
        min: 1
    },
    questionsAnswered: {
        type: Number,
        required: true,
        min: 0
    },
    totalQuestions: {
        type: Number,
        required: true,
        min: 1
    },
    overallScore: {
        type: Number,
        required: true,
        min: 0,
        max: 10
    },
    skills: [skillSchema],
    codeEvaluation: [codeEvaluationSchema],
    feedback: {
        type: feedbackSchema,
        default: () => ({
            technicalSkills: [],
            communicationSkills: [],
            behavioralSkills: [],
            jobSpecificCompetencies: [],
            communicationRating: 0,
            behavioralRating: 0
        })
    },
    interviewerSummary: {
        type: String,
        required: true
    },
    overallRecommendation: {
        type: String,
        enum: ['Strongly Recommended', 'Recommended', 'Recommended with Reservations', 'Not Recommended'],
        required: true
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    aiReportNormalized: {
        type: Schema.Types.ObjectId,
        ref: "DetailedReport"
    },
    sentToCompany: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Add a virtual for completion percentage
interviewReportSchema.virtual('completionPercentage').get(function () {
    return Math.round((this.questionsAnswered / this.totalQuestions) * 100);
});

// Add a method to calculate average skill score
interviewReportSchema.methods.getAverageSkillScore = function () {
    if (this.skills.length === 0) return 0;

    const total = this.skills.reduce((sum, skill) => sum + skill.score, 0);
    return (total / this.skills.length).toFixed(1);
};

// Add a pre-save hook to validate that questionsAnswered doesn't exceed totalQuestions
interviewReportSchema.pre('save', function (next) {
    if (this.questionsAnswered > this.totalQuestions) {
        this.invalidate('questionsAnswered', 'Questions answered cannot exceed total questions');
    }
    next();
});

// Create the model
const Report = model('Report', interviewReportSchema);

module.exports = Report;