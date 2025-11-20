const express = require("express");
const { createNotification, getNotifications, markAllAsRead } = require("../controllers/notificationController");
const authMiddleware = require("../middleware/auth-middleware");
const notificationRoutes = express.Router();

notificationRoutes.post("/", authMiddleware, createNotification);
notificationRoutes.get("/getNotifications/:userId", authMiddleware, getNotifications);
notificationRoutes.patch("/mark-read", markAllAsRead);


module.exports = notificationRoutes;
