const express = require('express');
const multer = require('multer');
const { startUpload, uploadPart, completeUpload, getVideoUrl, abortUpload } = require('../controllers/recordingUploadController');
const authMiddleware = require('../middleware/auth-middleware');

const recordingUploadRoutes = express.Router();
const upload = multer(); // memory storage

recordingUploadRoutes.post("/start-upload", startUpload);
recordingUploadRoutes.post("/upload-part", upload.single("chunk"), uploadPart);
recordingUploadRoutes.post("/complete-upload", completeUpload);
recordingUploadRoutes.post("/abort-upload", abortUpload);
recordingUploadRoutes.get("/getVideoUrl", authMiddleware, getVideoUrl);
recordingUploadRoutes.get("/getVideoUrl-for-mockcandidate", getVideoUrl);

module.exports = recordingUploadRoutes;

