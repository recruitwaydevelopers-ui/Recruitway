const { Schema, model } = require("mongoose");

const superAdminSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "Auth",
        required: true,
        unique: true
    },
    fullname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    profilePicture: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    // permissions: {
    //     manageUsers: { type: Boolean, default: true },
    //     manageCompanies: { type: Boolean, default: true },
    //     manageInterviewers: { type: Boolean, default: true },
    //     accessReports: { type: Boolean, default: true },
    //     platformSettings: { type: Boolean, default: true }
    // },
}, { timestamps: true });

const SuperAdminProfile = model("SuperAdminProfile", superAdminSchema);

module.exports = SuperAdminProfile;
