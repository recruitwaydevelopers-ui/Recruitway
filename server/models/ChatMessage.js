const { Schema, model } = require('mongoose');

const chatMessageSchema = new Schema({
    senderId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: String,
    fileUrl: String,
    seen: { type: Boolean, default: false }
}, { timestamps: true });

const ChatMessage = model('ChatMessage', chatMessageSchema);
module.exports = ChatMessage;
