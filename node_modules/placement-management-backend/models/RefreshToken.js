const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    role: { type: String, enum: ['student', 'recruiter', 'admin'], required: true, index: true },
    tokenHash: { type: String, required: true, unique: true },
    revokedAt: { type: Date, default: null },
    expiresAt: { type: Date, required: true, index: true },
    createdByIp: { type: String, default: '' },
    revokedByIp: { type: String, default: '' },
    replacedByTokenHash: { type: String, default: '' },
  },
  { timestamps: true }
);

refreshTokenSchema.index({ userId: 1, role: 1 });

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);

