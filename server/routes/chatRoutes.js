const express = require('express');
const chatRoutes = express.Router();
const authMiddleware = require('../middleware/auth-middleware');
const { getChatHistory, markAsRead, deleteMessage, getAllChatPerson } = require('../controllers/chatController');
const { roleCheck } = require('../middleware/roleCheck');

chatRoutes.get('/get-all-chatPerson', authMiddleware, roleCheck(['superadmin']), getAllChatPerson);

chatRoutes.get('/:otherUserId', authMiddleware, getChatHistory);
chatRoutes.post('/mark-as-read', authMiddleware, markAsRead);
chatRoutes.delete('/:messageId', authMiddleware, deleteMessage);


module.exports = chatRoutes;