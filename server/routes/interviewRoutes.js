const express = require('express');
const Interview = require('../models/Interview-model');
const authMiddleware = require('../middleware/auth-middleware');
const {
    getInterview, verifyAccessForCandidate, verifyAccessForInterviewer, verifyAccessForRandomCandidate,
    getInterviewDetails, getReport, updateInterviewStatus, updateStatusandSubmitReport,
    verifyAccessOfCandidateForMockInterviewer, verifyAccessOfInterviewerForMockInterviewer,
    mockUpdateInterviewStatus, mockUpdateStatusandSubmitReport, getMockReport,
    sendMockReport, sendReport,
} = require('../controllers/interviewController');
const upload = require('../config/multer');
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
interviewRoutes.post('/updateStatus', authMiddleware, updateInterviewStatus);
interviewRoutes.post('/updateStatusandSubmitReport/:interviewId', authMiddleware, updateStatusandSubmitReport);
interviewRoutes.get('/getReport/:interviewId', authMiddleware, getReport);


interviewRoutes.post('/verify-access-0f-candidate-for-mock-interviewer', verifyAccessOfCandidateForMockInterviewer);
interviewRoutes.post('/verify-access-0f-interviewer-for-mock-interviewer', authMiddleware, verifyAccessOfInterviewerForMockInterviewer);
interviewRoutes.post('/mock-updateStatus', authMiddleware, mockUpdateInterviewStatus);
interviewRoutes.post('/mock-updateStatusandSubmitReport/:interviewId', authMiddleware, mockUpdateStatusandSubmitReport);
interviewRoutes.get('/getMockReport/:interviewId', authMiddleware, getMockReport);


interviewRoutes.post('/sendMockReport', authMiddleware,upload.single('reportPdf'), sendMockReport);
interviewRoutes.post('/sendReport', authMiddleware, sendReport);



interviewRoutes.get('/getInterviewDetails/:id', authMiddleware, getInterviewDetails);






module.exports = interviewRoutes;
