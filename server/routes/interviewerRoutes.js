const express = require('express');
const interviewerRouter = express.Router();
const upload = require("../config/multer");
const { roleCheck } = require('../middleware/roleCheck');
const authMiddleware = require('../middleware/auth-middleware');
const { createOrUpdateProfile, getProfile, getInterviewerInterviews, getInterviewerInterviewsbycv, cancelInterview,
    generateTokenForInterviewer, getInterviewDetailsForInterviewer } = require('../controllers/interviewerController');

interviewerRouter.post('/createprofile', authMiddleware, roleCheck(['interviewer']), upload.fields([{ name: 'profilePicture', maxCount: 1 }]), createOrUpdateProfile);
interviewerRouter.get('/getprofile', authMiddleware, roleCheck(['interviewer']), getProfile);
interviewerRouter.get('/getInterviewerInterviews', authMiddleware, roleCheck(['interviewer']), getInterviewerInterviews);
interviewerRouter.get('/getInterviewerInterviewsbycv', authMiddleware, roleCheck(['interviewer']), getInterviewerInterviewsbycv);
interviewerRouter.put('/:id/cancel', authMiddleware, roleCheck(['interviewer']), cancelInterview);
interviewerRouter.get('/getInterviewDetails/:id/forInterviewer', authMiddleware, roleCheck(['interviewer']), getInterviewDetailsForInterviewer);
interviewerRouter.post('/video/token/forInterviewer', authMiddleware, roleCheck(['interviewer']), generateTokenForInterviewer);




module.exports = interviewerRouter;

