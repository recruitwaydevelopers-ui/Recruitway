const { Schema, model } = require('mongoose');

const consentSchema = new Schema({
    userId: {
        type: String,
        index: true,
        sparse: true
    },
    anonId: {
        type: String,
        index: true,
        sparse: true

    },
    consent: {
        essential: {
            type: Boolean,
            default: true

        },
        analytics: {
            type: Boolean,
            default: false

        },
        marketing: {
            type: Boolean,
            default: false

        },
    },
    savedAt: {
        type: Date,
        default: Date.now

    },
});

const Consent = model("Consent", consentSchema);
module.exports = Consent
