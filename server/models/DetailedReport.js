// const { Schema, model } = require('mongoose');

// const DetailedReportSchema = new Schema({
//     candidateOverview: {
//         fullName: { type: String, default: "" },
//         email: { type: String, default: "" },
//         positionApplied: { type: String, default: "" },
//         interviewDate: { type: Date },
//         interviewType: { type: String, default: "" },
//         summary: { type: String, default: "" }
//     },
//     interviewPerformance: {
//         duration: { type: String, default: "" },
//         totalQuestions: { type: Number, default: 0 },
//         questionsAnswered: { type: Number, default: 0 },
//         overallScore: { type: Number, default: 0 },
//         overallRecommendation: { type: String, default: "" }
//     },
//     skillsAssessment: [
//         {
//             skillName: { type: String, default: "" },
//             score: { type: Number, default: 0 },
//             percentage: { type: Number, default: 0 },
//             analysis: { type: String, default: "" }
//         }
//     ],
//     codeEvaluation: {
//         positives: [{ type: String }],
//         areasForImprovement: [{ type: String }]
//     },
//     detailedFeedback: {
//         technicalSkills: { list: [{ type: String }], analysis: { type: String, default: "" } },
//         communicationSkills: { list: [{ type: String }], analysis: { type: String, default: "" } },
//         behavioralSkills: { list: [{ type: String }], analysis: { type: String, default: "" } },
//         jobSpecificCompetencies: { list: [{ type: String }], analysis: { type: String, default: "" } },
//         communicationRating: { type: Number, default: 0 },
//         behavioralRating: { type: Number, default: 0 }
//     },
//     interviewerSummary: { type: String, default: "" },
//     companyProfile: {
//         companyName: { type: String, default: "" },
//         industry: { type: String, default: "" },
//         companySize: { type: String, default: "" },
//         headquarters: { type: String, default: "" },
//         tagline: { type: String, default: "" },
//         website: { type: String, default: "" },
//         overview: { type: String, default: "" }
//     },
//     interviewerProfile: {
//         name: { type: String, default: "" },
//         headline: { type: String, default: "" },
//         yearsOfExperience: { type: Number, default: 0 },
//         location: { type: String, default: "" },
//         topSkills: [{ type: String }],
//         languages: [{ type: String }],
//         summary: { type: String, default: "" }
//     }
// }, { timestamps: true });


// const DetailedReport = model("DetailedReport", DetailedReportSchema);
// module.exports = DetailedReport

















const { Schema, model } = require('mongoose');
const DetailedReportSchema = new Schema({
    candidateOverview: {
        fullName: { type: String, default: "" },
        email: { type: String, default: "" },
        positionApplied: { type: String, default: "" },
        interviewDate: { type: Date, default: Date.now },
        interviewType: { type: String, default: "" },
        summary: { type: String, default: "" }
    },
    interviewPerformance: {
        duration: { type: String, default: "" },
        totalQuestions: { type: Number, default: 0 },
        questionsAnswered: { type: Number, default: 0 },
        overallScore: { type: Number, default: 0 },
        overallRecommendation: { type: String, default: "" }
    },
    skillsAssessment: [
        {
            skillName: { type: String, default: "" },
            score: { type: Number, default: 0 },
            percentage: { type: Number, default: 0 },
            analysis: { type: String, default: "" }
        }
    ],
    codeEvaluation: {
        positives: [{ type: String, default: "" }],
        areasForImprovement: [{ type: String, default: "" }]
    },
    detailedFeedback: {
        technicalSkills: { 
            list: [{ type: String, default: "" }], 
            analysis: { type: String, default: "" } 
        },
        communicationSkills: { 
            list: [{ type: String, default: "" }], 
            analysis: { type: String, default: "" } 
        },
        behavioralSkills: { 
            list: [{ type: String, default: "" }], 
            analysis: { type: String, default: "" } 
        },
        jobSpecificCompetencies: { 
            list: [{ type: String, default: "" }], 
            analysis: { type: String, default: "" } 
        },
        communicationRating: { type: Number, default: 0 },
        behavioralRating: { type: Number, default: 0 }
    },
    interviewerSummary: { type: String, default: "" },
    companyProfile: {
        companyName: { type: String, default: "" },
        industry: { type: String, default: "" },
        companySize: { type: String, default: "" },
        headquarters: { type: String, default: "" },
        tagline: { type: String, default: "" },
        website: { type: String, default: "" },
        overview: { type: String, default: "" }
    },
    interviewerProfile: {
        name: { type: String, default: "" },
        headline: { type: String, default: "" },
        yearsOfExperience: { type: Number, default: 0 },
        location: { type: String, default: "" },
        topSkills: [{ type: String, default: "" }],
        languages: [{ type: String, default: "" }],
        summary: { type: String, default: "" }
    }
}, { timestamps: true });

const DetailedReport = model("DetailedReport", DetailedReportSchema);
module.exports = DetailedReport;
