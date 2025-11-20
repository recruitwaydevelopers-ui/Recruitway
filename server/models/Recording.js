// const { Schema, model } = require('mongoose');

// const recordingSchema = new Schema({
//     roomId: {
//         type: String,
//         required: true,
//         index: true,
//     },
//     taskId: {
//         type: String,
//         required: true,
//         unique: true,
//     },
//     recordingUrl: {
//         type: String, // canonical recording url (first file)
//     },
//     cloudinaryUrl: {
//         type: String,
//     },
//     publicId: {
//         type: String,
//     },
//     status: {
//         type: String,
//         enum: ['started', 'processing', 'completed', 'failed'],
//         default: 'started',
//     },
//     startTime: {
//         type: Date,
//         default: Date.now,
//     },
//     endTime: {
//         type: Date,
//     },
//     duration: {
//         type: Number, // in seconds
//     },
//     fileSize: {
//         type: Number, // in bytes
//     },
//     interviewerId: {
//         type: Schema.Types.ObjectId,
//         ref: 'Auth',
//         // NOT required: allow null to avoid validation problems
//     },
//     CandidateId: {
//         type: Schema.Types.ObjectId,
//         ref: 'Auth',
//     },
//     candidateEmail: {
//         type: String,
//     },
//     source: {
//         type: String,
//     },
//     jobTitle: {
//         type: String,
//     },
//     CvId: {
//         type: Schema.Types.ObjectId,
//     },
//     companyId: {
//         type: Schema.Types.ObjectId,
//         ref: 'Auth',
//     },
//     files: {
//         type: Array,
//         default: [], // store raw zego file objects { FileUrl, Status, FileSize, Duration }
//     },
// }, {
//     timestamps: true,
// });

// const Recording = model('Recording', recordingSchema);
// module.exports = Recording;










// const { Schema, model } = require('mongoose');


// const recordingSchema = new Schema(
// {
// roomId: { type: String, required: true, index: true },
// taskId: { type: String, required: true, unique: true },
// recordingUrl: { type: String },
// status: { type: String, enum: ['started', 'processing', 'completed', 'failed'], default: 'started' },
// startTime: { type: Date, default: Date.now },
// endTime: { type: Date },
// duration: { type: Number },
// fileSize: { type: Number },


// // Normalized field names
// interviewerId: { type: Schema.Types.ObjectId, ref: 'Auth' },
// candidateId: { type: Schema.Types.ObjectId, ref: 'Auth' },
// candidateEmail: { type: String },
// source: { type: String },
// jobTitle: { type: String },
// cvId: { type: Schema.Types.ObjectId },
// companyId: { type: Schema.Types.ObjectId, ref: 'Auth' },


// files: { type: Array, default: [] }, // raw zego files
// },
// { timestamps: true }
// );


// module.exports = model('Recording', recordingSchema);

























const { Schema, model } = require('mongoose');

const recordingSchema = new Schema({
    roomId: { type: String, required: true, index: true },
    taskId: { type: String, required: true, unique: true },
    recordingUrl: { type: String },
    status: { type: String, enum: ['started', 'processing', 'completed', 'failed'], default: 'started' },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date },
    duration: { type: Number },
    fileSize: { type: Number },
    interviewerId: { type: Schema.Types.ObjectId, ref: 'Auth' },
    candidateId: { type: Schema.Types.ObjectId, ref: 'Auth' },
    candidateEmail: { type: String },
    source: { type: String },
    jobTitle: { type: String },
    cvId: { type: Schema.Types.ObjectId },
    companyId: { type: Schema.Types.ObjectId, ref: 'Auth' },
    files: { type: Array, default: [] }
}, { timestamps: true });

const Recording = model('Recording', recordingSchema);
module.exports = Recording;

