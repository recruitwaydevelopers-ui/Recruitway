const express = require('express');
const Interview = require('../models/Interview-model');
const authMiddleware = require('../middleware/auth-middleware');
const {
    getInterview, verifyAccessForCandidate, verifyAccessForInterviewer, verifyAccessForRandomCandidate, generateToken,
    getInterviewDetails, getReport, createInterviewRoomWithRecording, updateInterviewStatus, updateStatusandSubmitReport,
    handleRecordingWebhook,
} = require('../controllers/interviewController');
const interviewRoutes = express.Router();

//  Update interview status
interviewRoutes.patch('/:id/status', async (req, res) => {
    try {
        const interview = await Interview.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        res.json(interview);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


interviewRoutes.get('/:interviewId', authMiddleware, getInterview);

interviewRoutes.post('/verify-access-for-candidate', authMiddleware, verifyAccessForCandidate);
interviewRoutes.post('/verify-access-for-interviewer', authMiddleware, verifyAccessForInterviewer);
interviewRoutes.post('/verify-access-for-random-candidate', verifyAccessForRandomCandidate);

interviewRoutes.post('/video/token', authMiddleware, generateToken);
interviewRoutes.post('/video/room', authMiddleware, createInterviewRoomWithRecording);
interviewRoutes.get('/getInterviewDetails/:id', authMiddleware, getInterviewDetails);
interviewRoutes.post('/updateStatus', authMiddleware, updateInterviewStatus);
interviewRoutes.post('/updateStatusandSubmitReport/:interviewId', authMiddleware, updateStatusandSubmitReport);
interviewRoutes.get('/getReport/:interviewId', authMiddleware, getReport);

interviewRoutes.post('/api/callbacks/status', createInterviewRoomWithRecording)
interviewRoutes.post('/api/callbacks/composition', handleRecordingWebhook)





module.exports = interviewRoutes;
