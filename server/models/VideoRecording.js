const { Schema, model } = require("mongoose");

const videoRecordingSchema = new Schema({
    interviewId: {
        type: String,
        required: true,
        index: true
    },
    key: {
        type: String,
        required: true // permanent S3 object key
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const VideoRecording = model("VideoRecording", videoRecordingSchema);
module.exports = VideoRecording;
