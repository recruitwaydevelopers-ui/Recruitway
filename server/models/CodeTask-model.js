const { Schema, model } = require("mongoose");

const codeTaskItemSchema = new Schema({
    question: {
        type: String,
        required: true,
        trim: true
    },
    code: {
        type: String,
        required: true
    },
    result: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    }
}, { _id: false });

const codeTaskSchema = new Schema({
    interviewId: {
        type: String,
        required: true,
        unique: true // ✅ ensures only one document per interviewId
    },
    codeTask: {
        type: [codeTaskItemSchema],
        default: []
    }
}, { timestamps: true });

const CodeTask = model("CodeTask", codeTaskSchema);
module.exports = CodeTask;
