const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  scheduleInterview,
  updateInterview,
  getStudentInterviews,
  getRecruiterInterviews,
} = require('../controllers/interviewController');

const router = express.Router();

router.post('/applications/:applicationId/schedule', protect, authorize('recruiter'), scheduleInterview);
router.put('/:id', protect, authorize('recruiter'), updateInterview);
router.get('/student/me', protect, authorize('student'), getStudentInterviews);
router.get('/recruiter/me', protect, authorize('recruiter'), getRecruiterInterviews);

module.exports = router;

