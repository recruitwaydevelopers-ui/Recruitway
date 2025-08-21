require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');


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
const socketHandlers = require('./socket/handlers');
const socketAuth = require('./socket/auth');
const companyDashboardRouter = require('./routes/companyDashboardRoutes');
const intervieweeDashboardRouter = require('./routes/intervieweeDashboardRoutes');
const interviewerDashboardRouter = require('./routes/interviewerDashboardRoutes');
const superAdmminDashboardRouter = require('./routes/superadminDashboardRoutes');

const app = express();
const server = http.createServer(app);

const corsOption = {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

app.use(cors(corsOption));
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/companyDashboard', companyDashboardRouter);
app.use('/api/v1/company', companyRouter);
app.use('/api/v1/candidateDashboard', intervieweeDashboardRouter);
app.use('/api/v1/candidate', intervieweeRouter);
app.use('/api/v1/interviewerDashboard', interviewerDashboardRouter);
app.use('/api/v1/interviewer', interviewerRouter);
app.use('/api/v1/superadminDashboard', superAdmminDashboardRouter);
app.use('/api/v1/superadmin', superAdmminRouter);
app.use('/api/v1/interviews', interviewRoutes);
app.use('/api/v1/chat', chatRoutes);

// Socket.io Setup
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ['GET', 'POST'],
        credentials: false // no cookies, so set this to false
    }
});

// Apply socket authentication middleware
io.use(socketAuth);

io.on('connection', (socket) => socketHandlers(socket, io));

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
