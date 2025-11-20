const { Schema, model } = require("mongoose");

const locationSchema = new Schema({
    city: {
        type: String,
        required: true,
        trim: true
    },
    country: {
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
    }
}, { _id: false });

const genericKeyValueSchema = new Schema({
    key: {
        type: String,
        trim: true
    },
    value: {
        type: String,
        trim: true
    }
}, { _id: false });

// ---------------- Profile Schemas ---------------- //

const companySchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "Auth",
        required: true,
        unique: true
    },
    profilePicture: {
        type: String,
        trim: true
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
    tagline: {
        type: String,
        required: true,
        trim: true
    },
    industry: {
        type: String,
        trim: true
    },
    companySize: {
        type: String,
        trim: true
    },
    headquarters: {
        type: String,
        required: true,
        trim: true
    },
    keyDetails: [genericKeyValueSchema],
    ceo: {
        ceoName: {
            type: String,
            required: true,
            trim: true
        },
        since: {
            type: String,
            required: true,
            trim: true
        },
    },
    founder: {
        founderName: {
            type: String,
            required: true,
            trim: true
        },
        currentRole: {
            type: String,
            required: true,
            trim: true
        }
    },
    website: {
        type: String,
        trim: true
    },
    contactEmail: {
        type: String,
        trim: true
    },
    contactPhone: {
        type: String,
        required: true,
        trim: true
    },
    about: {
        type: String,
        required: true,
        trim: true
    },
    history: [genericKeyValueSchema],
    des: [genericKeyValueSchema],
    departments: [genericKeyValueSchema],
    locations: [locationSchema],
    socialMedia: socialMediaSchema,
    lastActive: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const CompanyProfile = model("CompanyProfile", companySchema);

module.exports = CompanyProfile;

