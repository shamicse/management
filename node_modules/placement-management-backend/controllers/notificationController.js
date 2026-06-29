const Notification = require('../models/Notification');

const listMyNotifications = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || '1'), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '20'), 1), 100);
    const skip = (page - 1) * limit;

    const filter = { recipientRole: req.userRole, recipient: req.user._id };
    if (req.query.unread === 'true') filter.readAt = null;

    const [items, total] = await Promise.all([
      Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Notification.countDocuments(filter),
    ]);

    res.json({ items, page, limit, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markRead = async (req, res) => {
  try {
    const n = await Notification.findOne({
      _id: req.params.id,
      recipientRole: req.userRole,
      recipient: req.user._id,
    });
    if (!n) return res.status(404).json({ message: 'Notification not found' });

    n.readAt = new Date();
    await n.save();
    res.json(n);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipientRole: req.userRole, recipient: req.user._id, readAt: null },
      { readAt: new Date() }
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { listMyNotifications, markRead, markAllRead };

