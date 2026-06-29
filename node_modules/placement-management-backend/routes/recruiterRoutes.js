const express = require('express');
const { getProfile, updateProfile } = require('../controllers/recruiterController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect, authorize('recruiter'));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);

module.exports = router;
