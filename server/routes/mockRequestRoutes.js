const express = require('express');
const mockRequestRoutes = express.Router();
const authMiddleware = require('../middleware/auth-middleware');
const { roleCheck } = require('../middleware/roleCheck');
const { createMockRequest, getMockRequests, updateStatus, getMockInterviewOfRequest, getMockInterviewDataOfRequest, createMockInterview, updateMockInterview, getAllMockinterviewsOfAllCandidates, sendInterviewEmailsForMock } = require('../controllers/mockController');

mockRequestRoutes.post("/createMockRequest", createMockRequest)
mockRequestRoutes.get("/getMockRequests", authMiddleware, roleCheck(['superadmin']), getMockRequests)
mockRequestRoutes.put("/updateStatus/:requestId", authMiddleware, roleCheck(['superadmin']), updateStatus)
mockRequestRoutes.get("/getMockInterviewOfRequest/:requestId", authMiddleware, roleCheck(['superadmin']), getMockInterviewOfRequest)
mockRequestRoutes.get("/getMockInterviewDataOfRequest/:requestId", authMiddleware, roleCheck(['superadmin']), getMockInterviewDataOfRequest)
mockRequestRoutes.post("/createMockInterview/:mockInterviewId", authMiddleware, roleCheck(['superadmin']), createMockInterview)
mockRequestRoutes.put("/updateMockInterview/:mockInterviewId/:formDataId", authMiddleware, roleCheck(['superadmin']), updateMockInterview)

mockRequestRoutes.get("/get-all-mockinterviews-of-all-candidates", authMiddleware, roleCheck(['superadmin']), getAllMockinterviewsOfAllCandidates)
mockRequestRoutes.post("/candidateandinterviewer/:id/send-invite/for-mock", authMiddleware, roleCheck(['superadmin']), sendInterviewEmailsForMock)

module.exports = mockRequestRoutes;

