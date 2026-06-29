const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipientRole: { type: String, enum: ['student', 'recruiter', 'admin'], required: true, index: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    type: {
      type: String,
      enum: ['announcement', 'application_status', 'interview_scheduled', 'interview_updated', 'system'],
      required: true,
    },
    title: { type: String, required: true, maxlength: 120 },
    message: { type: String, required: true, maxlength: 2000 },
    metadata: { type: Object, default: {} },
    channels: {
      inApp: { type: Boolean, default: true },
      email: { type: Boolean, default: false },
      sms: { type: Boolean, default: false },
      whatsapp: { type: Boolean, default: false },
    },
    delivered: {
      emailAt: { type: Date, default: null },
      smsAt: { type: Date, default: null },
      whatsappAt: { type: Date, default: null },
    },
    readAt: { type: Date, default: null, index: true },
  },
  { timestamps: true }
);

notificationSchema.index({ recipientRole: 1, recipient: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);

