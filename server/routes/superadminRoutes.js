const express = require('express');
const superAdmminRouter = express.Router();
const {
    createProfile, getProfile, addUser, getAllCompaniesWithJobs, getAllJobsOfSingleCompany, getDetailsOfSingleJob, changeJobStatus,
    changeAsFlagged, changeAsUnFlagged, deleteJob, getAllApplicants, getSingleApplicants, getCandidateAllInterviews,
    createInterviews, updateInterview, deleteInterview, getAllCompaniesWithVerificationStatus, makeCompaniesVerified, makeCompaniesUnverified,
    getAllCandidatesWithVerificationStatus, makeCandidatesVerified, makeCandidatesUnverified, getAllInterviewesOfAllCandidates,
    sendInterviewEmails, markAsCancelled, getAllAuth, verifyUser, revokeVerification, changeUserRole,
    getAllShortlistedCandidates, getAllInterviewers, createInterviewer, deleteInterviewer, getInterviewersProfile,
    getAllJobsWithCV, getAllCVForInterviewOfSingleJob, scheduleInterviewWithCV, getCVInterviews, updateCVInterview, cancelCVInterview, deleteCVInterview,
    getAllInterviewesOfAllCandidatesByCV, sendInterviewEmailsForCV

} = require('../controllers/superadminController');
const { roleCheck } = require('../middleware/roleCheck');
const authMiddleware = require('../middleware/auth-middleware');
const upload = require('../config/multer');
const updateLastActive = require('../middleware/update-lastActive-middleware');


superAdmminRouter.post('/createprofile', authMiddleware, roleCheck(['superadmin']), upload.fields([{ name: 'profilePicture', maxCount: 1 }]), updateLastActive, createProfile);
superAdmminRouter.get('/getprofile', authMiddleware, roleCheck(['superadmin']), getProfile);
superAdmminRouter.post('/addUser', authMiddleware, roleCheck(['superadmin']), addUser);


superAdmminRouter.get('/get-all-companies-with-jobs', authMiddleware, roleCheck(['superadmin']), getAllCompaniesWithJobs);
superAdmminRouter.get('/get-companies-all-jobs/:companyId', authMiddleware, roleCheck(['superadmin']), getAllJobsOfSingleCompany);
superAdmminRouter.get('/getJobDetails/:jobId', authMiddleware, roleCheck(['superadmin']), getDetailsOfSingleJob);
superAdmminRouter.post('/changeJobStatus/:jobId', authMiddleware, roleCheck(['superadmin']), changeJobStatus);
superAdmminRouter.patch('/mark-as-flagged/:jobId', authMiddleware, roleCheck(['superadmin']), changeAsFlagged);
superAdmminRouter.patch('/remove-as-flagged/:jobId', authMiddleware, roleCheck(['superadmin']), changeAsUnFlagged);
superAdmminRouter.delete('/deleteJob/:jobId', authMiddleware, roleCheck(['superadmin']), deleteJob);

superAdmminRouter.get('/getAllApplicants/:jobId', authMiddleware, roleCheck(['superadmin']), getAllApplicants);
superAdmminRouter.get('/getSingleApplicants/:id', authMiddleware, roleCheck(['superadmin']), getSingleApplicants);

superAdmminRouter.get('/getAllAuth', authMiddleware, roleCheck(['superadmin']), getAllAuth);
superAdmminRouter.put('/verifyUser/:id', authMiddleware, roleCheck(['superadmin']), verifyUser);
superAdmminRouter.put('/revokeVerification/:id', authMiddleware, roleCheck(['superadmin']), revokeVerification);
superAdmminRouter.put('/changeUserRole/:userId', authMiddleware, roleCheck(['superadmin']), changeUserRole);

superAdmminRouter.get('/get-all-companies-with-verification-status', authMiddleware, roleCheck(['superadmin']), getAllCompaniesWithVerificationStatus);
superAdmminRouter.patch('/makeCompaniesVerified/:companyId', authMiddleware, roleCheck(['superadmin']), makeCompaniesVerified);
superAdmminRouter.patch('/makeCompaniesUnverified/:companyId', authMiddleware, roleCheck(['superadmin']), makeCompaniesUnverified);

superAdmminRouter.get('/get-all-candidates-with-verification-status', authMiddleware, roleCheck(['superadmin']), getAllCandidatesWithVerificationStatus);
superAdmminRouter.patch('/makeCandidateVerified/:candidateId', authMiddleware, roleCheck(['superadmin']), makeCandidatesVerified);
superAdmminRouter.patch('/makeCandidateUnverified/:candidateId', authMiddleware, roleCheck(['superadmin']), makeCandidatesUnverified);

superAdmminRouter.get('/get-all-interviews-of-all-candidates', authMiddleware, roleCheck(['superadmin']), getAllInterviewesOfAllCandidates);
superAdmminRouter.get('/getCandidateAllInterviews/:id', authMiddleware, roleCheck(['superadmin']), getCandidateAllInterviews);

superAdmminRouter.post('/createInterviewer', authMiddleware, roleCheck(['superadmin']), createInterviewer);
superAdmminRouter.delete('/deleteInterviewer/:id', authMiddleware, roleCheck(['superadmin']), deleteInterviewer);
superAdmminRouter.get('/getAllInterviewers', authMiddleware, roleCheck(['superadmin']), getAllInterviewers);
superAdmminRouter.get('/getInterviewersProfile/:id', authMiddleware, roleCheck(['superadmin']), getInterviewersProfile);

superAdmminRouter.post('/candidateandinterviewer/:id/send-invite', authMiddleware, roleCheck(['superadmin']), sendInterviewEmails);
superAdmminRouter.post('/markAsCancelled/:interviewId', authMiddleware, roleCheck(['superadmin']), markAsCancelled);


superAdmminRouter.get('/getAllShortlistedCandidates', authMiddleware, roleCheck(['superadmin']), getAllShortlistedCandidates);

superAdmminRouter.post('/createInterviews', authMiddleware, roleCheck(['superadmin']), createInterviews);
superAdmminRouter.put('/updateInterviews/:id', authMiddleware, roleCheck(['superadmin']), updateInterview);
superAdmminRouter.delete('/deleteInterviews/:id', authMiddleware, roleCheck(['superadmin']), deleteInterview);

superAdmminRouter.get('/cvforinterview', authMiddleware, roleCheck(['superadmin']), getAllJobsWithCV);
superAdmminRouter.get('/cvforinterview/:jobId', authMiddleware, roleCheck(['superadmin']), getAllCVForInterviewOfSingleJob);
superAdmminRouter.get('/getCVInterviews/:jobId/:cvId', authMiddleware, roleCheck(['superadmin']), getCVInterviews);
superAdmminRouter.post('/cvforinterview/:jobId/schedule', authMiddleware, roleCheck(['superadmin']), scheduleInterviewWithCV);
superAdmminRouter.put('/updateCVInterview/:jobId/:cvId/:formDataId', authMiddleware, roleCheck(['superadmin']), updateCVInterview);
superAdmminRouter.put('/cancelCVInterview/:jobId/:cvId/:formDataId', authMiddleware, roleCheck(['superadmin']), cancelCVInterview);
superAdmminRouter.delete('/deleteCVInterview/:jobId/:cvId/:formDataId', authMiddleware, roleCheck(['superadmin']), deleteCVInterview);
sendInterviewEmailsForCV

superAdmminRouter.get('/get-all-interviews-of-all-candidates-by-cv', authMiddleware, roleCheck(['superadmin']), getAllInterviewesOfAllCandidatesByCV);
superAdmminRouter.post('/candidateandinterviewer/:id/send-invite/for-cv', authMiddleware, roleCheck(['superadmin']), sendInterviewEmailsForCV);


module.exports = superAdmminRouter;
