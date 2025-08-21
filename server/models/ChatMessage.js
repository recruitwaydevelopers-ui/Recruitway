const { Schema, model } = require('mongoose');

const chatMessageSchema = new Schema({
    roomId: {
        type: String,
        required: true,
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'Auth',
        required: true
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'Auth',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['sent', 'delivered', 'read'],
        default: 'sent'
    },
    deletedFor: [{
        type: Schema.Types.ObjectId,
        ref: 'Auth'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const ChatMessage = model('ChatMessage', chatMessageSchema);
module.exports = ChatMessage;