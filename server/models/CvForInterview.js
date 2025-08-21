const { Schema, model } = require('mongoose');

const cvFileSchema = new Schema({
  originalName: {
    type: String,
    required: true
  },
  public_id: {
    type: String,
    required: true
  },
  secure_url: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  mimetype: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["Submitted", "Interview Scheduled"],
    default: "Submitted",
    required: true
  },
}, );
// }, { _id: false });

const cvforinterviewSchema = new Schema({
  companyId: {
    type: Schema.Types.ObjectId,
    ref: "Auth",
    required: true,
  },
  title: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  location: {
    type: String,
  },
  salary: {
    type: String,
  },
  type: {
    type: String,
  },
  experience: {
    type: String,
  },
  posted: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: String,
  },
  description: {
    type: String,
  },
  requirements: {
    type: [String],
  },
  skills: {
    type: [String],
  },
  CvFile: [cvFileSchema]

}, { timestamps: true });


const CVForInterview = model('CVForInterview', cvforinterviewSchema);

module.exports = CVForInterview
