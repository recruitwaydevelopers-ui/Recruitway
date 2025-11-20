const { Schema, model } = require('mongoose');

const transcriptSchema = new Schema({
    jobName: {
        type: String,
        required: true,
        unique: true
    },
    fileKey: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["IN_PROGRESS", "COMPLETED", "FAILED"],
        default: "IN_PROGRESS",
    },
    transcriptText: {
        type: String
    },
}, { timestamps: true });

module.exports = model("Transcript", transcriptSchema);
