const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const recruiterSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true, trim: true },
    hrName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    phone: { type: String, default: '' },
    website: { type: String, default: '' },
    description: { type: String, default: '' },
    isApproved: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    emailVerified: { type: Boolean, default: false },
    emailVerificationTokenHash: { type: String, default: '' },
    emailVerificationExpiresAt: { type: Date, default: null },
    passwordResetTokenHash: { type: String, default: '' },
    passwordResetExpiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);

recruiterSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

recruiterSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Recruiter', recruiterSchema);
