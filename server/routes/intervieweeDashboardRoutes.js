const express = require('express');
const intervieweeDashboardRouter = express.Router();
const { roleCheck } = require('../middleware/roleCheck');
const authMiddleware = require('../middleware/auth-middleware');
const { getUserProfileCompletion, getUserApplicationStatusStats, getUserInterviewStats } = require('../controllers/userDashboardController');



intervieweeDashboardRouter.get('/user-profile/completion', authMiddleware, roleCheck(['user']), getUserProfileCompletion);
intervieweeDashboardRouter.get('/:userId/getUserApplicationStatusStats', authMiddleware, roleCheck(['user']), getUserApplicationStatusStats);
intervieweeDashboardRouter.get('/:userId/getUserInterviewStats', authMiddleware, roleCheck(['user']), getUserInterviewStats);




module.exports = intervieweeDashboardRouter;
