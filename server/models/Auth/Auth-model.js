const { Schema, model } = require("mongoose")
const jwt = require("jsonwebtoken");

const authSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        // required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    provider: {
        type: String,
        enum: ['email', 'google','linkedin'], // Track authentication provider
        default: 'email',
    },
    googleId: {
        type: String, // Store Google's user ID (sub) for Google Sign-In users
        unique: true,
        sparse: true, // Allows null values without violating uniqueness
    },
    linkedinId: {
        type: String, // Store Linkedin's user ID (sub) for Google Sign-In users
        unique: true,
        sparse: true, // Allows null values without violating uniqueness
    },
    role: {
        type: String,
        enum: ['superadmin', 'company', 'interviewer', 'user'],
        default: 'user'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetToken: {
        type: String
    },
    resetEokenExpiry: {
        type: Date
    }
}, { timestamps: true });

authSchema.methods.generateToken = function (rememberMe = false) {
    try {
        const token = jwt.sign(
            {
                userId: this._id.toString(),
                email: this.email,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: rememberMe ? "30d" : "1d"
            }
        );

        return token;
    } catch (error) {
        throw new Error("Error generating token");
    }
};

const Auth = model('Auth', authSchema);

module.exports = Auth