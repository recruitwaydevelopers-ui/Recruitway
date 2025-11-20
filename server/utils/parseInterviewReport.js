const parseInterviewReport = (markdown) => {
    const json = {
        candidateOverview: {},
        interviewPerformance: {},
        skillsAssessment: { skills: [], analysis: "" },
        codeEvaluation: { positives: [], areasForImprovement: [] },
        detailedFeedback: {
            technicalSkills: { list: [], analysis: "" },
            communicationSkills: { list: [], analysis: "" },
            behavioralSkills: { list: [], analysis: "" },
            jobSpecificCompetencies: { list: [], analysis: "" },
            ratings: {}
        },
        interviewerSummary: "",
        companyProfile: {},
        interviewerProfile: {}
    };



    // --- Candidate Overview ---
    const candidateMatch = markdown.match(/## 1\. Candidate Overview([\s\S]*?)## 2/);
    if (candidateMatch) {
        const section = candidateMatch[1];
        json.candidateOverview.fullName = (section.match(/- \*\*Full Name:\*\* (.*)/) || [])[1];
        json.candidateOverview.email = (section.match(/- \*\*Email:\*\* (.*)/) || [])[1];
        json.candidateOverview.positionAppliedFor = (section.match(/- \*\*Position Applied For:\*\* (.*)/) || [])[1];
        json.candidateOverview.interviewDate = (section.match(/- \*\*Interview Date:\*\* (.*)/) || [])[1];
        json.candidateOverview.interviewType = (section.match(/- \*\*Interview Type:\*\* (.*)/) || [])[1];
        json.candidateOverview.summary = (section.match(/\*\*Summary of Overall Performance:\*\*([\s\S]*)/m) || [])[1]?.trim() || "";
    }

    // --- Interview Performance ---
    const perfMatch = markdown.match(/## 2\. Interview Performance([\s\S]*?)## 3/);
    if (perfMatch) {
        const section = perfMatch[1];
        json.interviewPerformance.duration = (section.match(/- \*\*Duration:\*\* (.*)/) || [])[1];
        json.interviewPerformance.totalQuestions = parseInt((section.match(/- \*\*Total Questions Asked:\*\* (\d+)/) || [])[1] || 0);
        json.interviewPerformance.questionsAnswered = parseInt((section.match(/- \*\*Questions Answered:\*\* (\d+)/) || [])[1] || 0);
        json.interviewPerformance.overallScore = (section.match(/- \*\*Overall Score:\*\* (.*)/) || [])[1];
        json.interviewPerformance.overallRecommendation = (section.match(/- \*\*Overall Recommendation:\*\* (.*)/) || [])[1];
        json.interviewPerformance.recommendationReasoning = (section.match(/\*\*Reasoning:\*\*([\s\S]*)/m) || [])[1]?.trim() || "";
    }

    // --- Skills Assessment ---
    const skillsMatch = markdown.match(/## 3\. Skills Assessment([\s\S]*?)## 4/);
    if (skillsMatch) {
        const section = skillsMatch[1];
        const rows = section.match(/\|.*\|/g) || [];
        rows.forEach((row, i) => {
            if (i === 0) return; // skip header
            const cols = row.split("|").map(c => c.trim());
            if (cols.length >= 4) {
                json.skillsAssessment.skills.push({
                    name: cols[1],
                    score: parseInt(cols[2]),
                    percentage: cols[3]
                });
            }
        });
        const analysisMatch = section.match(/\*\*Analysis:\*\*([\s\S]*)/);
        json.skillsAssessment.analysis = analysisMatch ? analysisMatch[1].trim() : "";
    }

    // --- Code Evaluation ---
    const codeEvalMatch = markdown.match(/## 4\. Code Evaluation([\s\S]*?)## 5/);
    if (codeEvalMatch) {
        const section = codeEvalMatch[1];

        // Extract Positives
        const positivesMatch = section.match(/\*\*Positives:\*\*([\s\S]*?)(\n\n|$)/);
        if (positivesMatch) {
            json.codeEvaluation.positives = positivesMatch[1]
                .split("\n")
                .map(s => s.replace(/^-/, "").trim())
                .filter(Boolean);
        }

        // Extract Areas for Improvement
        const areasMatch = section.match(/\*\*Areas for Improvement:\*\*([\s\S]*?)(\n\n|$)/);
        if (areasMatch) {
            json.codeEvaluation.areasForImprovement = areasMatch[1]
                .split("\n")
                .map(s => s.replace(/^-/, "").trim())
                .filter(Boolean);
        }
    }

    // --- Detailed Feedback ---
    const feedbackMatch = markdown.match(/## 5\. Detailed Feedback([\s\S]*?)## 6/);
    if (feedbackMatch) {
        const section = feedbackMatch[1];

        function extractFeedback(title) {
            const regex = new RegExp(`### ${title}[\\s\\S]*?(?=(###|Ratings|$))`, "i");
            const match = section.match(regex);
            if (!match) return { list: [], analysis: "" };
            const lines = match[0].split("\n").map(l => l.trim()).filter(Boolean);
            const list = lines.filter(l => l.startsWith("- **List:**"))
                .flatMap(l => l.replace("- **List:**", "").split(",").map(s => s.trim()));
            const analysis = lines.find(l => l.startsWith("- **Analysis:**"))?.replace("- **Analysis:**", "").trim() || "";
            return { list, analysis };
        }

        json.detailedFeedback.technicalSkills = extractFeedback("Technical Skills");
        json.detailedFeedback.communicationSkills = extractFeedback("Communication Skills");
        json.detailedFeedback.behavioralSkills = extractFeedback("Behavioral Skills");
        json.detailedFeedback.jobSpecificCompetencies = extractFeedback("Job-Specific Competencies");

        // Ratings
        const commRating = section.match(/- \*\*Communication Rating:\*\* (\d+\/\d+)/);
        const behRating = section.match(/- \*\*Behavioral Rating:\*\* (\d+\/\d+)/);
        json.detailedFeedback.ratings.communication = commRating ? commRating[1] : "";
        json.detailedFeedback.ratings.behavioral = behRating ? behRating[1] : "";
    }

    // --- Interviewer Summary ---
    const summaryMatch = markdown.match(/## 6\. Interviewer’s Summary([\s\S]*?)## 7/);
    if (summaryMatch) {
        json.interviewerSummary = summaryMatch[1].trim();
    }

    // --- Company Profile ---
    const companyMatch = markdown.match(/## 7\. Company Profile([\s\S]*?)## 8/);
    if (companyMatch) {
        const section = companyMatch[1];
        json.companyProfile.companyName = (section.match(/- \*\*Company Name:\*\* (.*)/) || [])[1];
        json.companyProfile.industry = (section.match(/- \*\*Industry:\*\* (.*)/) || [])[1];
        json.companyProfile.size = (section.match(/- \*\*Size:\*\* (.*)/) || [])[1];
        json.companyProfile.headquarters = (section.match(/- \*\*Headquarters:\*\* (.*)/) || [])[1];
        json.companyProfile.tagline = (section.match(/- \*\*Tagline:\*\* (.*)/) || [])[1];
        json.companyProfile.website = (section.match(/\[.*\]\((.*)\)/) || [])[1];
        const overviewMatch = section.match(/\*\*Overview:\*\*([\s\S]*)/);
        json.companyProfile.overview = overviewMatch ? overviewMatch[1].trim() : "";
    }

    // --- Interviewer Profile ---
    const interviewerMatch = markdown.match(/## 8\. Interviewer Profile([\s\S]*)/);
    if (interviewerMatch) {
        const section = interviewerMatch[1];
        json.interviewerProfile.name = (section.match(/- \*\*Name:\*\* (.*)/) || [])[1];
        json.interviewerProfile.headline = (section.match(/- \*\*Headline:\*\* (.*)/) || [])[1];
        json.interviewerProfile.yearsOfExperience = parseInt((section.match(/- \*\*Years of Experience:\*\* (\d+)/) || [])[1] || 0);
        json.interviewerProfile.location = (section.match(/- \*\*Location:\*\* (.*)/) || [])[1];
        const topSkillsMatch = section.match(/\*\*Top Skills:\*\* (.*)/);
        json.interviewerProfile.topSkills = topSkillsMatch ? topSkillsMatch[1].split(",").map(s => s.trim()) : [];
        const languagesMatch = section.match(/\*\*Languages:\*\* (.*)/);
        json.interviewerProfile.languages = languagesMatch ? languagesMatch[1].split(",").map(s => s.trim()) : [];
        json.interviewerProfile.professionalSummary = (section.match(/\*\*Professional Summary:\*\*([\s\S]*)/) || [])[1]?.trim() || "";
    }

    return json;
};

const mapParsedMarkdown = (parsed, baseReport) => {
    return {
        _id: baseReport._id,
        interviewId: baseReport.interviewId,
        companyId: baseReport.companyId,
        interviewerId: baseReport.interviewerId,
        interviewType: baseReport.interviewType,
        candidateName: baseReport.candidateName,
        candidateEmail: baseReport.candidateEmail,
        positionTitle: baseReport.positionTitle,
        interviewDate: baseReport.interviewDate,
        duration: baseReport.duration,
        questionsAnswered: baseReport.questionsAnswered,
        totalQuestions: baseReport.totalQuestions,
        overallScore: baseReport.overallScore,
        skills: parsed.skillsAssessment.skills || [],
        codeTask: [],
        codeEvaluation: [
            { type: "positive", points: parsed.codeEvaluation.positives || [] },
            { type: "improvement", points: parsed.codeEvaluation.areasForImprovement || [] }
        ],
        feedback: {
            technicalSkills: parsed.detailedFeedback.technicalSkills.list || [],
            communicationSkills: parsed.detailedFeedback.communicationSkills.list || [],
            behavioralSkills: parsed.detailedFeedback.behavioralSkills.list || [],
            jobSpecificCompetencies: parsed.detailedFeedback.jobSpecificCompetencies.list || [],
            communicationRating: parsed.detailedFeedback.ratings.communication || 0,
            behavioralRating: parsed.detailedFeedback.ratings.behavioral || 0,
        },
        interviewerSummary: parsed.interviewerSummary || "",
        overallRecommendation: baseReport.overallRecommendation,
        submittedAt: baseReport.submittedAt,
        companyProfile: baseReport.companyProfile,
        interviewerProfile: baseReport.interviewerProfile
    };
};


module.exports = { parseInterviewReport, mapParsedMarkdown };





