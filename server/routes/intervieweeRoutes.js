const express = require('express');
const intervieweeRouter = express.Router();
const upload = require("../config/multer");
const {
    createProfile, getProfile, getAllJobs, applyForJob, getAppliedJobs, withdrawFromJob, getSelectedJobDetails,
    getUserInterviews, cancelInterview, getInterviewDetailsForCandidates, generateTokenForCandidates
} = require('../controllers/intervieweeController');
const { roleCheck } = require('../middleware/roleCheck');
const authMiddleware = require('../middleware/auth-middleware');
const updateLastActive = require('../middleware/update-lastActive-middleware');


intervieweeRouter.post('/createprofile', authMiddleware, roleCheck(['user']), upload.fields([{ name: 'profilePicture', maxCount: 1 }, { name: 'resume', maxCount: 1 }]), updateLastActive, createProfile);
intervieweeRouter.get('/getprofile', authMiddleware, roleCheck(['user']), getProfile);
intervieweeRouter.get('/getAllJobs', authMiddleware, roleCheck(['user']), updateLastActive, getAllJobs);

intervieweeRouter.post('/apply-job', authMiddleware, roleCheck(['user']), applyForJob);

intervieweeRouter.get("/applied-jobs/:userId", authMiddleware, roleCheck(['user']), getAppliedJobs);
intervieweeRouter.delete('/withdraw-job/:jobId', authMiddleware, roleCheck(['user']), updateLastActive, withdrawFromJob);
intervieweeRouter.get('/get-selected-job-detail/:jobId', authMiddleware, roleCheck(['user']), getSelectedJobDetails);

intervieweeRouter.get('/user-interviews', authMiddleware, roleCheck(['user']), getUserInterviews);
intervieweeRouter.put('/:id/cancel', authMiddleware, roleCheck(['user']), cancelInterview);

intervieweeRouter.get('/getInterviewDetails/:id/forCandidate', authMiddleware, roleCheck(['user']), getInterviewDetailsForCandidates);
intervieweeRouter.post('/video/token/forCandidate', authMiddleware, roleCheck(['user']), generateTokenForCandidates);


module.exports = intervieweeRouter;
