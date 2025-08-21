const express = require('express');
const companyRouter = express.Router();
const upload = require("../config/multer");
const uploadDocument = require('../config/cvMulter');
const { getDashboard, getSuperAdmin, createProfile, getProfile,
    createJobPost, getAllJob, updateJobPost, deleteJobPost, getAllJobApplicants,
    uploadSingleCvFilewhileEdit, deleteSingleCvFilewhileEdit,
    getJobApplicants, updateApplicationStatus, getAllDoneInterviewsOfCompany,
    getCompanyNotifications, markAsRead, getReportOfEachCandidate,
    uploadCvWithJobDetails, getAllCvWithJobDetails, editCvWithApplication, deleteCvWithApplication, 
    downloadCV} = require('../controllers/companyController');
const { roleCheck } = require('../middleware/roleCheck');
const authMiddleware = require('../middleware/auth-middleware');
const updateLastActive = require('../middleware/update-lastActive-middleware');

companyRouter.post('/createprofile', authMiddleware, roleCheck(['company']), upload.fields([{ name: 'profilePicture', maxCount: 1 }]), updateLastActive, createProfile);
companyRouter.get('/getprofile', authMiddleware, roleCheck(['company']), getProfile);
companyRouter.get('/superAdmin', authMiddleware, getSuperAdmin);
companyRouter.post('/create-job-post', authMiddleware, roleCheck(['company']), updateLastActive, createJobPost);
companyRouter.post('/upload-cv', authMiddleware, roleCheck(['company']), uploadDocument.array('cvs'), uploadCvWithJobDetails);
companyRouter.get('/getAll-Cv', authMiddleware, roleCheck(['company']), getAllCvWithJobDetails);
companyRouter.post('/uploadSingleCvFilewhileEdit/:applicationId', authMiddleware, roleCheck(['company']), uploadDocument.single('cvFile'), uploadSingleCvFilewhileEdit);
companyRouter.delete('/deleteSingleCvFilewhileEdit/:publicId', authMiddleware, roleCheck(['company']), deleteSingleCvFilewhileEdit);
companyRouter.patch('/edit-CV-Application/:applicationId', authMiddleware, roleCheck(['company']), editCvWithApplication);
companyRouter.delete('/delete-CV-Application/:applicationId', authMiddleware, roleCheck(['company']), deleteCvWithApplication);
companyRouter.get('/download-cv', downloadCV);
companyRouter.get('/get-all-job', authMiddleware, roleCheck(['company']), updateLastActive, getAllJob);
companyRouter.patch("/update-job/:jobId", authMiddleware, roleCheck(['company']), updateLastActive, updateJobPost);
companyRouter.delete("/delete-job/:jobId", authMiddleware, roleCheck(['company']), updateLastActive, deleteJobPost);
companyRouter.get('/allapplicants', authMiddleware, roleCheck(['company']), updateLastActive, getAllJobApplicants);
companyRouter.get('/applicants/:jobId', authMiddleware, roleCheck(['company']), updateLastActive, getJobApplicants);
companyRouter.put("/changeStatus/:applicationId", authMiddleware, roleCheck(['company']), updateLastActive, updateApplicationStatus);
companyRouter.get("/getAllDoneInterviewsOfCompany", authMiddleware, roleCheck(['company']), updateLastActive, getAllDoneInterviewsOfCompany);
companyRouter.get("/:id/report", authMiddleware, roleCheck(['company']), updateLastActive, getReportOfEachCandidate);
companyRouter.get("/getCompanyNotification", authMiddleware, roleCheck(['company']), updateLastActive, getCompanyNotifications);
companyRouter.patch("/markAsRead/:companyId", authMiddleware, roleCheck(['company']), updateLastActive, markAsRead);



module.exports = companyRouter;

