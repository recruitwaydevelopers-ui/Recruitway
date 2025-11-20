// const { Schema, model } = require('mongoose');

// const notificationSchema = new Schema({
//     // Core Notification Info
//     companyId: {
//         type: Schema.Types.ObjectId,
//         ref: 'Auth',
//         required: true
//     },
//     title: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     message: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     type: {
//         type: String,
//         enum: ['application', 'status_update', 'message', 'alert'],
//         default: 'application'
//     },
//     applicantId: {
//         type: Schema.Types.ObjectId,
//         ref: 'Auth'
//     },
//     applicantName: {
//         type: String,
//         trim: true
//     },
//     applicantPhoto: {
//         type: String,
//         trim: true
//     },

//     // Job Application Context
//     jobId: {
//         type: Schema.Types.ObjectId,
//         ref: 'Job'
//     },
//     jobTitle: {
//         type: String,
//         trim: true
//     },
//     applicationId: {
//         type: Schema.Types.ObjectId,
//         ref: 'JobApplication'
//     },

//     // Action Configuration
//     actionRequired: {
//         type: Boolean,
//         default: false
//     },
//     actionUrl: {
//         type: String,
//         trim: true
//     },
//     actionLabel: {
//         type: String,
//         trim: true,
//         default: 'View'
//     },

//     // Status & Metadata
//     priority: {
//         type: String,
//         enum: ['low', 'medium', 'high', 'critical'],
//         default: 'medium'
//     },
//     isRead: {
//         type: Boolean,
//         default: false
//     },
//     metadata: {
//         type: Map,
//         of: Schema.Types.Mixed,
//         default: {}
//     }
// }, {
//     timestamps: true,
//     toJSON: { virtuals: true }
// });

// // Indexes for optimized queries
// notificationSchema.index({ companyId: 1, isRead: 1 });
// notificationSchema.index({ applicantId: 1 });
// notificationSchema.index({ createdAt: -1 });

// const Notification = model('Notification', notificationSchema);

// module.exports = Notification;





const { Schema, model } = require('mongoose');

const notificationSchema = new Schema({
    senderId: {
        type: Schema.Types.ObjectId,
        ref: "Auth"
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: "Auth"
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["JOB_APPLY", "SHORTLIST", "INTERVIEW_SCHEDULED", "REPORT_GENERATED", "REPORT_RECEIVED", "CV_RECEIVED", "MOCK_REQUEST"],
        required: true,
    },
    isRead: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
}, { timestamps: true });

const Notification = model('Notification', notificationSchema);

module.exports = Notification;
