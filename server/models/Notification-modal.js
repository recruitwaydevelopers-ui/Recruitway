// const { Schema, model } = require("mongoose");

// const notificationSchema = new Schema({
//     companyId: {
//         type: Schema.Types.ObjectId,
//         ref: "Auth",
//         required: true
//     },
//     message: {
//         type: String,
//         required: true
//     },
//     jobId: {
//         type: Schema.Types.ObjectId,
//         ref: "Job"
//     },
//     candidateId: {
//         type: Schema.Types.ObjectId,
//         ref: "Auth"
//     },
//     isRead: {
//         type: Boolean,
//         default: false
//     },
// }, { timestamps: true });

// const Notification = model("Notification", notificationSchema);
// module.exports = Notification




// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const notificationSchema = new Schema({
//     companyId: {
//         type: Schema.Types.ObjectId,
//         ref: 'Auth',
//         required: true
//     },
//     userId: {
//         type: Schema.Types.ObjectId,
//         ref: 'Auth',
//         required: false
//     },
//     title: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     body: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     type: {
//         type: String,
//         enum: ['system', 'message', 'alert', 'update', 'event', 'reminder'],
//         default: 'system'
//     },
//     priority: {
//         type: String,
//         enum: ['low', 'normal', 'high', 'critical'],
//         default: 'normal'
//     },
//     icon: {
//         type: String,
//         default: 'bell'
//     },
//     isRead: {
//         type: Boolean,
//         default: false
//     },
//     isArchived: {
//         type: Boolean,
//         default: false
//     },
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
//     metadata: {
//         type: Map,
//         of: Schema.Types.Mixed,
//         default: {}
//     },
//     expiresAt: {
//         type: Date,
//         index: { expires: 0 }
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now
//     },
//     updatedAt: {
//         type: Date,
//         default: Date.now
//     }
// }, {
//     timestamps: true,
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true }
// });

// // Indexes for faster queries
// notificationSchema.index({ companyId: 1, isRead: 1 });
// notificationSchema.index({ userId: 1, isRead: 1 });
// notificationSchema.index({ createdAt: -1 });

// // Pre-save hook to set icon based on type if not specified
// notificationSchema.pre('save', function (next) {
//     if (!this.icon) {
//         const iconMap = {
//             system: 'bell',
//             message: 'message',
//             alert: 'alert-circle',
//             update: 'refresh',
//             event: 'calendar',
//             reminder: 'clock'
//         };
//         this.icon = iconMap[this.type] || 'bell';
//     }
//     next();
// });

// const Notification = mongoose.model('Notification', notificationSchema);

// module.exports = Notification;





// const { Schema, model } = require('mongoose');

// const notificationSchema = new Schema({
//     companyId: {
//         type: Schema.Types.ObjectId,
//         ref: 'Auth',
//         required: true
//     },
//     applicantId: {
//         type: Schema.Types.ObjectId,
//         ref: 'Auth',
//         required: true
//     },
//     senderName: {
//         type: String,
//         trim: true
//     },
//     senderPhoto: {
//         type: String, // URL to profile picture
//         trim: true
//     },

//     // Job Application Details
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
//     title: {
//         type: String,
//         required: true,
//         trim: true,
//         default: 'New Job Application'
//     },
//     message: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     type: {
//         type: String,
//         enum: ['application', 'status_update', 'interview', 'message'],
//         default: 'application'
//     },
//     isRead: {
//         type: Boolean,
//         default: false
//     },
//     actionRequired: {
//         type: Boolean,
//         default: true
//     },
//     actionLabel: {
//         type: String,
//         default: 'Review Application'
//     },
//     actionLink: {
//         type: String,
//         default: '/dashboard/applications'
//     },
//     priority: {
//         type: String,
//         enum: ['low', 'normal', 'high', 'urgent'],
//         default: 'high'
//     },
//     status: {
//         type: String,
//         enum: ['pending', 'reviewed', 'archived'],
//         default: 'pending'
//     }
// }, {
//     timestamps: true,
//     toJSON: { virtuals: true }
// });

// // Indexes for performance
// notificationSchema.index({ recipientId: 1, isRead: 1 });
// notificationSchema.index({ companyId: 1, createdAt: -1 });
// notificationSchema.index({ applicationId: 1 });

// // Pre-save hook to format the message
// notificationSchema.pre('save', function (next) {
//     if (this.isNew && this.type === 'application') {
//         this.message = `${this.senderName} applied for "${this.jobTitle}"`;
//     }
//     next();
// });

// const Notification = model('Notification', notificationSchema);
// module.exports = Notification;








const { Schema, model } = require('mongoose');

const notificationSchema = new Schema({
    // Core Notification Info
    companyId: {
        type: Schema.Types.ObjectId,
        ref: 'Auth',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['application', 'status_update', 'message', 'alert'],
        default: 'application'
    },
    applicantId: {
        type: Schema.Types.ObjectId,
        ref: 'Auth'
    },
    applicantName: {
        type: String,
        trim: true
    },
    applicantPhoto: {
        type: String,
        trim: true
    },

    // Job Application Context
    jobId: {
        type: Schema.Types.ObjectId,
        ref: 'Job'
    },
    jobTitle: {
        type: String,
        trim: true
    },
    applicationId: {
        type: Schema.Types.ObjectId,
        ref: 'JobApplication'
    },

    // Action Configuration
    actionRequired: {
        type: Boolean,
        default: false
    },
    actionUrl: {
        type: String,
        trim: true
    },
    actionLabel: {
        type: String,
        trim: true,
        default: 'View'
    },

    // Status & Metadata
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
    },
    isRead: {
        type: Boolean,
        default: false
    },
    metadata: {
        type: Map,
        of: Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true }
});

// Indexes for optimized queries
notificationSchema.index({ companyId: 1, isRead: 1 });
notificationSchema.index({ applicantId: 1 });
notificationSchema.index({ createdAt: -1 });

const Notification = model('Notification', notificationSchema);

module.exports = Notification;
