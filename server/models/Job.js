const { Schema, model } = require("mongoose");

const jobSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "Auth",
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    salary: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    experience: {
        type: String,
        required: true
    },
    posted: {
        type: Date,
        default: Date.now,
    },
    description: {
        type: String,
        required: true
    },
    requirements: {
        type: [String],
        required: true
    },
    skills: {
        type: [String],
        required: true
    },
    applicants: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ["Active", "Inactive", "Draft"],
        required: true
    },
    isFlagged: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Job = model("Job", jobSchema);

module.exports = Job;
