const Student = require('../models/Student');
const Recruiter = require('../models/Recruiter');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Announcement = require('../models/Announcement');

const getDashboard = async (req, res) => {
  try {
    const [totalStudents, totalRecruiters, approvedRecruiters, pendingRecruiters, totalJobs, totalApplications] =
      await Promise.all([
        Student.countDocuments({ isActive: true }),
        Recruiter.countDocuments(),
        Recruiter.countDocuments({ isApproved: true }),
        Recruiter.countDocuments({ isApproved: false }),
        Job.countDocuments({ isActive: true }),
        Application.countDocuments(),
      ]);

    const statusBreakdown = await Application.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    res.json({
      totalStudents,
      totalRecruiters,
      approvedRecruiters,
      pendingRecruiters,
      totalJobs,
      totalApplications,
      statusBreakdown,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStudents = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || '1'), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '20'), 1), 100);
    const skip = (page - 1) * limit;

    const { q, branch } = req.query;
    const filter = {};
    if (branch) filter.branch = branch;
    if (q) {
      const rx = new RegExp(String(q), 'i');
      filter.$or = [{ name: rx }, { email: rx }, { branch: rx }];
    }

    const [total, students] = await Promise.all([
      Student.countDocuments(filter),
      Student.find(filter).select('-password').sort({ createdAt: -1 }).skip(skip).limit(limit),
    ]);

    res.json({ items: students, total, page, limit, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleStudentStatus = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    student.isActive = !student.isActive;
    await student.save();
    res.json({ message: `Student ${student.isActive ? 'activated' : 'deactivated'}`, student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRecruiters = async (req, res) => {
  try {
    const filter = {};
    if (req.query.pending === 'true') filter.isApproved = false;

    const page = Math.max(parseInt(req.query.page || '1'), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '20'), 1), 100);
    const skip = (page - 1) * limit;

    const { q } = req.query;
    if (q) {
      const rx = new RegExp(String(q), 'i');
      filter.$or = [{ companyName: rx }, { hrName: rx }, { email: rx }, { phone: rx }];
    }

    const [total, recruiters] = await Promise.all([
      Recruiter.countDocuments(filter),
      Recruiter.find(filter).select('-password').sort({ createdAt: -1 }).skip(skip).limit(limit),
    ]);

    res.json({ items: recruiters, total, page, limit, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const approveRecruiter = async (req, res) => {
  try {
    const recruiter = await Recruiter.findById(req.params.id);
    if (!recruiter) return res.status(404).json({ message: 'Recruiter not found' });

    recruiter.isApproved = true;
    await recruiter.save();
    res.json({ message: 'Recruiter approved', recruiter });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const rejectRecruiter = async (req, res) => {
  try {
    const recruiter = await Recruiter.findById(req.params.id);
    if (!recruiter) return res.status(404).json({ message: 'Recruiter not found' });

    await recruiter.deleteOne();
    res.json({ message: 'Recruiter rejected and removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleRecruiterStatus = async (req, res) => {
  try {
    const recruiter = await Recruiter.findById(req.params.id);
    if (!recruiter) return res.status(404).json({ message: 'Recruiter not found' });

    recruiter.isActive = !recruiter.isActive;
    await recruiter.save();
    res.json({ message: `Recruiter ${recruiter.isActive ? 'activated' : 'deactivated'}`, recruiter });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate('recruiter', 'companyName')
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.create({
      ...req.body,
      createdBy: req.user._id,
    });
    res.status(201).json(announcement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAnnouncements = async (req, res) => {
  try {
    const filter = { isActive: true };
    if (req.userRole !== 'admin') {
      filter.$or = [{ targetRole: 'all' }, { targetRole: req.userRole }];
    }

    const announcements = await Announcement.find(filter).sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCompanyWiseReport = async (req, res) => {
  try {
    const report = await Application.aggregate([
      {
        $lookup: {
          from: 'jobs',
          localField: 'job',
          foreignField: '_id',
          as: 'jobData',
        },
      },
      { $unwind: '$jobData' },
      {
        $lookup: {
          from: 'recruiters',
          localField: 'jobData.recruiter',
          foreignField: '_id',
          as: 'recruiterData',
        },
      },
      { $unwind: '$recruiterData' },
      {
        $group: {
          _id: '$recruiterData.companyName',
          totalApplications: { $sum: 1 },
          shortlisted: { $sum: { $cond: [{ $eq: ['$status', 'Shortlisted'] }, 1, 0] } },
          selected: { $sum: { $cond: [{ $eq: ['$status', 'Selected'] }, 1, 0] } },
          rejected: { $sum: { $cond: [{ $eq: ['$status', 'Rejected'] }, 1, 0] } },
        },
      },
      { $sort: { totalApplications: -1 } },
    ]);

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBranchWiseReport = async (req, res) => {
  try {
    const report = await Application.aggregate([
      {
        $lookup: {
          from: 'students',
          localField: 'student',
          foreignField: '_id',
          as: 'studentData',
        },
      },
      { $unwind: '$studentData' },
      {
        $group: {
          _id: '$studentData.branch',
          totalApplications: { $sum: 1 },
          shortlisted: { $sum: { $cond: [{ $eq: ['$status', 'Shortlisted'] }, 1, 0] } },
          selected: { $sum: { $cond: [{ $eq: ['$status', 'Selected'] }, 1, 0] } },
          avgCgpa: { $avg: '$studentData.cgpa' },
        },
      },
      { $sort: { totalApplications: -1 } },
    ]);

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboard,
  getStudents,
  toggleStudentStatus,
  getRecruiters,
  approveRecruiter,
  rejectRecruiter,
  toggleRecruiterStatus,
  getAllJobs,
  createAnnouncement,
  getAnnouncements,
  getCompanyWiseReport,
  getBranchWiseReport,
};
