const express = require('express');
const {
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
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/announcements', protect, getAnnouncements);

router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboard);
router.get('/students', getStudents);
router.put('/students/:id/toggle', toggleStudentStatus);
router.get('/recruiters', getRecruiters);
router.put('/recruiters/:id/approve', approveRecruiter);
router.delete('/recruiters/:id/reject', rejectRecruiter);
router.put('/recruiters/:id/toggle', toggleRecruiterStatus);
router.get('/jobs', getAllJobs);
router.post('/announcements', createAnnouncement);
router.get('/reports/company', getCompanyWiseReport);
router.get('/reports/branch', getBranchWiseReport);

module.exports = router;
