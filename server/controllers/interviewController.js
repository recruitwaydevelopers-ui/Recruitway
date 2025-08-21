const Interview = require("../models/Interview-model");
const Report = require("../models/Report-model");
const crypto = require('crypto');
const InterviewWithCV = require("../models/InterviewWithCV");

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

const generateToken = async (req, res) => {
    try {
        const { identity, room } = req.body;

        if (!identity || !room) {
            return res.status(400).json({ error: 'Identity and room name are required' });
        }

        // Add expiration time (4 hours)
        const token = new AccessToken(
            process.env.TWILIO_ACCOUNT_SID,
            process.env.TWILIO_API_KEY,
            process.env.TWILIO_SECRET_KEY,
            { identity, ttl: 14400 }
        );

        const videoGrant = new VideoGrant({
            room,
            maxParticipantDuration: 14400
        });
        token.addGrant(videoGrant);

        token.addGrant(new VideoGrant());
        // console.log(token);
        res.status(200).json({ token: token.toJwt() });

    } catch (error) {
        console.error('Token error:', error);
        res.status(500).json({
            error: error.message,
            details: error.message
        });
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
        const userId = req.user._id;

        if (!reportData) {
            return res.status(400).json({ error: 'Report data is required.' });
        }

        if (!interviewId) {
            return res.status(400).json({ error: 'Interview ID is required.' });
        }

        let interview = await Interview.findOne({ interviewId });

        if (!interview) {
            interview = await InterviewWithCV.findOne({ interviewId });
        }

        if (!interview) {
            return res.status(404).json({ error: 'Interview not found.' });
        }

        const newReport = new Report({
            interviewId,
            companyId: interview.companyId,
            interviewerId: userId,
            // interviewerId: interview.interviewerId,
            ...reportData
        });

        await newReport.save();

        interview.status = 'completed';
        await interview.save();

        res.status(200).json({ message: 'Report submitted successfully.' });
    } catch (err) {
        console.error('Error updating interview status and submitting report:', err);
        res.status(500).json({ message: err.message });
    }
};

const getReport = async (req, res) => {
    const { interviewId } = req.params;

    if (!interviewId) {
        return res.status(400).json({ error: 'Interview ID is required.' });
    }

    try {
        const report = await Report.findOne({ interviewId });

        if (!report) {
            return res.status(404).json({ error: 'Report not found.' });
        }

        return res.status(200).json({ report });
    } catch (error) {
        console.error('Error fetching report:', error);
        return res.status(500).json({ error: 'Server error while fetching the report.' });
    }
};

// --- WEBHOOK FOR RECORDING ---
const createInterviewRoomWithRecording = async (req, res) => {
    const { RoomSid, StatusCallbackEvent, RoomName } = req.body;

    console.log(`Webhook Event: ${StatusCallbackEvent} for Room: ${RoomName}`);

    if (StatusCallbackEvent === 'participant-connected') {
        try {
            const roomRecord = await Room.findOne({ twilioSid: RoomSid });

            // If a recording has already started, do nothing.
            if (!roomRecord || roomRecord.recordingSid) {
                return res.sendStatus(200);
            }

            // Check how many participants are in the room.
            const participants = await twilioClient.video.v1.rooms(RoomSid).participants.list({ status: 'connected' });

            // If there are 2 participants, start the recording.
            if (participants.length === 2) {
                console.log(`Two participants detected in ${RoomName}. Starting recording.`);

                const composition = await twilioClient.video.v1.compositions.create({
                    roomSid: RoomSid,
                    audioSources: '*',
                    videoLayout: {
                        grid: {
                            max_rows: 1,
                            video_sources: ['*']
                        }
                    },
                    format: 'mp4',
                    statusCallback: `${process.env.TWILIO_CALLBACK_URL}/api/callbacks/composition`, // Optional: callback for composition status
                    statusCallbackMethod: 'POST'
                });

                // Save the recording SID to our database.
                roomRecord.recordingSid = composition.sid;
                await roomRecord.save();
                console.log(`Recording started. Composition SID: ${composition.sid}`);
            }
        } catch (error) {
            console.error('Error in status callback handler:', error);
        }
    }

    res.sendStatus(200);
};
// Optional: Webhook to know when the composition (recording file) is ready
const handleRecordingWebhook = (req, res) => {
    const { CompositionSid, StatusCallbackEvent, MediaUri } = req.body;
    if (StatusCallbackEvent === 'composition-available') {
        console.log(`Composition ${CompositionSid} is ready! Download at: https://video.twilio.com${MediaUri}`);
    }
    res.sendStatus(200);
};



const APP_ID = process.env.ZEGOCLOUD_APP_ID;
const SERVER_SECRET = process.env.ZEGOCLOUD_SERVER_SECRET;

const generateTokenForZegoCloud = () => {
    const expireTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour
    const payload = {
        app_id: APP_ID,
        nonce: Math.floor(Math.random() * 100000),
        ctime: Math.floor(Date.now() / 1000),
        expire: expireTime,
    };
    const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
    const signature = crypto.createHmac('sha256', SERVER_SECRET)
        .update(base64Payload)
        .digest('hex');

    return `${base64Payload}.${signature}`;
};


module.exports = {
    getInterview, verifyAccessForCandidate, verifyAccessForInterviewer, verifyAccessForRandomCandidate, generateToken,
    getInterviewDetails, updateInterviewStatus, getReport, createInterviewRoomWithRecording, handleRecordingWebhook,
    updateStatusandSubmitReport,
} 