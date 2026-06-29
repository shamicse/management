const express = require('express');
const {
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
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/student/applications', protect, authorize('student'), getMyApplications);
router.get('/recruiter/mine', protect, authorize('recruiter'), getRecruiterJobs);

router.get('/', getJobs);
router.get('/:id', getJobById);

router.post('/', protect, authorize('recruiter'), createJob);
router.post('/:id/apply', protect, authorize('student'), applyForJob);
router.put('/:id', protect, authorize('recruiter'), updateJob);
router.delete('/:id', protect, authorize('recruiter'), deleteJob);
router.get('/:id/applicants', protect, authorize('recruiter'), getJobApplicants);
router.put('/:jobId/applications/:applicationId', protect, authorize('recruiter'), updateApplicationStatus);

module.exports = router;
