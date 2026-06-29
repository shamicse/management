const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
    application: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true, unique: true, index: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'Recruiter', required: true, index: true },
    scheduledAt: { type: Date, required: true, index: true },
    mode: { type: String, enum: ['Online', 'Offline'], default: 'Online' },
    venue: { type: String, default: '' },
    meetingLink: { type: String, default: '' },
    notes: { type: String, default: '' },
    status: { type: String, enum: ['Scheduled', 'Rescheduled', 'Completed', 'Cancelled'], default: 'Scheduled' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Interview', interviewSchema);

