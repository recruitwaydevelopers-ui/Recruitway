const { Schema, model } = require("mongoose");

const ageSchema = new Schema({
    years: {
        type: Number,
        default: 0
    },
    months: {
        type: Number,
        default: 0
    },
    days: {
        type: Number,
        default: 0
    }
}, { _id: false });

const experienceSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    location: {
        type: String

    },
    startDate: {
        type: String
    },
    endDate: {
        type: String

    },
    description: {
        type: String
    }
}, { _id: false });

const educationSchema = new Schema({
    degree: {
        type: String,
        required: true
    },
    institution: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    }
}, { _id: false });

const skillSchema = new Schema({
    skill: {
        type: String,
        required: true
    }
}, { _id: false });

const certificationSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    issuer: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    }
}, { _id: false });

const languageSchema = new Schema({
    language: {
        type: String,
        required: true
    }
}, { _id: false });

const interviewDomainSchema = new Schema({
    domain: {
        type: String,
        required: true
    }
}, { _id: false });

const socialMediaSchema = new Schema({
    linkedin: {
        type: String
    },
    twitter: {
        type: String
    },
    github: {
        type: String
    }
}, { _id: false });

const availabilitySchema = new Schema({
    day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        required: true
    },
    time: {
        type: String,
        enum: ['Morning (9AM-12PM)', 'Afternoon (12PM-5PM)', 'Evening (5PM-9PM)'],
        required: true
    },
    timezone: {
        type: String,
        enum: ['UTC', 'EST', 'PST', 'IST'],
        required: true
    }
}, { _id: false });

const interviewerProfileSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Auth',
        required: true,
        unique: true
    },
    profilePicture: {
        type: String
    },
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other', 'prefer not to say'],
        default: 'male'
    },
    dob: {
        type: String
    },
    age: ageSchema,
    headline: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    yearsOfExperience: {
        type: String,
        required: true
    },
    experience: [experienceSchema],
    education: [educationSchema],
    skills: [skillSchema],
    certifications: [certificationSchema],
    languages: [languageSchema],
    interviewDomains: [interviewDomainSchema],
    socialMedia: socialMediaSchema,
    availability: [availabilitySchema]
}, { timestamps: true });

// Calculate age before saving
interviewerProfileSchema.pre('save', function (next) {
    if (this.dob) {
        const birthDate = new Date(this.dob);
        const today = new Date();

        let years = today.getFullYear() - birthDate.getFullYear();
        let months = today.getMonth() - birthDate.getMonth();
        let days = today.getDate() - birthDate.getDate();

        if (days < 0) {
            months--;
            const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
            days += prevMonth.getDate();
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        this.age = { years, months, days };
    }
    next();
});

const InterviewerProfile = model("InterviewerProfile", interviewerProfileSchema)

module.exports = InterviewerProfile