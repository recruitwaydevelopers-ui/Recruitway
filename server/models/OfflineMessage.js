const { Schema, model } = require('mongoose');

const offlineMessageSchema = new Schema({
    receiverId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    senderId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    delivered: { type: Boolean, default: false }, // to track if message was sent to receiver
});

const OfflineMessage = model("OfflineMessage", offlineMessageSchema);
module.exports = OfflineMessage
