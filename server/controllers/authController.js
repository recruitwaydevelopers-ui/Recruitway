const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
const Auth = require('../models/Auth/Auth-model');
const CandidateProfile = require('../models/Auth/Candidate-model');
const InterviewerProfile = require('../models/Auth/Interviewer-model');
const CompanyProfile = require('../models/Auth/Company-model');
const SuperAdminProfile = require('../models/Auth/SuperAdmin-model');
const { sendInterviewEmail } = require('../utils/interview-emailService');
const VerificationCode = require('../models/Auth/VerificationCode-model');
const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');

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
        // console.log(error);
        return res.status(400).json({ success: false, message: error })
    }
}

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

const loginWithGoogle = async (req, res) => {
    const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    try {
        // Validate request body
        const { token, role } = req.body;
        if (!token) {
            return res.status(400).json({ success: false, message: 'Google token is required' });
        }

        if (!role || !['superadmin', 'company', 'interviewer', 'user'].includes(role)) {
            return res.status(400).json({ success: false, message: 'Invalid or missing role' });
        }

        // Verify Google ID token
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();

        if (!payload) {
            return res.status(401).json({ success: false, message: 'Invalid Google token' });
        }

        const { sub: googleId, email } = payload;

        // Find or create user
        let user = await Auth.findOne({ $or: [{ googleId }, { email }] });

        if (!user) {

            if (role === 'interviewer') {
                return res.status(401).json({ success: false, message: 'Please check the role' });
            }
            // Create new user for Google Sign-In
            user = new Auth({
                email,
                googleId,
                provider: 'google',
                role,
                isVerified: false, // Set to false by default for new users
            });
            await user.save();
        } else {
            // Check role compatibility
            if (user.role !== role) {
                return res.status(400).json({ success: false, message: 'User does not existing' });
            }

            // Link Google account if not already linked
            if (!user.googleId) {
                user.googleId = googleId;
                user.provider = 'google';
                await user.save();
            }
        }

        // Check verification status
        if (!user.isVerified) {
            return res.status(403).json({
                success: false,
                message: 'Thank you for registering. Your account is currently under review and will be verified shortly.',
            });
        }

        // Define role-based paths
        let path = "";

        switch (user.role) {
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

        return res.status(200).json({ success: true, message: "Login SuccessFul", token: user.generateToken(), path: path })
    } catch (error) {
        console.error('Google auth error:', error);
        return res.status(401).json({
            success: false,
            message: 'Authentication failed. Please try again.',
        });
    }
};









// const loginWithLinkedin = async (req, res) => {
//     try {
//         const { LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET, LINKEDIN_REDIRECT_URI } = process.env;
//         if (!LINKEDIN_CLIENT_ID || !LINKEDIN_CLIENT_SECRET || !LINKEDIN_REDIRECT_URI) {
//             return res.status(500).json({ success: false, message: 'Server configuration error' });
//         }

//         const { code, role } = req.body;
//         console.log(code, role);

//         if (!code) return res.status(400).json({ success: false, message: 'Authorization code is required' });
//         if (!role || !['company', 'user'].includes(role)) {
//             return res.status(400).json({ success: false, message: 'Invalid or missing role' });
//         }

//         const tokenResponse = await axios.post(
//             'https://www.linkedin.com/oauth/v2/accessToken',
//             new URLSearchParams({
//                 grant_type: 'authorization_code',
//                 code,
//                 redirect_uri: LINKEDIN_REDIRECT_URI,
//                 client_id: LINKEDIN_CLIENT_ID,
//                 client_secret: LINKEDIN_CLIENT_SECRET,
//             }).toString(),
//             {
//                 headers: {
//                     'Content-Type': 'application/x-www-form-urlencoded',
//                 },
//             }
//         );

//         console.log(tokenResponse);


//         const accessToken = tokenResponse.data.access_token;

//         const profileRes = await axios.get('https://api.linkedin.com/v2/me', {
//             headers: { Authorization: `Bearer ${accessToken}` },
//         });

//         const emailRes = await axios.get(
//             'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))',
//             { headers: { Authorization: `Bearer ${accessToken}` } }
//         );

//         const linkedinId = profileRes.data.id;
//         const name = `${profileRes.data.localizedFirstName} ${profileRes.data.localizedLastName}`;
//         const email = emailRes.data.elements[0]['handle~'].emailAddress;

//         let user = await Auth.findOne({ $or: [{ linkedinId }, { email }] });

//         if (!user) {
//             user = new Auth({
//                 email,
//                 linkedinId,
//                 provider: 'linkedin',
//                 role,
//                 isVerified: false,
//                 name,
//             });
//             await user.save();
//         } else {
//             if (user.role !== role) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Selected role does not match existing user role',
//                 });
//             }

//             if (!user.linkedinId) {
//                 user.linkedinId = linkedinId;
//                 user.provider = 'linkedin';
//                 user.name = name;
//                 await user.save();
//             }
//         }

//         if (!user.isVerified) {
//             return res.status(403).json({
//                 success: false,
//                 message: 'Your account is under review and will be verified shortly.',
//             });
//         }

//         const rolePaths = {
//             superadmin: 'superadmin/dashboard',
//             company: 'company/dashboard',
//             interviewer: 'interviewer/dashboard',
//             interviewee: 'interviewee/dashboard',
//             user: 'user/dashboard',
//         };

//         const path = rolePaths[user.role] || 'user/dashboard';

//         const authToken = user.generateToken();

//         return res.status(200).json({
//             success: true,
//             message: 'Login successful',
//             token: authToken,
//             path,
//         });
//     } catch (error) {
//         console.error('LinkedIn auth error:', error.message);
//         return res.status(401).json({
//             success: false,
//             message: error.message || 'LinkedIn authentication failed. Please try again.',
//         });
//     }
// };









const loginWithLinkedin = async (req, res) => {
    const { code, role } = req.body;

    console.log(code);

    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
    const redirectUri = `${process.env.FRONTEND_URL}/linkedin-callback`;

    try {
        // Exchange code for access token
        const tokenResponse = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', null, {
            params: {
                grant_type: 'authorization_code',
                code,
                redirect_uri: redirectUri,
                client_id: clientId,
                client_secret: clientSecret,
            },
        });

        const accessToken = tokenResponse.data.access_token;

        console.log(accessToken);


        // Fetch user profile
        const profileResponse = await axios.get('https://api.linkedin.com/v2/userinfo', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        const userData = profileResponse.data;

        console.log(userData);


        const user = {
            linkedinId: userData.sub,
            email: userData.email || null,
            name: userData.name,
            role,
        };

        //    const accessToken = tokenResponse.data.access_token;

        //         const profileRes = await axios.get('https://api.linkedin.com/v2/me', {
        //             headers: { Authorization: `Bearer ${accessToken}` },
        //         });

        //         const emailRes = await axios.get(
        //             'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))',
        //             { headers: { Authorization: `Bearer ${accessToken}` } }
        //         );

        //         const linkedinId = profileRes.data.id;
        //         const name = `${profileRes.data.localizedFirstName} ${profileRes.data.localizedLastName}`;
        //         const email = emailRes.data.elements[0]['handle~'].emailAddress;

        //         let user = await Auth.findOne({ $or: [{ linkedinId }, { email }] });

        //         if (!user) {
        //             user = new Auth({
        //                 email,
        //                 linkedinId,
        //                 provider: 'linkedin',
        //                 role,
        //                 isVerified: false,
        //                 name,
        //             });
        //             await user.save();
        //         } else {
        //             if (user.role !== role) {
        //                 return res.status(400).json({
        //                     success: false,
        //                     message: 'Selected role does not match existing user role',
        //                 });
        //             }

        //             if (!user.linkedinId) {
        //                 user.linkedinId = linkedinId;
        //                 user.provider = 'linkedin';
        //                 user.name = name;
        //                 await user.save();
        //             }
        //         }

        //         if (!user.isVerified) {
        //             return res.status(403).json({
        //                 success: false,
        //                 message: 'Your account is under review and will be verified shortly.',
        //             });
        //         }

        const rolePaths = {
            superadmin: 'superadmin/dashboard',
            company: 'company/dashboard',
            interviewer: 'interviewer/dashboard',
            interviewee: 'interviewee/dashboard',
            user: 'user/dashboard',
        };

        const path = rolePaths[user.role] || 'user/dashboard';

        const authToken = user.generateToken();

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token: authToken,
            path,
        });

    } catch (error) {
        console.error('LinkedIn auth error:', error);
        res.status(400).json({ message: 'LinkedIn authentication failed' });
    }
};










const loginController = async (req, res) => {
    const { email, password, rememberMe } = req.body
    // console.log(email, password, rememberMe);

    try {
        // Find User Exist Or Not
        const userExists = await Auth.findOne({ email: email.toLowerCase() })

        if (!userExists) {
            return res.status(400).json({ success: false, message: 'User does not exist' })
        }

        if (!userExists?.isVerified) {
            return res.status(400).json({ success: false, message: 'Thank you for registering. Your account is currently under review and will be verified shortly.' })
        }

        // Check User Password Is Correct Or Not
        const isPasswordCorrect = await bcrypt.compare(password, userExists.password)

        if (!isPasswordCorrect) {
            return res.status(400).json({ success: false, message: "Invalid Credentials" })
        }
        const userLoggedIn = await Auth.findById(userExists._id).select("-password")

        let path = "";

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

        return res.status(200).json({ success: true, message: "Login SuccessFul", token: userLoggedIn.generateToken(remember), path: path })

    } catch (error) {
        return res.status(400).json({ success: false, message: error })
    }
}

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

        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

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
    loginWithGoogle, loginWithLinkedin
} 