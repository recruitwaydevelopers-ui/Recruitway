// const jwt = require('jsonwebtoken');
// const Auth = require('../models/Auth/Auth-model');

// const socketAuth = async (socket, next) => {
//     try {
//         const token =
//             socket.handshake.auth?.token ||
//             socket.handshake.headers?.authorization?.replace('Bearer ', '');

//         if (!token) {
//             return next(new Error('No token provided'));
//         }

//         // Verify token (synchronously or with a Promise)
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         // Fetch user from DB
//         const user = await Auth.findById(decoded.userId);
//         if (!user) {
//             return next(new Error('User not found'));
//         }

//         // Attach user to socket for later use
//         socket.user = user;
//         console.log(`✅ Socket authenticated: ${user._id} (${socket.id})`);

//         next();
//     } catch (error) {
//         console.error('❌ Socket authentication failed:', error.message);
//         next(new Error('Authentication error'));
//     }
// };

// module.exports = socketAuth;















// socketAuth.js
// Put this file somewhere like /server/socketAuth.js
const jwt = require("jsonwebtoken");
const Auth = require("../models/Auth/Auth-model"); // adjust path to your model

/**
 * socketAuth for io.use(...) middleware
 * It expects token in socket.handshake.auth.token (or Authorization header)
 * Attaches socket.user = userDocument
 */
const socketAuth = async (socket, next) => {
    try {
        const rawToken =
            socket.handshake.auth?.token ||
            (socket.handshake.headers?.authorization || "").replace("Bearer ", "");

        if (!rawToken) {
            const err = new Error("No token provided");
            err.data = { code: "NO_TOKEN" };
            return next(err);
        }

        // verify token
        const decoded = jwt.verify(rawToken, process.env.JWT_SECRET);
        if (!decoded || !decoded.userId) {
            const err = new Error("Invalid token");
            err.data = { code: "INVALID_TOKEN" };
            return next(err);
        }

        // load user from DB
        const user = await Auth.findById(decoded.userId).select("-password");
        if (!user) {
            const err = new Error("User not found");
            err.data = { code: "USER_NOT_FOUND" };
            return next(err);
        }

        // attach user to socket
        socket.user = user;
        return next();
    } catch (error) {
        console.error("❌ socketAuth error:", error.message);
        const err = new Error("Authentication error");
        err.data = { code: "AUTH_ERROR", message: error.message };
        return next(err);
    }
};

module.exports = socketAuth;
