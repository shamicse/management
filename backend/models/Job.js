const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    salary: { type: String, required: true },
    location: { type: String, default: '' },
    jobType: { type: String, enum: ['Full-time', 'Internship', 'Contract'], default: 'Full-time' },
    criteria: {
      minCgpa: { type: Number, default: 0 },
      branches: [{ type: String }],
      maxBacklogs: { type: Number, default: 5 },
    },
    deadline: { type: Date, required: true },
    recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'Recruiter', required: true },
    isActive: { type: Boolean, default: true },
    vacancies: { type: Number, default: 1 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);
