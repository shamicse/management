const express = require('express');
const { protect } = require('../middleware/auth');
const {
  listMyNotifications,
  markRead,
  markAllRead,
} = require('../controllers/notificationController');

const router = express.Router();

router.use(protect);
router.get('/me', listMyNotifications);
router.put('/:id/read', markRead);
router.put('/me/read-all', markAllRead);

module.exports = router;

