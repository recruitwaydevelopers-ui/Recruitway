const express = require('express');
const { startRecording, stopRecording, getRecordingStatus, getAllRecordings } = require('../controllers/recordingController');
const authMiddleware = require('../middleware/auth-middleware');

const recordingRoutes = express.Router();

recordingRoutes.post('/start', authMiddleware, startRecording);
recordingRoutes.post('/stop', authMiddleware, stopRecording);
recordingRoutes.get('/status/:taskId', authMiddleware, getRecordingStatus);

// Admin / debug routes
recordingRoutes.get('/', getAllRecordings);

module.exports = recordingRoutes;




