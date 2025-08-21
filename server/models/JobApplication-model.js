const { Schema, model } = require("mongoose");

const itemSchema = new Schema({
    jobId: {
        type: Schema.Types.ObjectId,
        ref: "Job",
        required: true
    },
    status: {
        type: String,
        enum: ["Applied", "Interview Scheduled", "Rejected", "Shortlisted"],
        required: true
    },
    companyId: {
        type: Schema.Types.ObjectId,
        ref: "Auth",
        required: true
    }
}, { timestamps: true });

const jobApplicationSchema = new Schema({
    applicantId: {
        type: Schema.Types.ObjectId,
        ref: "Auth",
        required: true
    },
    items: [itemSchema]
});


jobApplicationSchema.pre('save', function (next) {
    // Only run if the document is not new (i.e., it's an update)
    if (!this.isNew) {
        this._newlyAddedItems = [];

        const currentItems = this.items;
        return this.constructor.findById(this._id).then(existingDoc => {
            if (existingDoc) {
                const existingJobIds = new Set(existingDoc.items.map(item => item.jobId.toString()));
                for (const item of currentItems) {
                    if (!existingJobIds.has(item.jobId.toString())) {
                        this._newlyAddedItems.push(item);
                    }
                }
            }
            next();
        }).catch(err => {
            console.error("Error in pre-save hook:", err);
            next(err);
        });
    } else {
        // First-time document creation: treat all items as new
        this._newlyAddedItems = [...this.items];
        next();
    }
});

jobApplicationSchema.post('save', async function (doc) {
    try {
        const applicant = await model('CandidateProfile').findOne({ userId: doc.applicantId.toString() });

        for (const item of doc._newlyAddedItems || []) {
            const job = await model('Job').findById(item.jobId);

            await model('Notification').create({
                companyId: item.companyId,
                applicantId: doc.applicantId,
                title: 'New Job Application',
                message: `${applicant.fullname} has applied for ${job.title} position`,
                type: 'application',
                priority: 'high',
                actionRequired: true,
                actionUrl: `/dashboard/jobs/applications/${doc._id}`,
                actionLabel: 'Review Application',
                jobId: item.jobId,
                // applicationId: doc.items._id,
                applicationId: doc.items[doc.items.length - 1]._id,
                metadata: {
                    jobTitle: job.title,
                    applicantName: applicant.fullname,
                    applicantPhoto: applicant.profilePicture,
                }
            });
        }
    } catch (error) {
        console.error('Error creating job application notification:', error);
    }
});

const JobApplication = model('JobApplication', jobApplicationSchema);

module.exports = JobApplication