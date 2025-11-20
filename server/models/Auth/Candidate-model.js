const { Schema, model } = require("mongoose");

const experienceSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    company: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    startDate: {
        type: String,
        required: true,
        trim: true
    },
    endDate: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    }
}, { _id: false });

const educationSchema = new Schema({
    degree: {
        type: String,
        required: true,
        trim: true
    },
    institution: {
        type: String,
        required: true,
        trim: true
    },
    year: {
        type: String,
        required: true,
        trim: true
    }
}, { _id: false });

const skillSchema = new Schema({
    skills: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
}, { _id: false });

const certificationSchema = new Schema({
    certificates: {
        type: String,
        required: true,
        trim: true
    },
    issuer: {
        type: String,
        required: true,
        trim: true
    },
    year: {
        type: String,
        required: true,
        trim: true
    }
}, { _id: false });

const languageSchema = new Schema({
    languages: {
        type: String,
        required: true,
        trim: true
    }
}, { _id: false });

const projectSchema = new Schema({
    projects: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    year: {
        type: String,
        required: true,
        trim: true
    }
}, { _id: false });

const socialMediaSchema = new Schema({
    linkedin: {
        type: String,
        trim: true
    },
    twitter: {
        type: String,
        trim: true
    },
    facebook: {
        type: String,
        trim: true
    },
    github: {
        type: String,
        trim: true
    }
}, { _id: false });

// ---------------- Profile Schemas ---------------- //

const candidateProfileSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "Auth",
        required: true,
        unique: true
    },
    profilePicture: String,
    resume: String,
    fullname: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true
    },
    headline: {
        type: String,
        required: [true, 'Headline is required'],
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    gender: {
        type: String,
        required: true,
        trim: true
    },
    dob: {
        type: String,
        required: true,
        trim: true
    },
    summary: {
        type: String,
        required: true,
        trim: true
    },
    experience: [experienceSchema],
    education: [educationSchema],
    skills: [skillSchema],
    certifications: [certificationSchema],
    languages: [languageSchema],
    projects: [projectSchema],
    socialMedia: socialMediaSchema,
    lastActive: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const CandidateProfile = model("CandidateProfile", candidateProfileSchema)

module.exports = CandidateProfile