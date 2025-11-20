const { Schema, model } = require('mongoose');

const contactSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "replied"],
        default: "pending"
    },
    reply: {
        type: String,
    },
},
    { timestamps: true }
);

const Contact = model("Contact", contactSchema);
module.exports = Contact