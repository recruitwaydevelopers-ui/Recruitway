const express = require('express');
const chatRoutes = express.Router();
const { getMessages, sendMessage } = require('../controllers/chatController');
const authMiddleware = require('../middleware/auth-middleware');

chatRoutes.get("/:senderId/:receiverId", authMiddleware, getMessages);
chatRoutes.post("/send", authMiddleware, sendMessage);


module.exports = chatRoutes;
