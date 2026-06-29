const Job = require('../models/Job');
const Application = require('../models/Application');
const Student = require('../models/Student');
const { createNotification } = require('../utils/notify');

const createJob = async (req, res) => {
  try {
    const job = await Job.create({ ...req.body, recruiter: req.user._id });
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getJobs = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || '1'), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '8'), 1), 50);
    const skip = (page - 1) * limit;

    const filter = { isActive: true };
    const { branch, jobType, q } = req.query;

    if (branch) {
      filter['criteria.branches'] = { $in: [branch, 'All'] };
    }
    if (jobType) {
      filter.jobType = jobType;
    }
    if (q) {
      const rx = new RegExp(String(q), 'i');
      filter.$or = [{ title: rx }, { description: rx }];
    }

    const [total, jobs] = await Promise.all([
      Job.countDocuments(filter),
      Job.find(filter)
        .populate('recruiter', 'companyName hrName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
    ]);

    res.json({ items: jobs, total, page, limit, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('recruiter', 'companyName hrName email website');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRecruiterJobs = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || '1'), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '10'), 1), 50);
    const skip = (page - 1) * limit;
    const { q } = req.query;

    const filter = { recruiter: req.user._id };
    if (q) {
      const rx = new RegExp(String(q), 'i');
      filter.$or = [{ title: rx }, { description: rx }];
    }

    const [total, jobs] = await Promise.all([
      Job.countDocuments(filter),
      Job.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
    ]);

    res.json({ items: jobs, total, page, limit, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateJob = async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, recruiter: req.user._id });
    if (!job) return res.status(404).json({ message: 'Job not found' });

    Object.assign(job, req.body);
    await job.save();
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteJob = async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, recruiter: req.user._id });
    if (!job) return res.status(404).json({ message: 'Job not found' });

    job.isActive = false;
    await job.save();
    res.json({ message: 'Job deactivated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const checkEligibility = (student, job) => {
  if (student.cgpa < job.criteria.minCgpa) {
    return { eligible: false, reason: `Minimum CGPA required: ${job.criteria.minCgpa}` };
  }

  const branches = job.criteria.branches || [];
  if (branches.length > 0 && !branches.includes('All') && !branches.includes(student.branch)) {
    return { eligible: false, reason: `Not eligible for branch: ${student.branch}` };
  }

  if (new Date() > new Date(job.deadline)) {
    return { eligible: false, reason: 'Application deadline has passed' };
  }

  return { eligible: true };
};

const applyForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job || !job.isActive) return res.status(404).json({ message: 'Job not found' });

    const student = await Student.findById(req.user._id);
    const eligibility = checkEligibility(student, job);

    if (!eligibility.eligible) {
      return res.status(400).json({ message: eligibility.reason });
    }

    const existing = await Application.findOne({ student: req.user._id, job: job._id });
    if (existing) return res.status(400).json({ message: 'Already applied for this job' });

    const application = await Application.create({
      student: req.user._id,
      job: job._id,
    });

    await createNotification({
      recipientRole: 'student',
      recipient: req.user._id,
      type: 'system',
      title: 'Application Submitted',
      message: `You successfully applied for "${job.title}".`,
      metadata: { jobId: String(job._id), applicationId: String(application._id) },
      channels: { inApp: true },
    });

    res.status(201).json(application);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Already applied for this job' });
    }
    res.status(500).json({ message: error.message });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user._id })
      .populate({
        path: 'job',
        populate: { path: 'recruiter', select: 'companyName' },
      })
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getJobApplicants = async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, recruiter: req.user._id });
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const applications = await Application.find({ job: job._id })
      .populate('student', 'name email phone branch cgpa resume')
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const job = await Job.findOne({ _id: req.params.jobId, recruiter: req.user._id });
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const application = await Application.findOne({
      _id: req.params.applicationId,
      job: job._id,
    });

    if (!application) return res.status(404).json({ message: 'Application not found' });

    application.status = status;
    if (remarks) application.remarks = remarks;
    await application.save();

    await createNotification({
      recipientRole: 'student',
      recipient: application.student,
      type: 'application_status',
      title: 'Application Status Updated',
      message: `Your application status is now "${application.status}".${remarks ? ` Remarks: ${remarks}` : ''}`,
      metadata: { jobId: String(job._id), applicationId: String(application._id), status: application.status },
      channels: { inApp: true, email: application.status === 'Selected' || application.status === 'Interview' },
    });

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createJob,
  getJobs,
  getJobById,
  getRecruiterJobs,
  updateJob,
  deleteJob,
  applyForJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus,
  checkEligibility,
};
