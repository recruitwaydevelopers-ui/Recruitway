const { Schema, model } = require("mongoose");

const verificationCodeSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
});

const VerificationCode = model("VerificationCode", verificationCodeSchema);
module.exports = VerificationCode
