const { Schema, model } = require('mongoose');

const mockRequestSchema = new Schema(
    {
        candidateName: { type: String, required: [true, "Name is required"] },
        candidateEmail: {
            type: String,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                "Please fill a valid email address",
            ],
        },
        candidatePhone: {
            type: String,
            required: [true, "Phone number is required"],
            // No strict 10-digit rule → allows international numbers
        },
        profile: {
            type: String,
            enum: [
                "Frontend",
                "Backend",
                "Full Stack",
                "Android",
                "iOS",
                "Data Science",
                "DevOps",
                "UX/UI Design",
                "QA Engineering",
                "Product Management",
            ],
            required: [true, "Profile is required"],
        },
        experienceLevel: {
            type: String,
            enum: ["Entry-level", "Mid-level", "Senior", "Lead", "Principal"],
            required: [true, "Experience level is required"],
        },
        interviewDate: {
            type: String, // keep as String because frontend sends YYYY-MM-DD
            required: [true, "Interview date is required"],
        },
        interviewTime: {
            type: String,
            required: [true, "Interview time is required"],
        },
        interviewerChoice: {
            type: String,
            required: [true, "Interviewer is required"],
        },
        timezone: {
            type: String,
            required: [true, "Timezone is required"],  // Updated error message
        },
        status: {
            type: String,
            enum: ["scheduled", "pending", "declined", "completed"],
            default: "pending"
        },
    },
    { timestamps: true }
);

const MockRequest = model("MockRequest", mockRequestSchema);

module.exports = MockRequest