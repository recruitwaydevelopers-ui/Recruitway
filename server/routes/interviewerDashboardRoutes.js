const express = require('express');
const interviewerDashboardRouter = express.Router();
const { roleCheck } = require('../middleware/roleCheck');
const authMiddleware = require('../middleware/auth-middleware');
const { getInterviewerProfileCompletion, getInterviewerInterviewStats, getInterviewerReportsStats } = require('../controllers/interviewerDashboardController');


interviewerDashboardRouter.get('/interviewer-profile/completion', authMiddleware, roleCheck(['interviewer']), getInterviewerProfileCompletion);
interviewerDashboardRouter.get('/:userId/getInterviewerInterviewStats', authMiddleware, roleCheck(['interviewer']), getInterviewerInterviewStats);
interviewerDashboardRouter.get('/:userId/getInterviewerReportsStats', authMiddleware, roleCheck(['interviewer']), getInterviewerReportsStats);



module.exports = interviewerDashboardRouter;