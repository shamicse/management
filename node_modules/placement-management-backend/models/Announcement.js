const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    targetRole: { type: String, enum: ['all', 'student', 'recruiter'], default: 'all' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Announcement', announcementSchema);
