const express = require('express');
const companyDashboardRouter = express.Router();
const { roleCheck } = require('../middleware/roleCheck');
const authMiddleware = require('../middleware/auth-middleware');
const { getApplicationStatusStats, getInterviewStats, getReportsStats } = require('../controllers/companyDashboardController');


companyDashboardRouter.get('/:companyId/getApplicationStatusStats', authMiddleware, roleCheck(['company']), getApplicationStatusStats)
companyDashboardRouter.get('/:companyId/getInterviewStats', authMiddleware, roleCheck(['company']), getInterviewStats)
companyDashboardRouter.get('/:companyId/getReportsStats', authMiddleware, roleCheck(['company']), getReportsStats)


module.exports = companyDashboardRouter




