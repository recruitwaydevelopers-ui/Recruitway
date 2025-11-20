const Notification = require("../models/Notification-modal");

const createNotification = async (req, res) => {
    try {
        const { senderId, receiverId, message, type } = req.body;
        const io = req.app.get("io");
        const userSocketMap = req.app.get("userSocketMap");

        // Save to MongoDB
        const notification = await Notification.create({
            senderId,
            receiverId,
            message,
            type,
        });

        // Emit to receiver in real-time if they are online
        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newNotification", notification);
            console.log(`📨 Notification sent to user ${receiverId}`);
        } else {
            console.log(`⚠️ User ${receiverId} is offline`);
        }

        res.status(201).json({ success: true, notification });
    } catch (err) {
        console.error("Error creating notification:", err);
        res.status(500).json({ success: false, message: "Error creating notification" });
    }
};

const getNotifications = async (req, res) => {
    try {
        const { userId } = req.params;

        // Run both operations efficiently in parallel
        const [_, notifications] = await Promise.all([
            Notification.updateMany(
                { receiverId: userId, isRead: false },
                { $set: { isRead: true } }
            ),
            Notification.find({ receiverId: userId })
                .sort({ createdAt: -1 })
        ]);

        res.status(200).json({
            success: true,
            notifications,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const markAllAsRead = async (req, res) => {
    try {
        const { receiverId } = req.body;
        if (!receiverId)
            return res.status(400).json({ success: false, message: "Receiver ID is required" });

        await Notification.updateMany(
            { receiverId, isRead: false },
            { $set: { isRead: true } }
        );

        res.status(200).json({ success: true, message: "All notifications marked as read" });
    } catch (error) {
        console.error("Error marking notifications as read:", error);
        res.status(500).json({ success: false, message: "Failed to mark as read" });
    }
};


module.exports = { createNotification, getNotifications, markAllAsRead }
