const express = require('express');
const superAdmminDashboardRouter = express.Router();
const { roleCheck } = require('../middleware/roleCheck');
const authMiddleware = require('../middleware/auth-middleware');
const { getSuperAdminJobStats, getSuperAdminJobApplicationStats, getSuperAdminInterviewStats, getSuperAdminReportsStats } = require('../controllers/superadminDashboardController');


superAdmminDashboardRouter.get('/getSuperAdminJobStats', authMiddleware, roleCheck(['superadmin']), getSuperAdminJobStats);
superAdmminDashboardRouter.get('/getSuperAdminJobApplicationStats', authMiddleware, roleCheck(['superadmin']), getSuperAdminJobApplicationStats);
superAdmminDashboardRouter.get('/getSuperAdminInterviewStats', authMiddleware, roleCheck(['superadmin']), getSuperAdminInterviewStats);
superAdmminDashboardRouter.get('/getSuperAdminReportsStats', authMiddleware, roleCheck(['superadmin']), getSuperAdminReportsStats);


module.exports = superAdmminDashboardRouter;

