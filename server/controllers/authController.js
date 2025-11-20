const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
const Auth = require('../models/Auth/Auth-model');
const CandidateProfile = require('../models/Auth/Candidate-model');
const InterviewerProfile = require('../models/Auth/Interviewer-model');
const CompanyProfile = require('../models/Auth/Company-model');
const SuperAdminProfile = require('../models/Auth/SuperAdmin-model');
const { sendInterviewEmail } = require('../utils/interview-emailService');
const VerificationCode = require('../models/Auth/VerificationCode-model');
// const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');
const { default: mongoose } = require('mongoose');
const CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const REDIRECT_URI = process.env.LINKEDIN_REDIRECT_URI;

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

const generateCode = () => Math.floor(1000 + Math.random() * 9000).toString();

const registerController = async (req, res) => {
    const { email, password, role } = req.body
    try {
        if (!email || !password || !role) {
            return res.status(400).json({ success: false, message: 'All fields are required' })
        }

        // Check if user already exists
        const existedUser = await Auth.findOne({ email: email.toLowerCase() })

        if (existedUser) {
            return res.status(400).json({ success: false, message: 'Email already exists' })
        }

        // Encrypt password

        const salt = bcrypt.genSaltSync(10);
        const hashPassword = await bcrypt.hashSync(password, salt)

        // Create a new user
        const userCreated = new Auth({ email: email.toLowerCase(), password: hashPassword, role })

        await userCreated.save()

        const code = generateCode();
        const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 mins

        await VerificationCode.create({ email, code, expiresAt });
        await sendInterviewEmail({
            to: email,
            subject: 'Registration Verification',
            template: 'verificationCode',
            context: {
                email: email,
                code: code
            }
        });

        return res.status(200).json({ success: true, message: "Verification code sent", path: "verification" })

    } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, message: error })
    }
}

const registerWithLinkedin = (req, res) => {
    const { role } = req.query;

    const scope = "openid profile email";

    const authUrl =
        `https://www.linkedin.com/oauth/v2/authorization?response_type=code` +
        `&client_id=${CLIENT_ID}` +
        `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
        `&scope=${encodeURIComponent(scope)}` +
        `&state=${role}`;

    res.json({ authUrl });
};

const registerWithLinkedinData = async (req, res) => {
    const { code, state: role, error, error_description } = req.query;

    if (error) {
        return res.status(400).json({ error, error_description });
    }
    if (!code) {
        return res.status(400).json({ error: "Authorization code missing" });
    }

    try {
        // Exchange code for access token
        const body = new URLSearchParams({
            grant_type: "authorization_code",
            code,
            redirect_uri: REDIRECT_URI,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
        });

        const tokenRes = await axios.post(
            "https://www.linkedin.com/oauth/v2/accessToken",
            body.toString(),
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );

        const accessToken = tokenRes.data.access_token;

        // Fetch user info
        const userInfoRes = await axios.get("https://api.linkedin.com/v2/userinfo", {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        // Save / find user
        let user = await Auth.findOne({ email: userInfoRes.data.email });

        if (user) {
            // Update existing user
            user.provider = "linkedin";
            user.linkedinId = userInfoRes.data.sub;
            user.isVerified = true;
            await user.save();
        } else {
            // Create new user
            user = new Auth({
                email: userInfoRes.data.email,
                provider: "linkedin",
                linkedinId: userInfoRes.data.sub,
                isVerified: true,
                role: role === "user" ? "user" : role === "interviewer" ? "interviewer" : role === "company" ? "company" : "user"
            });
            await user.save();
        }
        const remember = true;

        res.json({ user, token: user.generateToken(remember) });
    } catch (err) {
        res.status(500).json({
            error: "Authentication failed",
            details: err.response?.data || err.message,
        });
    }
};

const registerWithGoogle = (req, res) => {
    const { role } = req.query;

    const scope = "openid profile email";

    const authUrl =
        `https://accounts.google.com/o/oauth2/v2/auth?response_type=code` +
        `&client_id=${GOOGLE_CLIENT_ID}` +
        `&redirect_uri=${encodeURIComponent(GOOGLE_REDIRECT_URI)}` +
        `&scope=${encodeURIComponent(scope)}` +
        `&access_type=offline` +
        `&state=${role}`; // 👈 add role in state

    res.json({ authUrl });
};

const registerWithGoogleData = async (req, res) => {
    const { code, state } = req.query;
    const role = state;
    try {
        // 1. Exchange code for tokens
        const tokenRes = await axios.post("https://oauth2.googleapis.com/token", {
            code,
            client_id: GOOGLE_CLIENT_ID,
            client_secret: GOOGLE_CLIENT_SECRET,
            redirect_uri: GOOGLE_REDIRECT_URI,
            grant_type: "authorization_code",
        });

        const { id_token, access_token } = tokenRes.data;

        // 2. Fetch user profile
        const userRes = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        // Save / find user
        let user = await Auth.findOne({ email: userRes.data.email });

        if (user) {
            // Update existing user
            user.provider = "google";
            user.googleId = userRes.data.sub;
            user.isVerified = true;
            await user.save();
        } else {
            // Create new user
            user = new Auth({
                email: userRes.data.email,
                provider: "google",
                googleId: userRes.data.sub,
                isVerified: true,
                role: role === "user" ? "user" : role === "interviewer" ? "interviewer" : role === "company" ? "company" : "user"
            });
            await user.save();
        }

        const remember = true;

        res.json({ user, token: user.generateToken(remember) });

    } catch (err) {
        console.error("Google callback error:", err.response?.data || err.message);
        res.status(500).json({ error: "Google login failed" });
    }
};

const verifyCode = async (req, res) => {
    const { email, code } = req.body;

    try {
        const record = await VerificationCode.findOne({ email, code });

        if (!record) return res.status(400).json({ message: 'Invalid code' });
        if (record.expiresAt < new Date()) return res.status(400).json({ message: 'Code expired' });

        const userSaved = await Auth.findOne({ email })


        if (userSaved.email !== email || record.code !== code || record.email !== email) {
            return res.status(200).json({ message: 'Invalid Credentials' });
        }

        await VerificationCode.deleteMany({ email });

        res.status(200).json({ success: true, message: 'Registration SuccessFul', path: '/waitingReply' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const resendCode = async (req, res) => {
    const { email } = req.body;

    try {
        const existing = await VerificationCode.findOne({ email });

        // If a code is still valid, prevent resending
        if (existing && existing.expiresAt > new Date()) {
            const remaining = Math.ceil((existing.expiresAt - Date.now()) / 1000);
            return res.status(400).json({ message: `Please wait ${remaining} seconds before requesting again.` });
        }

        // Generate and store new code
        const code = generateCode();
        const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

        await VerificationCode.findOneAndUpdate(
            { email },
            { code, expiresAt },
            { upsert: true, new: true }
        );

        // Send the verification email
        await sendInterviewEmail({
            to: email,
            subject: 'Registration Verification',
            template: 'verificationCode',
            context: {
                email,
                code
            }
        });

        return res.status(200).json({ message: 'New code sent successfully.' });
    } catch (err) {
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

const loginController = async (req, res) => {
    const { email, password, rememberMe } = req.body;

    try {
        // Check if email is provided
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required." });
        }

        // Find User
        const userExists = await Auth.findOne({ email: email.toLowerCase() });

        if (!userExists) {
            return res.status(404).json({ success: false, message: "User does not exist." });
        }

        // Check if verified
        if (!userExists.isVerified) {
            return res.status(403).json({ success: false, message: "Your account is under review. Verification pending." });
        }

        // Check if user registered via OAuth
        if (!userExists.password) {
            return res.status(400).json({ success: false, message: "Please login using Google or LinkedIn." });
        }

        // Validate password
        const isPasswordCorrect = await bcrypt.compare(password, userExists.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ success: false, message: "Invalid credentials." });
        }

        // Fetch user details excluding password
        const userLoggedIn = await Auth.findById(userExists._id).select("-password");

        // Role-based dashboard path
        let path;
        switch (userLoggedIn.role) {
            case "superadmin":
                path = "superadmin/dashboard";
                break;
            case "company":
                path = "company/dashboard";
                break;
            case "interviewer":
                path = "interviewer/dashboard";
                break;
            case "interviewee":
                path = "interviewee/dashboard";
                break;
            default:
                path = "user/dashboard";
                break;
        }

        const remember = rememberMe === true || rememberMe === "true";

        // Generate token
        const token = userLoggedIn.generateToken(remember);

        return res.status(200).json({ success: true, message: "Login SuccessFul", token, path: path })

    } catch (error) {
        // console.error("Login Error:", error);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};

const userController = async (req, res) => {
    try {
        const roleuser = req.user;

        if (!roleuser) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        let profile;

        switch (roleuser.role) {
            case "user":
            case "interviewee":
                profile = await CandidateProfile.findOne({ userId: roleuser._id });
                break;
            case "interviewer":
                profile = await InterviewerProfile.findOne({ userId: roleuser._id });
                break;
            case "company":
                profile = await CompanyProfile.findOne({ userId: roleuser._id });
                break;
            case "superadmin":
                profile = await SuperAdminProfile.findOne({ userId: roleuser._id });
                break;
            default:
                return res.status(400).json({ message: "Invalid user role" });
        }

        const user = {
            ...roleuser.toObject(),
            ...(profile ? profile.toObject() : {})
        };

        return res.status(200).json({ data: user });

    } catch (error) {
        console.error("userController error:", error);
        return res.status(500).json({ message: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const { role } = req.query;

        if (!role || !["company", "superadmin"].includes(role)) {
            return res.status(400).json({ message: "Invalid or missing role" });
        }

        // Determine which type of users/profiles to fetch
        const targetRole = role === "company" ? "superadmin" : "company";

        let usersWithProfiles;

        if (targetRole === "company") {
            // Fetch only companies that have a profile
            usersWithProfiles = await CompanyProfile.find()
                .populate({
                    path: "userId",
                    match: { role: "company", _id: { $ne: req.user._id } }, // only companies
                    select: "fullName email role",
                })
                .lean();

            // remove ones where userId didn’t match
            usersWithProfiles = usersWithProfiles.filter((p) => p.userId);
        } else {
            // Fetch only superadmins that have a profile
            usersWithProfiles = await SuperAdminProfile.find()
                .populate({
                    path: "userId",
                    match: { role: "superadmin", _id: { $ne: req.user._id } }, // only superadmins
                    select: "fullName email role",
                })
                .lean();

            usersWithProfiles = usersWithProfiles.filter((p) => p.userId);
        }

        // Final clean response: merge user and profile
        const data = usersWithProfiles.map((profile) => ({
            ...profile.userId, // from Auth
            profile, // full profile document
        }));

        return res.status(200).json({ data });
    } catch (error) {
        console.error("userController error:", error);
        return res.status(500).json({ message: error.message });
    }
};

const checkPassword = async (req, res) => {
    const userId = req.user?._id;
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ success: false, message: "Password is required" });
    }

    try {
        const user = await Auth.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.provider === "google" || user.provider === "linkedin") {

            if (user.password === undefined || user.password === null || user.password.trim() === "") {
                return res.status(403).json({ success: false, message: "Password authentication not available for social login accounts. Please set a password first." });
            }
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        return res.status(200).json({ success: true, message: "Password verified successfully" });
    } catch (error) {
        console.error('Password check error:', error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    try {
        const user = await Auth.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Compare old password
        const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ success: false, message: "Invalid Credentials" });
        }

        // Hash new password
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(newPassword, salt);

        // Update password
        user.password = hashPassword;
        await user.save();

        res.status(200).json({ success: true, message: "Password changed successfully" });
    } catch (error) {
        // console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await Auth.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
        user.resetToken = token;
        user.resetEokenExpiry = Date.now() + 15 * 60 * 1000;
        await user.save();

        const resetLink = `${process.env.FIRST_FRONTEND_URL}/reset-password/${token}`;

        await sendInterviewEmail({
            to: email,
            subject: 'Reset Your Password',
            template: 'resetPassword',
            context: {
                userName: user.fullname || "User",
                resetLink,
            },
        });

        return res.status(200).json({ message: "Password reset email sent successfully." });
    } catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({ message: error.message });
    }
};

const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await Auth.findById(decoded.id);

        if (!user || user.resetToken !== token || user.resetEokenExpiry < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        const salt = bcrypt.genSaltSync(10);
        const hashPassword = await bcrypt.hashSync(newPassword, salt)

        user.password = hashPassword;
        user.resetToken = undefined;
        user.resetEokenExpiry = undefined;

        await user.save();
        return res.status(200).json({ success: true, message: "Password reset successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteAccount = async (req, res) => {
    const { password } = req.body;

    try {
        const user = await Auth.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        // Send farewell email before deleting
        await sendInterviewEmail({
            to: user.email,
            subject: 'Account Deletion Confirmation',
            template: 'accountDeletion',
            context: {
                userName: user.fullname || "User"
            }
        });

        // Delete user (actual deletion logic needed here)
        await user.remove();

        res.status(200).json({ message: 'Your account has been successfully deleted.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// const deleteAccount = async (req, res) => {
//     const { password } = req.body;
//     const userId = req.user._id;

//     try {
//         const user = await Auth.findById(userId);
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         const isPasswordCorrect = await bcrypt.compare(password, user.password);
//         if (!isPasswordCorrect) {
//             return res.status(400).json({ success: false, message: "Invalid credentials" });
//         }

//         // Send farewell email
//         await sendInterviewEmail({
//             to: user.email,
//             subject: 'Account Deletion Confirmation',
//             template: 'accountDeletion',
//             context: {
//                 userName: user.fullname || "User"
//             }
//         });

//         const role = user.role;

//         if (role === "company") {
//             const companyJobs = await Job.find({ userId });

//             const jobIds = companyJobs.map(job => job._id);

//             // Delete job applications related to company jobs
//             await JobApplication.updateMany(
//                 { "items.jobId": { $in: jobIds } },
//                 { $pull: { items: { jobId: { $in: jobIds } } } }
//             );

//             // Delete interviews associated with company
//             await Interview.deleteMany({ companyId: userId });

//             // Delete notifications for this company
//             await Notification.deleteMany({ companyId: userId });

//             // Delete reports related to company’s interviews
//             const companyInterviewIds = (await Interview.find({ companyId: userId })).map(i => i._id);
//             await Report.deleteMany({ interviewId: { $in: companyInterviewIds } });

//             // Delete jobs
//             await Job.deleteMany({ userId });

//             // Delete company profile
//             await CompanyProfile.deleteOne({ userId });
//         }

//         if (role === "user" || role === "interviewee") {
//             // Delete job applications made by the user
//             await JobApplication.deleteMany({ applicantId: userId });

//             // Delete interviews for this candidate
//             await Interview.deleteMany({ candidateId: userId });

//             // Delete notifications for this user
//             await Notification.deleteMany({ applicantId: userId });

//             // Delete reports related to this user
//             const candidateInterviewIds = (await Interview.find({ candidateId: userId })).map(i => i._id);
//             await Report.deleteMany({ interviewId: { $in: candidateInterviewIds } });

//             // Delete candidate profile
//             await CandidateProfile.deleteOne({ userId });
//         }

//         // Finally, delete from Auth
//         await Auth.deleteOne({ _id: userId });

//         res.status(200).json({ message: 'Your account has been successfully deleted.' });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "Something went wrong while deleting the account." });
//     }
// };


module.exports = {
    registerController, loginController, userController, verifyCode, resendCode,
    checkPassword, changePassword, forgotPassword, resetPassword, deleteAccount,
    registerWithLinkedin, registerWithLinkedinData, registerWithGoogle, registerWithGoogleData, getAllUsers
} 