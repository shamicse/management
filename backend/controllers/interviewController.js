const Interview = require('../models/Interview');
const Application = require('../models/Application');
const Job = require('../models/Job');
const { createNotification } = require('../utils/notify');

const scheduleInterview = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { scheduledAt, mode, venue, meetingLink, notes } = req.body;

    const application = await Application.findById(applicationId);
    if (!application) return res.status(404).json({ message: 'Application not found' });

    const job = await Job.findOne({ _id: application.job, recruiter: req.user._id });
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const interview = await Interview.findOneAndUpdate(
      { application: application._id },
      {
        job: job._id,
        application: application._id,
        student: application.student,
        recruiter: req.user._id,
        scheduledAt: new Date(scheduledAt),
        mode: mode || 'Online',
        venue: venue || '',
        meetingLink: meetingLink || '',
        notes: notes || '',
        status: 'Scheduled',
        createdBy: req.user._id,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // keep application status in sync
    if (application.status !== 'Interview') {
      application.status = 'Interview';
      await application.save();
    }

    await createNotification({
      recipientRole: 'student',
      recipient: application.student,
      type: 'interview_scheduled',
      title: 'Interview Scheduled',
      message: `Your interview for "${job.title}" is scheduled on ${new Date(interview.scheduledAt).toLocaleString()}.`,
      metadata: { jobId: String(job._id), applicationId: String(application._id), interviewId: String(interview._id) },
      channels: { inApp: true, email: true },
    });

    res.status(201).json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) return res.status(404).json({ message: 'Interview not found' });
    if (String(interview.recruiter) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { scheduledAt, mode, venue, meetingLink, notes, status } = req.body;
    if (scheduledAt) interview.scheduledAt = new Date(scheduledAt);
    if (mode) interview.mode = mode;
    if (venue !== undefined) interview.venue = venue;
    if (meetingLink !== undefined) interview.meetingLink = meetingLink;
    if (notes !== undefined) interview.notes = notes;
    if (status) interview.status = status;
    if (status === 'Rescheduled') interview.status = 'Rescheduled';

    await interview.save();

    await createNotification({
      recipientRole: 'student',
      recipient: interview.student,
      type: 'interview_updated',
      title: 'Interview Updated',
      message: `Your interview details were updated. Current schedule: ${new Date(interview.scheduledAt).toLocaleString()}.`,
      metadata: { interviewId: String(interview._id), applicationId: String(interview.application), jobId: String(interview.job) },
      channels: { inApp: true, email: true },
    });

    res.json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStudentInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ student: req.user._id })
      .populate('job', 'title salary')
      .populate('recruiter', 'companyName hrName email')
      .sort({ scheduledAt: -1 });
    res.json(interviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRecruiterInterviews = async (req, res) => {
  try {
    const filter = { recruiter: req.user._id };
    if (req.query.jobId) filter.job = req.query.jobId;

    const interviews = await Interview.find(filter)
      .populate('job', 'title')
      .populate('student', 'name email branch cgpa resume')
      .sort({ scheduledAt: -1 });
    res.json(interviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { scheduleInterview, updateInterview, getStudentInterviews, getRecruiterInterviews };

