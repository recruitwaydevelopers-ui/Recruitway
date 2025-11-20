const ChatMessage = require("../models/ChatMessage");

const getMessages = async (req, res) => {
    try {
        const { senderId, receiverId } = req.params;
        const messages = await ChatMessage.find({
            $or: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        }).sort({ createdAt: 1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const sendMessage = async (req, res) => {
    try {
        const { senderId, receiverId, text } = req.body;
        const message = await ChatMessage.create({ senderId, receiverId, text });
        res.json(message);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getMessages, sendMessage };
