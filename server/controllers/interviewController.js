const Interview = require("../models/Interview-model");
const Report = require("../models/Report-model");
const InterviewWithCV = require("../models/InterviewWithCV");
const CompanyProfile = require("../models/Auth/Company-model");
const InterviewerProfile = require("../models/Auth/Interviewer-model");
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const axios = require("axios");
const { mapParsedMarkdown, parseInterviewReport } = require("../utils/parseInterviewReport");
const DetailedReport = require("../models/DetailedReport");
const MockInterviews = require("../models/Mock_Interviews-model");
const MockReport = require("../models/MockReport-model");
const MockRequest = require("../models/MockRequest-model");
const VideoRecording = require("../models/VideoRecording");
const path = require("path");
const ejs = require("ejs");
const fs = require("fs");
// const pdf = require("html-pdf");
// const puppeteer = require("puppeteer");
const pdf = require("html-pdf-node");
const { sendReportEmail } = require("../utils/report-emailService");
const CodeTask = require("../models/CodeTask-model");


const getInterview = async (req, res) => {
    try {
        const { interviewId } = req.params;
        console.log(interviewId);

        if (!interviewId) {
            return res.status(400).json({
                success: false,
                message: 'Interview ID is required in the URL'
            });
        }


        const interview = await Interview.findOne({ interviewId });

        if (!interview) {
            return res.status(404).json({ success: false, message: 'Interview not found' });
        }

        // Optional: Check if user is authorized to view
        const userId = req.user?._id?.toString(); // assuming protect middleware sets req.user

        if (
            userId !== interview.candidateId.toString() &&
            userId !== interview.interviewerId.toString()
        ) {
            return res.status(403).json({ success: false, message: 'Not authorized to access this interview' });
        }

        return res.status(200).json({ success: true, data: interview });
    } catch (error) {
        console.error('Get Interview Error:', error);
        return res.status(500).json({ success: false, message: 'Server error while fetching interview' });
    }
};

const verifyAccessForCandidate = async (req, res) => {
    const { interviewId } = req.body;

    if (!interviewId) {
        return res.status(400).json({ valid: false, message: "interviewId is required" });
    }

    try {
        const interview = await Interview.findOne({ interviewId }).lean();

        if (!interview) {
            return res.status(404).json({ valid: false, message: "Interview not found" });
        }

        return res.status(200).json({ valid: true, source: 'Byjobpost', interviewDetails: interview });

    } catch (error) {
        // console.error("Error verifying candidate access:", error);
        return res.status(500).json({ valid: false, message: error.message });
    }
};

const verifyAccessForInterviewer = async (req, res) => {
    const { interviewId } = req.body;
    const start = process.hrtime();

    if (!interviewId) {
        return res.status(400).json({ valid: false, message: "Interview ID is required" });
    }

    try {
        // First: search in Interview
        let interview = await Interview.findOne({ interviewId }).lean();

        if (interview) {
            const time = process.hrtime(start);
            return res.status(200).json({
                valid: true,
                source: 'Byjobpost',
                interviewDetails: interview,
                timeMs: (time[0] * 1000 + time[1] / 1e6).toFixed(3)
            });
        }

        // Second: search in InterviewWithCV
        interview = await InterviewWithCV.findOne({ interviewId }).lean();

        if (interview) {
            const time = process.hrtime(start);
            return res.status(200).json({
                valid: true,
                source: 'ByCV',
                interviewDetails: interview,
                timeMs: (time[0] * 1000 + time[1] / 1e6).toFixed(3)
            });
        }

        // Not found
        const time = process.hrtime(start);
        return res.status(404).json({
            valid: false,
            message: 'Interviewer access not found in either collection.',
            timeMs: (time[0] * 1000 + time[1] / 1e6).toFixed(3)
        });

    } catch (error) {
        console.error('Error verifying interviewer access:', error);
        return res.status(500).json({ valid: false, message: 'Server Error', error: error.message });
    }
};

const verifyAccessForRandomCandidate = async (req, res) => {
    const { interviewId } = req.body;

    if (!interviewId) {
        return res.status(400).json({ valid: false, message: "interviewId is required" });
    }

    try {
        const interview = await InterviewWithCV.findOne({ interviewId }).lean();

        if (!interview) {
            return res.status(404).json({ valid: false, message: "Interview not found" });
        }

        return res.status(200).json({ valid: true, source: 'ByCV', interviewDetails: interview });

    } catch (error) {
        // console.error("Error verifying candidate access:", error);
        return res.status(500).json({ valid: false, message: error.message });
    }
};

const getInterviewDetails = async (req, res) => {
    const user = req.user;

    try {
        const filter = {
            interviewId: req.params.id,
        };

        if (user.role === 'interviewer') {
            filter.interviewerId = user.id;
        } else if (user.role === 'candidate') {
            filter.candidateId = user.id;
        } else {
            return res.status(403).json({ message: 'Access denied' });
        }

        const interview = await Interview.findOne(filter)
            .populate('interviewerId', 'fullname email')
            .populate('candidateId', 'fullname email');

        if (!interview) {
            return res.status(404).json({ message: 'Interview not found or access denied' });
        }

        res.status(200).json({
            ...interview.toObject(),
            interviewer: interview.interviewerId,
            initialCode: interview.initialCode || '// Write your code here\n',
            language: interview.language || 'javascript',
        });
    } catch (error) {
        console.error('Interview details error:', error);
        res.status(500).json({
            message: 'Failed to fetch interview details',
            error: error.message,
        });
    }
};

const updateInterviewStatus = async (req, res) => {
    try {
        const { interviewId } = req.body;

        if (!interviewId) {
            return res.status(400).json({ error: "Interview ID is required." });
        }

        let interview = await Interview.findOne({ interviewId });

        if (!interview) {
            interview = await InterviewWithCV.findOne({ interviewId });
        }

        if (!interview) {
            return res.status(404).json({ error: "Interview not found in either model." });
        }

        interview.status = "inProcess";
        await interview.save();

        res.status(200).json({ message: 'Interview status updated successfully.' });
    } catch (err) {
        // console.error("Error updating interview status:", err);
        res.status(500).json({ message: err.message });
    }
};

const updateStatusandSubmitReport = async (req, res) => {
    try {
        const { interviewId } = req.params;
        const { reportData } = req.body;
        const interviewerId = req.user.id;

        // Validate required fields
        const requiredFields = [
            'candidateName', 'candidateEmail', 'positionTitle', 'interviewDate',
            'duration', 'questionsAnswered', 'totalQuestions', 'overallScore',
            'interviewerSummary', 'overallRecommendation'
        ];
        for (const field of requiredFields) {
            if (!reportData[field]) {
                return res.status(400).json({
                    success: false,
                    message: `${field} is required`
                });
            }
        }
        // Validate interview type
        if (!reportData.interviewType || !['technical', 'non-technical'].includes(reportData.interviewType)) {
            return res.status(400).json({
                success: false,
                message: 'Valid interview type is required'
            });
        }
        // Validate skills
        if (!reportData.skills || reportData.skills.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'At least one skill assessment is required'
            });
        }
        // Validate questions answered vs total
        if (parseInt(reportData.questionsAnswered) > parseInt(reportData.totalQuestions)) {
            return res.status(400).json({
                success: false,
                message: 'Questions answered cannot exceed total questions'
            });
        }

        // Process feedback data - convert objects to strings
        const processFeedbackArray = (array) => {
            if (!array || array.length === 0) return [];
            return array.map(item => {
                // If item is an object with a point property, return the point
                if (typeof item === 'object' && item !== null && item.point) {
                    return item.point;
                }
                // If item is already a string, return it
                if (typeof item === 'string') {
                    return item;
                }
                // Otherwise return empty string
                return '';
            }).filter(point => point !== ''); // Remove empty strings
        };

        // Process codeTask and codeEvaluation only for technical interviews
        let processedCodeTask = [];
        let processedCodeEvaluation = [];

        if (reportData.interviewType === 'technical') {
            // Only include codeTask if it has valid data
            processedCodeTask = (reportData.codeTask || []).filter(task =>
                task && task.question && task.code && task.result
            );

            // Only include codeEvaluation if it has valid data
            processedCodeEvaluation = (reportData.codeEvaluation || []).filter(evaluation =>
                evaluation && evaluation.points && evaluation.points.length > 0 &&
                evaluation.points.every(point => point && point.trim() !== '')
            );
        }

        const [interview1, interview2] = await Promise.all([
            Interview.findOne({ interviewId: interviewId }),
            InterviewWithCV.findOne({ interviewId: interviewId })
        ]);
        const interview = interview1 || interview2;

        if (!interview) {
            return res.status(404).json({ message: "Interview not found" });
        }

        // Prepare report data with processed feedback
        // const report = new Report({
        //     interviewId: interviewId,
        //     companyId: interview.companyId,
        //     interviewType: reportData.interviewType,
        //     candidateName: reportData.candidateName,
        //     candidateEmail: reportData.candidateEmail,
        //     positionTitle: reportData.positionTitle,
        //     interviewDate: new Date(reportData.interviewDate),
        //     duration: parseInt(reportData.duration),
        //     questionsAnswered: parseInt(reportData.questionsAnswered),
        //     totalQuestions: parseInt(reportData.totalQuestions),
        //     overallScore: parseFloat(reportData.overallScore),
        //     skills: reportData.skills,
        //     codeTask: processedCodeTask,
        //     codeEvaluation: processedCodeEvaluation,
        //     feedback: {
        //         technicalSkills: processFeedbackArray(reportData.feedback.technicalSkills),
        //         communicationSkills: processFeedbackArray(reportData.feedback.communicationSkills),
        //         behavioralSkills: processFeedbackArray(reportData.feedback.behavioralSkills),
        //         jobSpecificCompetencies: processFeedbackArray(reportData.feedback.jobSpecificCompetencies),
        //         communicationRating: reportData.feedback.communicationRating || 0,
        //         behavioralRating: reportData.feedback.behavioralRating || 0
        //     },
        //     interviewerSummary: reportData.interviewerSummary,
        //     overallRecommendation: reportData.overallRecommendation,
        //     interviewerId: interviewerId
        // });

        // // Save the report
        // const savedReport = await report.save();

        // Build report object
        const reportPayload = {
            interviewId,
            companyId: interview.companyId,
            interviewType: reportData.interviewType,
            candidateName: reportData.candidateName,
            candidateEmail: reportData.candidateEmail,
            positionTitle: reportData.positionTitle,
            interviewDate: new Date(reportData.interviewDate),
            duration: parseInt(reportData.duration),
            questionsAnswered: parseInt(reportData.questionsAnswered),
            totalQuestions: parseInt(reportData.totalQuestions),
            overallScore: parseFloat(reportData.overallScore),
            skills: reportData.skills,
            codeTask: processedCodeTask,
            codeEvaluation: processedCodeEvaluation,
            feedback: {
                technicalSkills: processFeedbackArray(reportData.feedback.technicalSkills),
                communicationSkills: processFeedbackArray(reportData.feedback.communicationSkills),
                behavioralSkills: processFeedbackArray(reportData.feedback.behavioralSkills),
                jobSpecificCompetencies: processFeedbackArray(reportData.feedback.jobSpecificCompetencies),
                communicationRating: reportData.feedback.communicationRating || 0,
                behavioralRating: reportData.feedback.behavioralRating || 0
            },
            interviewerSummary: reportData.interviewerSummary,
            overallRecommendation: reportData.overallRecommendation,
            interviewerId
        };

        // ✅ Check if report exists
        let report = await Report.findOne({ interviewId });

        if (report) {
            // Update existing
            Object.assign(report, reportPayload);
            await report.save();
        } else {
            // Create new
            report = new Report(reportPayload);
            await report.save();
        }

        interview.status = 'completed';
        interview.reportId = report._id;
        await interview.save();

        // Return success response
        res.status(200).json({
            success: true,
            message: report ? 'Interview report updated successfully' : 'Interview report created successfully',
            reportId: report._id
        });
    } catch (error) {
        console.error('Error submitting interview report:', error);
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: messages
            });
        }
        // Handle other errors
        res.status(500).json({
            success: false,
            message: 'Failed to submit interview report',
            error: error.message
        });
    }
};

const getReport = async (req, res) => {
    const { interviewId } = req.params;

    if (!interviewId || interviewId.trim() === "") {
        return res.status(400).json({ success: false, message: "Interview ID is required." });
    }

    try {
        // Step 1: find report
        const report = await Report.findOne({ interviewId });
        if (!report) {
            return res.status(404).json({ success: false, message: "Report not found." });
        }

        // Step 2: fetch code 
        const codeTask = await CodeTask.findOne({ interviewId })

        // Step 3: fetch company profile
        const companyProfile = await CompanyProfile.findOne({ userId: report.companyId });
        if (!companyProfile) {
            return res.status(404).json({ success: false, message: "Company profile not found." });
        }

        // Step 4: fetch interviewer profile
        const interviewerProfile = await InterviewerProfile.findOne({ userId: report.interviewerId });
        if (!interviewerProfile) {
            return res.status(404).json({ success: false, message: "Interviewer profile not found." });
        }

        // step 5: fetch recording url
        const url = await VideoRecording.findOne({ interviewId }).select("-interviewId")

        // Step 6: merge
        const detailedReport = {
            ...report.toObject(),
            codeTask: codeTask?.codeTask || [],
            companyProfile,
            interviewerProfile,
            url
        };

        return res.status(200).json({ report: detailedReport });
    } catch (error) {
        console.error('Error fetching report:', error);
        return res.status(500).json({ error: 'Server error while fetching the report.' });
    }
};

// not in use
const getDetailedReport = async (req, res) => {
    const { interviewId } = req.params;

    if (!interviewId || interviewId.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "Interview ID is required."
        });
    }

    try {
        // Fetch Report
        const detailedReport = await Report.findOne({ interviewId });
        if (!detailedReport) {
            return res.status(404).json({
                success: false,
                message: "Report not found."
            });
        }

        // Fetch profiles
        const companyProfile = await CompanyProfile.findOne({ userId: detailedReport.companyId });
        const interviewerProfile = await InterviewerProfile.findOne({ userId: detailedReport.interviewerId });

        // Merge full report
        const fullReport = {
            ...detailedReport.toObject(),
            companyProfile,
            interviewerProfile,
        };

        // Build Markdown prompt
        const prompt = `
You are an expert interview evaluator.  
Generate a **professional interview report in Markdown format** based on the candidate data below.  

The report must include these sections (with clear Markdown headers in order):  

1. **Candidate Overview**  
   - Full name, email, position, interview type, interview date.  
   - 2–3 sentence summary of performance.  

2. **Interview Performance**  
   - Duration, total questions vs answered.  
   - Overall score (out of 10).  
   - Recommendation with reasoning.  

3. **Skills Assessment**  
   - Markdown table of skills (name, score, percentage).  
   - 2–3 sentence analysis of strengths/weaknesses.  

4. **Code Evaluation**  
   - **Positives** (bullet list)  
   - **Areas for Improvement** (bullet list)  

5. **Detailed Feedback**  
   - Technical skills (list + analysis)  
   - Communication skills (list + analysis)  
   - Behavioral skills (list + analysis)  
   - Job-specific competencies (list + analysis)  
   - Ratings (communication + behavioral, out of 10)  

6. **Interviewer’s Summary**  
   - Narrative style summary.  

7. **Company Profile**  
   - Company name, industry, size, HQ, tagline, website.  
   - 2–3 sentence overview.  

8. **Interviewer Profile**  
   - Name, headline, years of experience, location.  
   - Top skills, languages, and professional summary.  

⚠️ Rules:
- Use only Markdown formatting.  
- Use bold, lists, and tables where appropriate.  
- No JSON, no extra explanations.  

### Candidate Data:
${JSON.stringify(fullReport, null, 2)}
`;

        let aiReport;
        try {
            const response = await axios.post(
                "https://api.openai.com/v1/chat/completions",
                {
                    model: "gpt-4o-mini",
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.5,
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            aiReport = response.data.choices[0].message.content.trim();

        } catch (err) {
            console.error("Error generating AI report:", err.message);
            aiReport = `AI Report could not be generated: ${err.message}`;
        }

        // Send combined response
        return res.status(200).json({
            success: true,
            detailedReport: fullReport,
            aiReport,
        });

    } catch (error) {
        console.error("Error fetching report:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching the report.",
            error: error.message
        });
    }
};

const verifyAccessOfInterviewerForMockInterviewer = async (req, res) => {
    const { interviewId } = req.body;
    const start = process.hrtime();

    if (!interviewId) {
        return res.status(400).json({ valid: false, message: "Interview ID is required" });
    }

    try {
        // First: search in Interview
        let interview = await MockInterviews.findOne({ interviewId }).lean();

        if (interview) {
            const time = process.hrtime(start);
            return res.status(200).json({
                valid: true,
                interviewDetails: interview,
                timeMs: (time[0] * 1000 + time[1] / 1e6).toFixed(3)
            });
        }

        // Not found
        const time = process.hrtime(start);
        return res.status(404).json({
            valid: false,
            message: 'Interviewer access not found in either collection.',
            timeMs: (time[0] * 1000 + time[1] / 1e6).toFixed(3)
        });

    } catch (error) {
        console.error('Error verifying interviewer access:', error);
        return res.status(500).json({ valid: false, message: 'Server Error', error: error.message });
    }
};

const verifyAccessOfCandidateForMockInterviewer = async (req, res) => {
    const { interviewId } = req.body;

    if (!interviewId) {
        return res.status(400).json({ valid: false, message: "interviewId is required" });
    }

    try {
        const interview = await MockInterviews.findOne({ interviewId }).lean();

        if (!interview) {
            return res.status(404).json({ valid: false, message: "Interview not found" });
        }

        return res.status(200).json({ valid: true, interviewDetails: interview });

    } catch (error) {
        // console.error("Error verifying candidate access:", error);
        return res.status(500).json({ valid: false, message: error.message });
    }
};

const mockUpdateInterviewStatus = async (req, res) => {
    try {
        const { interviewId } = req.body;

        if (!interviewId) {
            return res.status(400).json({ error: "Interview ID is required." });
        }

        let interview = await MockInterviews.findOne({ interviewId });

        if (!interview) {
            return res.status(404).json({ error: "Interview not found." });
        }

        interview.status = "inProcess";
        await interview.save();

        res.status(200).json({ message: 'Interview status updated successfully.' });
    } catch (err) {
        // console.error("Error updating interview status:", err);
        res.status(500).json({ message: err.message });
    }
};

const mockUpdateStatusandSubmitReport = async (req, res) => {
    try {
        const { interviewId } = req.params;
        const { reportData } = req.body;
        const interviewerId = req.user.id;

        // Validate required fields
        const requiredFields = [
            'candidateName', 'candidateEmail', 'positionTitle', 'interviewDate',
            'duration', 'questionsAnswered', 'totalQuestions', 'overallScore',
            'interviewerSummary', 'overallRecommendation'
        ];
        for (const field of requiredFields) {
            if (!reportData[field]) {
                return res.status(400).json({
                    success: false,
                    message: `${field} is required`
                });
            }
        }
        // Validate interview type
        if (!reportData.interviewType || !['technical', 'non-technical'].includes(reportData.interviewType)) {
            return res.status(400).json({
                success: false,
                message: 'Valid interview type is required'
            });
        }
        // Validate skills
        if (!reportData.skills || reportData.skills.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'At least one skill assessment is required'
            });
        }
        // Validate questions answered vs total
        if (parseInt(reportData.questionsAnswered) > parseInt(reportData.totalQuestions)) {
            return res.status(400).json({
                success: false,
                message: 'Questions answered cannot exceed total questions'
            });
        }

        // Process feedback data - convert objects to strings
        const processFeedbackArray = (array) => {
            if (!array || array.length === 0) return [];
            return array.map(item => {
                // If item is an object with a point property, return the point
                if (typeof item === 'object' && item !== null && item.point) {
                    return item.point;
                }
                // If item is already a string, return it
                if (typeof item === 'string') {
                    return item;
                }
                // Otherwise return empty string
                return '';
            }).filter(point => point !== ''); // Remove empty strings
        };

        // Process codeTask and codeEvaluation only for technical interviews
        let processedCodeTask = [];
        let processedCodeEvaluation = [];

        if (reportData.interviewType === 'technical') {
            // Only include codeTask if it has valid data
            processedCodeTask = (reportData.codeTask || []).filter(task =>
                task && task.question && task.code && task.result
            );

            // Only include codeEvaluation if it has valid data
            processedCodeEvaluation = (reportData.codeEvaluation || []).filter(evaluation =>
                evaluation && evaluation.points && evaluation.points.length > 0 &&
                evaluation.points.every(point => point && point.trim() !== '')
            );
        }

        const interview = await MockInterviews.findOne({ interviewId });

        if (!interview) {
            return res.status(404).json({ message: "Interview not found" });
        }

        const reportPayload = {
            interviewId,
            interviewType: reportData.interviewType,
            candidateName: reportData.candidateName,
            candidateEmail: reportData.candidateEmail,
            profile: reportData.positionTitle,
            interviewDate: new Date(reportData.interviewDate),
            duration: parseInt(reportData.duration),
            questionsAnswered: parseInt(reportData.questionsAnswered),
            totalQuestions: parseInt(reportData.totalQuestions),
            overallScore: parseFloat(reportData.overallScore),
            skills: reportData.skills,
            codeTask: processedCodeTask,
            codeEvaluation: processedCodeEvaluation,
            feedback: {
                technicalSkills: processFeedbackArray(reportData.feedback.technicalSkills),
                communicationSkills: processFeedbackArray(reportData.feedback.communicationSkills),
                behavioralSkills: processFeedbackArray(reportData.feedback.behavioralSkills),
                jobSpecificCompetencies: processFeedbackArray(reportData.feedback.jobSpecificCompetencies),
                communicationRating: reportData.feedback.communicationRating || 0,
                behavioralRating: reportData.feedback.behavioralRating || 0
            },
            interviewerSummary: reportData.interviewerSummary,
            overallRecommendation: reportData.overallRecommendation,
            interviewerId
        };

        // ✅ Check if report exists
        let report = await MockReport.findOne({ interviewId });

        if (report) {
            // Update existing
            Object.assign(report, reportPayload);
            await report.save();
        } else {
            // Create new
            report = new MockReport(reportPayload);
            await report.save();
        }

        interview.status = 'completed';
        interview.reportId = report._id;
        await interview.save();

        console.log(interview.requestId)

        const request = await MockRequest.findById(interview.requestId);

        request.status = 'completed';
        await request.save();

        // Return success response
        res.status(200).json({
            success: true,
            message: report ? 'Interview report updated successfully' : 'Interview report created successfully',
            reportId: report._id
        });
    } catch (error) {
        console.error('Error submitting interview report:', error);
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: messages
            });
        }
        // Handle other errors
        res.status(500).json({
            success: false,
            message: 'Failed to submit interview report',
            error: error.message
        });
    }
};

const getMockReport = async (req, res) => {
    const { interviewId } = req.params;

    console.log(interviewId);


    if (!interviewId || interviewId.trim() === "") {
        return res.status(400).json({ success: false, message: "Interview ID is required." });
    }

    try {
        // Step 1: find report
        const report = await MockReport.findOne({ interviewId });
        if (!report) {
            return res.status(404).json({ success: false, message: "Report not found." });
        }

        // Step 2: fetch code 
        const codeTask = await CodeTask.findOne({ interviewId })

        // Step 3: fetch interviewer profile
        const interviewerProfile = await InterviewerProfile.findOne({ userId: report.interviewerId });
        if (!interviewerProfile) {
            return res.status(404).json({ success: false, message: "Interviewer profile not found." });
        }

        // step 4: fetch recording url
        const url = await VideoRecording.findOne({ interviewId }).select("-interviewId")

        // Step 5: merge
        const detailedReport = {
            ...report.toObject(),
            codeTask: codeTask?.codeTask || [],
            interviewerProfile,
            url
        };

        return res.status(200).json({ mockReport: detailedReport });
    } catch (error) {
        console.error('Error fetching report:', error);
        return res.status(500).json({ error: 'Server error while fetching the report.' });
    }
};

const sendMockReport = async (req, res) => {
    try {
        const file = req.file;
        const reportData = JSON.parse(req.body.reportData);

        if (!reportData?.interviewId) {
            return res.status(400).json({
                success: false,
                error: "Missing interviewId in reportData",
            });
        }

        if (!file || !reportData) {
            return res.status(400).json({ success: false, error: 'PDF file or report data missing' });
        }

        // Fetch interview from DB
        const interview = await MockInterviews.findOne({ interviewId: reportData.interviewId, });

        if (!interview) {
            return res.status(404).json({ success: false, error: "Interview not found", });
        }

        // Send email
        await sendReportEmail({
            // to: "ananddwivedi1313@gmail.com",
            to: interview.candidateEmail,
            subject: `Interview Report - ${interview.candidateName}`,
            message: `Hello ${interview.candidateName},<br><br>Please find attached your interview report.<br><br>Regards,<br>RecruitWay Team`,
            attachment: file.buffer,
            filename: file.originalname
        });

        res.json({ success: true, message: 'Report sent successfully!' });
    } catch (err) {
        console.error("sendMockReport error:", err);
        res.status(500).json({
            success: false,
            error: err.message || "Failed to generate/send PDF",
        });
    }
};

const sendReport = async (req, res) => {
    try {
        const { interviewId } = req.body;

        if (!interviewId) {
            return res.status(400).json({ error: "interviewId is required" });
        }

        // find report by interviewId and update
        const updatedReport = await Report.findOneAndUpdate(
            { interviewId: interviewId },
            { $set: { sentToCompany: true } },
            { new: true } // return the updated document
        );

        if (!updatedReport) {
            return res.status(404).json({ error: "Report not found" });
        }

        res.status(200).json({ message: "Report sent to company", });
    } catch (error) {
        console.error("Error in sendReport:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


module.exports = {
    getInterview, verifyAccessForCandidate, verifyAccessForInterviewer, verifyAccessForRandomCandidate,
    getInterviewDetails, updateInterviewStatus, getReport, getDetailedReport, updateStatusandSubmitReport,
    verifyAccessOfCandidateForMockInterviewer, verifyAccessOfInterviewerForMockInterviewer,
    mockUpdateInterviewStatus, mockUpdateStatusandSubmitReport, getMockReport,
    sendMockReport, sendReport,
} 