const InterviewerProfile = require("../models/Auth/Interviewer-model");
const Interview = require("../models/Interview-model");
const InterviewWithCV = require("../models/InterviewWithCV");
const MockInterviews = require("../models/Mock_Interviews-model");
const MockRequest = require("../models/MockRequest-model");
const createUniqueInterviewId = require("../utils/generateUniqueInterviewId");
const { sendInterviewEmail } = require("../utils/interview-emailService");

// Create new form submission
const createMockRequest = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            profile,
            experienceLevel,
            interviewDate,
            interviewTime,
            interviewerChoice,
            customInterviewer,
            timezone
        } = req.body;

        // ✅ Required fields
        if (
            !name ||
            !email ||
            !phone ||
            !profile ||
            !experienceLevel ||
            !interviewDate ||
            !interviewTime ||
            !interviewerChoice ||
            !timezone
        ) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // ✅ If interviewerChoice is "Other", customInterviewer is required
        if (interviewerChoice === "Other" && !customInterviewer) {
            return res.status(400).json({ error: "Please specify the interviewer when 'Other' is selected" });
        }

        // ✅ Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        // ✅ Phone validation: 10 digits OR + followed by 12 digits
        const phoneRegex = /^(\d{10}|\+\d{12})$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({
                error:
                    "Invalid phone number. Use 10 digits (e.g., 9876543210) or + followed by 12 digits (e.g., +919876543210).",
            });
        }

        // ✅ Date validation (YYYY-MM-DD)
        if (!/^\d{4}-\d{2}-\d{2}$/.test(interviewDate)) {
            return res.status(400).json({ error: "Invalid interview date (expected YYYY-MM-DD)" });
        }

        // ✅ Time validation (matches slots like "9:00 AM - 11:00 AM")
        const timeSlotRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s(AM|PM)\s-\s(0?[1-9]|1[0-2]):[0-5][0-9]\s(AM|PM)$/i;
        if (!timeSlotRegex.test(interviewTime)) {
            return res.status(400).json({
                error: "Invalid interview time (expected format like '9:00 AM - 11:00 AM')"
            });
        }

        // ✅ Timezone validation
        if (!timezone || typeof timezone !== 'string' || timezone.trim() === '') {
            return res.status(400).json({ error: "Timezone is required" });
        }

        // ✅ Determine the actual interviewer value
        const interviewer = interviewerChoice === "Other" ? customInterviewer : interviewerChoice;

        // ✅ Create and save request
        const request = new MockRequest({
            candidateName: name,
            candidateEmail: email,
            candidatePhone: phone,
            profile,
            experienceLevel,
            interviewDate, // keep as string
            interviewTime, // keep as string (time slot)
            interviewerChoice: interviewer,
            timezone, // include timezone
        });

        await request.save();

        return res.status(201).json({
            message: "Interview scheduled successfully",
            requestId: request._id,
        });
    } catch (error) {
        console.error("Error in createMockRequest:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Get all form submissions
const getMockRequests = async (req, res) => {
    try {
        const requests = await MockRequest.find().sort({ createdAt: -1 });

        if (!requests || requests.length === 0) {
            return res.status(404).json({ message: "No requests found" });
        }

        return res.status(200).json({ success: true, data: requests });
    } catch (error) {
        // console.error("Error in getRequest:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};

//  Update only the status of a MockInterview
const updateStatus = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { status } = req.body;

        // validate status
        const allowedStatuses = ["scheduled", "pending", "declined"];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        // Delete if exists in MockInterviews
        await MockInterviews.deleteOne({ requestId });

        // Update status in MockRequest
        const interview = await MockRequest.findByIdAndUpdate(
            requestId,
            { status },
            { new: true }
        );

        if (!interview) {
            return res.status(404).json({ message: "MockInterview not found" });
        }

        return res.status(200).json({
            message: "Status updated successfully"
        });
    } catch (error) {
        console.error("Error updating status:", error);
        return res.status(500).json({
            message: "Server error while updating status",
            error: error.message,
        });
    }
};

// Get Mock Interview of Mock request
const getMockInterviewOfRequest = async (req, res) => {
    const { requestId } = req.params;
    try {
        const requests = await MockInterviews.find({ requestId });

        return res.status(200).json({ success: true, data: requests });
    } catch (error) {
        // console.error("Error in getRequest:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Get data of mock requests
const getMockInterviewDataOfRequest = async (req, res) => {
    const { requestId } = req.params;
    try {
        const requests = await MockRequest.findById(requestId);

        return res.status(200).json({ success: true, data: requests });
    } catch (error) {
        // console.error("Error in getRequest:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Create Mock Interview
const createMockInterview = async (req, res) => {
    try {
        const { mockInterviewId: requestId } = req.params;

        // Updated field names to match frontend
        const {
            candidateName: name,
            candidateEmail: email,
            candidatePhone: phone,
            profile,
            experienceLevel,
            interviewDate,
            interviewStartTime,
            interviewEndTime,
            interviewerChoice,
            interviewerId,
            interviewerName,
            status,
            notes
        } = req.body;

        // ✅ Required fields (updated to match frontend field names)
        if (
            !requestId || !name || !email || !phone || !profile || !experienceLevel ||
            !interviewDate || !interviewStartTime || !interviewEndTime ||
            !interviewerChoice || !interviewerId || !interviewerName
        ) {
            return res.status(400).json({ message: "All required fields must be filled" });
        }

        // ✅ Parse times (handle both 12h and 24h formats)
        const parseTime = (timeStr) => {
            if (!timeStr) return null;

            // If already in 24h format (HH:mm)
            if (timeStr.match(/^\d{1,2}:\d{2}$/)) {
                const [hours, minutes] = timeStr.split(':');
                return { hours: parseInt(hours), minutes: parseInt(minutes) };
            }

            // If in 12h format (h:mm AM/PM)
            if (timeStr.match(/^\d{1,2}:\d{2}\s?(AM|PM)$/i)) {
                const [time, modifier] = timeStr.split(' ');
                let [hours, minutes] = time.split(':');

                hours = parseInt(hours);
                minutes = parseInt(minutes);

                if (modifier.toUpperCase() === 'PM' && hours !== 12) {
                    hours += 12;
                } else if (modifier.toUpperCase() === 'AM' && hours === 12) {
                    hours = 0;
                }

                return { hours, minutes };
            }

            return null;
        };

        const startTime = parseTime(interviewStartTime);
        const endTime = parseTime(interviewEndTime);

        if (!startTime || !endTime) {
            return res.status(400).json({ message: "Invalid time format. Use HH:mm or h:mm AM/PM" });
        }

        const interviewStart = new Date(interviewDate);
        interviewStart.setHours(startTime.hours, startTime.minutes, 0, 0);

        const interviewEnd = new Date(interviewDate);
        interviewEnd.setHours(endTime.hours, endTime.minutes, 0, 0);

        if (isNaN(interviewStart) || isNaN(interviewEnd) || interviewEnd <= interviewStart) {
            return res.status(400).json({ message: "Invalid or illogical start/end time" });
        }

        // ✅ Buffer logic
        const BUFFER_MINUTES = 10;
        const bufferedStart = new Date(interviewStart.getTime() - BUFFER_MINUTES * 60000);
        const bufferedEnd = new Date(interviewEnd.getTime() + BUFFER_MINUTES * 60000);

        // 🔍 Check conflicts across Interview, InterviewWithCV, and MockInterviews
        const conflictingInterview =
            (await Interview.findOne({
                interviewerId,
                status: { $in: ["scheduled", "inProcess"] },
                isActive: true,
                interviewDate: { $eq: new Date(interviewDate) },
                $or: [{ start: { $lt: bufferedEnd }, end: { $gt: bufferedStart } }]
            })) ||
            (await InterviewWithCV.findOne({
                interviewerId,
                status: { $in: ["scheduled", "inProcess"] },
                isActive: true,
                interviewDate: { $eq: new Date(interviewDate) },
                $or: [{ start: { $lt: bufferedEnd }, end: { $gt: bufferedStart } }]
            })) ||
            (await MockInterviews.findOne({
                interviewerId,
                status: { $in: ["scheduled", "inProcess"] },
                isActive: true,
                interviewDate: { $eq: new Date(interviewDate) },
                $or: [{ start: { $lt: bufferedEnd }, end: { $gt: bufferedStart } }]
            }));

        if (conflictingInterview) {
            return res.status(409).json({
                message: `Time conflict: Interviewer already has an interview on ${interviewDate} overlapping within ${BUFFER_MINUTES} mins.`
            });
        }

        const interviewerDetails = await InterviewerProfile.findOne({ userId: interviewerId });

        // ✅ Unique interview ID
        const interviewId = await createUniqueInterviewId();

        // ✅ Save in MockInterviews collection
        const newInterview = new MockInterviews({
            interviewId,
            requestId,
            candidateName: name,
            candidateEmail: email,
            candidatePhone: phone,
            profile,
            experienceLevel,
            interviewerChoice,
            interviewerName,
            interviewerId,
            interviewDate: new Date(interviewDate),
            start: interviewStart,
            end: interviewEnd,
            status: status || "scheduled",
            notes: notes || "",
            isActive: true,
            isLinkSent: false
        });

        await newInterview.save();

        // ✅ Update MockRequest status
        await MockRequest.updateOne(
            { _id: requestId },
            { $set: { status: "scheduled" } }
        );

        // ✅ Format time for email
        const formatTimeForEmail = (date) => {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        };

        // ✅ Emails
        await sendInterviewEmail({
            to: email,
            subject: "Mock Interview Scheduled",
            template: "Candidate-Mock-Interview-Scheduled",
            context: {
                candidateName: name,
                profile,
                experienceLevel,
                interviewerName,
                date: new Date(interviewDate).toLocaleDateString(),
                time: formatTimeForEmail(interviewStart),
                endTime: formatTimeForEmail(interviewEnd),
                interviewUrl: `${process.env.FIRST_FRONTEND_URL}/videoroomforMockInterview`,
                notes: notes || "None provided"
            }
        });

        if (interviewerDetails?.email) {
            await sendInterviewEmail({
                to: interviewerDetails.email,
                subject: "Mock Interview Scheduled",
                template: "Interviewer-Interview-Scheduled",
                context: {
                    candidateName: name,
                    jobTitle: profile,
                    experienceLevel,
                    interviewerName,
                    date: new Date(interviewDate).toLocaleDateString(),
                    time: formatTimeForEmail(interviewStart),
                    endTime: formatTimeForEmail(interviewEnd),
                    notes: notes || "None provided"
                }
            });
        }

        return res.status(201).json({
            message: "Mock interview scheduled successfully",
            interview: newInterview
        });

    } catch (error) {
        console.error("Error scheduling mock interview:", error);
        return res.status(500).json({
            message: "Server error while scheduling mock interview",
            error: error.message
        });
    }
};

// Update Mock Interview
const updateMockInterview = async (req, res) => {
    const { mockInterviewId, formDataId } = req.params;

    try {
        // Updated field names to match frontend
        const {
            candidateName,
            candidateEmail,
            candidatePhone,
            profile,
            experienceLevel,
            interviewerName,
            interviewerId,
            interviewDate,
            interviewStartTime: startTimeInput,
            interviewEndTime: endTimeInput,
            interviewerChoice,
            notes,
            status
        } = req.body;

        // ✅ Validate required fields
        if (
            !mockInterviewId || !formDataId || !candidateName || !candidateEmail || !candidatePhone ||
            !profile || !interviewerName || !interviewerId || !interviewDate || !startTimeInput || !endTimeInput
        ) {
            return res.status(400).json({ message: "All required fields must be filled" });
        }

        // ✅ Parse times (handle both 12h and 24h formats)
        const parseTime = (timeStr) => {
            if (!timeStr) return null;

            // If already in 24h format (HH:mm)
            if (timeStr.match(/^\d{1,2}:\d{2}$/)) {
                const [hours, minutes] = timeStr.split(':');
                return { hours: parseInt(hours), minutes: parseInt(minutes) };
            }

            // If in 12h format (h:mm AM/PM)
            if (timeStr.match(/^\d{1,2}:\d{2}\s?(AM|PM)$/i)) {
                const [time, modifier] = timeStr.split(' ');
                let [hours, minutes] = time.split(':');

                hours = parseInt(hours);
                minutes = parseInt(minutes);

                if (modifier.toUpperCase() === 'PM' && hours !== 12) {
                    hours += 12;
                } else if (modifier.toUpperCase() === 'AM' && hours === 12) {
                    hours = 0;
                }

                return { hours, minutes };
            }

            return null;
        };

        const startTime = parseTime(startTimeInput);
        const endTime = parseTime(endTimeInput);

        if (!startTime || !endTime) {
            return res.status(400).json({ message: "Invalid time format. Use HH:mm or h:mm AM/PM" });
        }

        const interviewStart = new Date(interviewDate);
        interviewStart.setHours(startTime.hours, startTime.minutes, 0, 0);

        const interviewEnd = new Date(interviewDate);
        interviewEnd.setHours(endTime.hours, endTime.minutes, 0, 0);

        if (isNaN(interviewStart) || isNaN(interviewEnd) || interviewEnd <= interviewStart) {
            return res.status(400).json({ message: "Invalid interview time" });
        }

        // ✅ Buffer logic
        const BUFFER_MINUTES = 10;
        const bufferedStart = new Date(interviewStart.getTime() - BUFFER_MINUTES * 60000);
        const bufferedEnd = new Date(interviewEnd.getTime() + BUFFER_MINUTES * 60000);

        // 🔍 Check conflicts across Interview, InterviewWithCV, MockInterviews
        const conflicting =
            (await Interview.findOne({
                interviewerId,
                status: { $in: ["scheduled", "inProcess"] },
                isActive: true,
                interviewDate: { $eq: new Date(interviewDate) },
                $or: [{ start: { $lt: bufferedEnd }, end: { $gt: bufferedStart } }]
            })) ||
            (await InterviewWithCV.findOne({
                interviewerId,
                status: { $in: ["scheduled", "inProcess"] },
                isActive: true,
                interviewDate: { $eq: new Date(interviewDate) },
                $or: [{ start: { $lt: bufferedEnd }, end: { $gt: bufferedStart } }]
            })) ||
            (await MockInterviews.findOne({
                _id: { $ne: formDataId }, // exclude self
                interviewerId,
                status: { $in: ["scheduled", "inProcess"] },
                isActive: true,
                interviewDate: { $eq: new Date(interviewDate) },
                $or: [{ start: { $lt: bufferedEnd }, end: { $gt: bufferedStart } }]
            }));

        if (conflicting) {
            return res.status(409).json({
                message: `Time conflict: Interviewer has another interview on ${interviewDate} within ${BUFFER_MINUTES} mins.`
            });
        }

        // ✅ Fetch interview to update
        const interview = await MockInterviews.findById(formDataId);
        if (!interview) {
            return res.status(404).json({ message: "Mock interview not found" });
        }

        // ✅ Fetch interviewer details for email
        const interviewerDetails = await InterviewerProfile.findOne({ userId: interviewerId });
        const newInterviewId = await createUniqueInterviewId();

        // ✅ Update fields
        Object.assign(interview, {
            interviewId: newInterviewId,
            requestId: mockInterviewId,
            candidateName,
            candidateEmail,
            candidatePhone,
            profile,
            experienceLevel,
            interviewerChoice,
            interviewerName,
            interviewerId,
            interviewDate: new Date(interviewDate),
            start: interviewStart,
            end: interviewEnd,
            notes: notes || "",
            cancelledAt: null,
            cancelledBy: null,
            status: "scheduled",
            isActive: true,
            isLinkSent: false
        });

        await interview.save();

        // ✅ Format time for email
        const formatTimeForEmail = (date) => {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        };

        // ✅ Send update email to candidate
        await sendInterviewEmail({
            to: candidateEmail,
            subject: "Your Mock Interview Details Have Changed",
            template: "Candidate-Mock-Interview-Update",
            context: {
                candidateName,
                profile,
                interviewerName,
                date: new Date(interviewDate).toLocaleDateString(),
                newTime: formatTimeForEmail(interviewStart),
                endTime: formatTimeForEmail(interviewEnd),
                notes: notes || "None provided",
                interviewUrl: `${process.env.FIRST_FRONTEND_URL}/videoroomforMockInterview`
            }
        });

        // ✅ Send update email to interviewer
        if (interviewerDetails?.email) {
            await sendInterviewEmail({
                to: interviewerDetails.email,
                subject: "Mock Interview Details Have Changed",
                template: "Interviewer-Interview-Scheduled",
                context: {
                    candidateName,
                    jobTitle: profile,
                    experienceLevel,
                    interviewerName,
                    date: new Date(interviewDate).toLocaleDateString(),
                    time: formatTimeForEmail(interviewStart),
                    endTime: formatTimeForEmail(interviewEnd),
                    notes: notes || "None provided"
                }
            });
        }

        return res.status(200).json({
            message: "Mock interview updated successfully",
            interview
        });

    } catch (error) {
        console.error("Error updating mock interview:", error);
        return res.status(500).json({
            message: "Server error while updating mock interview",
            error: error.message
        });
    }
};

// Get all Mock Interviews
const getAllMockinterviewsOfAllCandidates = async (req, res) => {
    try {
        // Fetch all mock interviews
        const interviews = await MockInterviews.find()
            .populate('interviewerId', 'name email')
            .lean()
            .sort({ createdAt: -1 });

        if (!interviews || interviews.length === 0) {
            return res.status(404).json({ message: "No mock interviews found" });
        }

        // Format interviews for response
        const formatted = interviews.map((intv) => ({
            _id: intv._id,
            interviewId: intv.interviewId,
            requestId: intv.requestId,
            profile: intv.profile,
            candidateName: intv.candidateName,
            candidateEmail: intv.candidateEmail || null,
            candidatePhone: intv.candidatePhone || null,
            interviewerName: intv.interviewerName,
            interviewerEmail: intv.interviewerId?.email || null,
            experienceLevel: intv.experienceLevel || null,
            interviewerChoice: intv.interviewerChoice || null,
            interviewDate: intv.interviewDate,
            start: intv.start,
            end: intv.end,
            notes: intv.notes || null,
            status: intv.status,
            isActive: intv.isActive,
            isLinkSent: intv.isLinkSent,
            createdAt: intv.createdAt,
            updatedAt: intv.updatedAt,
            cancelledAt: intv.cancelledAt || null,
            cancelledBy: intv.cancelledBy || null,
        }));

        return res.status(200).json({ interviewes: formatted });
    } catch (error) {
        console.error("Error getting mock interview data:", error);
        return res.status(500).json({ message: error.message });
    }
};

// send mail for mock interview
const sendInterviewEmailsForMock = async (req, res) => {
    const { id } = req.params;
    const {
        meetingCode,
        emailSubject,
        emailMessage,
        interviewerEmailSubject,
        interviewerEmailMessage
    } = req.body;

    if (
        !meetingCode ||
        !emailSubject || !emailMessage ||
        !interviewerEmailSubject || !interviewerEmailMessage
    ) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        // Get interview details from DB
        const interview = await MockInterviews.findById(id)
            .populate("interviewerId", "name email")
            .lean();

        if (!interview) {
            return res.status(404).json({ error: "Interview not found" });
        }

        // Format scheduled time
        function formatScheduledTime(date, start, end) {
            if (!date || !start || !end) return "Time to be determined";

            const optionsDate = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
            const dateFormatted = new Date(date).toLocaleDateString("en-US", optionsDate);

            const optionsTime = { hour: "2-digit", minute: "2-digit", hour12: true };
            const startTime = new Date(start).toLocaleTimeString("en-US", optionsTime);
            const endTime = new Date(end).toLocaleTimeString("en-US", optionsTime);

            return `${dateFormatted} from ${startTime} to ${endTime}`;
        }

        const details = formatScheduledTime(interview.interviewDate, interview.start, interview.end);

        // Send to Candidate
        await sendInterviewEmail({
            to: interview.candidateEmail,
            subject: emailSubject,
            template: "InterviewInviteRandomCandidate",
            context: {
                name: interview.candidateName,
                meetingCode,
                jobTitle: interview.profile, // using "profile" instead of jobTitle
                scheduledTime: details,
                message: emailMessage,
                interviewUrl: `${process.env.FIRST_FRONTEND_URL}/videoroomforMockInterview`
            }
        });

        // Send to Interviewer
        await sendInterviewEmail({
            to: interview.interviewerId?.email,
            subject: interviewerEmailSubject,
            template: "interviewInviteInterviewer",
            context: {
                name: interview.interviewerName,
                candidateName: interview.candidateName,
                meetingCode,
                jobTitle: interview.profile, // using "profile" instead of jobTitle
                scheduledTime: details,
                message: interviewerEmailMessage
            }
        });

        // Mark as sent in DB
        await MockInterviews.findByIdAndUpdate(id, { isLinkSent: true });

        res.status(200).json({ message: "Emails sent successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to send interview emails" });
    }
};





module.exports = { createMockRequest, getMockRequests, updateStatus, getMockInterviewOfRequest, getMockInterviewDataOfRequest, createMockInterview, updateMockInterview, getAllMockinterviewsOfAllCandidates, sendInterviewEmailsForMock };
