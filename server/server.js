require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const cookieParser = require('cookie-parser');
const { Server } = require('socket.io');
const multer = require("multer");

// Database Connection
const connectDB = require('./config/database');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const companyRouter = require('./routes/companyRoutes');
const intervieweeRouter = require('./routes/intervieweeRoutes');
const interviewerRouter = require('./routes/interviewerRoutes');
const superAdmminRouter = require('./routes/superadminRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const chatRoutes = require('./routes/chatRoutes');

// Socket Handlers
const socketAuth = require('./socket/auth');

const companyDashboardRouter = require('./routes/companyDashboardRoutes');
const intervieweeDashboardRouter = require('./routes/intervieweeDashboardRoutes');
const interviewerDashboardRouter = require('./routes/interviewerDashboardRoutes');
const superAdmminDashboardRouter = require('./routes/superadminDashboardRoutes');
const recordingRoutes = require('./routes/recordingRoutes');
const recordingUploadRoutes = require('./routes/recordingUploadRoutes');
const { codeEditorHandlers } = require('./socket/codeEditorHandlers');
const { chatHandlers } = require('./socket/chatHandlers');
const contactRoutes = require('./routes/contactRoutes');
const mockRequestRoutes = require('./routes/mockRequestRoutes');
const consentRoutes = require('./routes/consentRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const blogRoutes = require('./routes/blogRoutes');

const app = express();
app.use(cookieParser());
const server = http.createServer(app);

const corsOption = {
    origin: [process.env.FIRST_FRONTEND_URL, process.env.SECOND_FRONTEND_URL],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

app.use(cors(corsOption));
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

const io = new Server(server, {
    cors: {
        origin: [process.env.FIRST_FRONTEND_URL, process.env.SECOND_FRONTEND_URL],
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// io.on("connection", async (socket) => {
//     const type = socket.handshake.auth?.type || socket.handshake.query?.type;

//     try {
//         if (type === "editor") {
//             // console.log("📝 Editor connected:", socket.id);
//             // directly attach editor handlers
//             codeEditorHandlers(socket, io);
//             return;
//         }

//         if (type === "chat") {
//             // Chat requires authentication
//             socketAuth(socket, (err) => {
//                 if (err) {
//                     console.log("❌ Chat socket auth failed:", err);
//                     return socket.disconnect(true);
//                 }
//                 // console.log("💬 Chat connected:", socket.id, "user:", socket.user?._id);
//                 chatHandlers(socket, io); // now socket.user is set
//             });
//             return;
//         }

//         // fallback
//         // console.log("⚠️ Unknown socket type:", type);
//         socket.disconnect(true);
//     } catch (err) {
//         // console.error("Error in connection handler:", err);
//         socket.disconnect(true);
//     }
// });



const userSocketMap = {};
io.on("connection", async (socket) => {

    socket.on("register", (userId) => {
        userSocketMap[userId] = socket.id;
        console.log("🟢 Registered:", userId, "->", socket.id);
    });

    const type = socket.handshake.auth?.type || socket.handshake.query?.type;

    try {
        if (type === "editor") {
            // console.log("📝 Editor connected:", socket.id);
            // directly attach editor handlers
            codeEditorHandlers(socket, io);
            return;
        }

        if (type === "chat") {
            // Chat requires authentication
            socketAuth(socket, (err) => {
                if (err) {
                    console.log("❌ Chat socket auth failed:", err);
                    return socket.disconnect(true);
                }
                // console.log("💬 Chat connected:", socket.id, "user:", socket.user?._id);
                chatHandlers(socket, io); // now socket.user is set
            });
            return;
        }

        // socket.disconnect(true);
    } catch (err) {
        socket.disconnect(true);
    }

    socket.on("disconnect", () => {
        // Remove disconnected user from map
        for (const userId in userSocketMap) {
            if (userSocketMap[userId] === socket.id) {
                delete userSocketMap[userId];
                console.log("🔴 Disconnected:", userId);
                break;
            }
        }
    });
});

// Attach io to app (so controllers can access it)
// Make io and userSocketMap available in routes
app.set("io", io);
app.set("userSocketMap", userSocketMap);

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/mockRequest', mockRequestRoutes);
app.use('/api/v1/companyDashboard', companyDashboardRouter);
app.use('/api/v1/company', companyRouter);
app.use('/api/v1/candidateDashboard', intervieweeDashboardRouter);
app.use('/api/v1/candidate', intervieweeRouter);
app.use('/api/v1/interviewerDashboard', interviewerDashboardRouter);
app.use('/api/v1/interviewer', interviewerRouter);
app.use('/api/v1/superadminDashboard', superAdmminDashboardRouter);
app.use('/api/v1/superadmin', superAdmminRouter);
app.use('/api/v1/interviews', interviewRoutes);
app.use('/api/v1/recording', recordingRoutes);
app.use("/api/upload", recordingUploadRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use("/api/v1/consent", consentRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/blogs", blogRoutes);



// Multer Error
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                message: "File too large. Maximum allowed size is 5MB.",
            });
        }
    }

    if (err.message.includes("Only JPG")) {
        return res.status(400).json({ message: err.message });
    }

    console.error("Unhandled Error:", err);
    res.status(500).json({ message: "Something went wrong on the server." });
});



// Connect to Database and Start Server
const startServer = async () => {
    try {
        await connectDB();
        const PORT = process.env.PORT || 4000;

        // Use server.listen() instead of app.listen() since we're using Socket.IO
        server.listen(PORT, () => {
            console.log(`✅ Server running on port ${PORT}`);
            console.log(`✅ Socket.IO server ready`);
        });
    } catch (err) {
        console.error(`MongoDB Connection Failed: ${err.message}`);
        process.exit(1);
    }
};

startServer();
