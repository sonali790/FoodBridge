const express = require('express');
const Notification = require('../models/Notification');
const verifyToken = require('../middleware/auth');

const router = express.Router();

// GET my notifications
router.get('/mine', verifyToken, async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipientType: req.user.role,
      recipientId: req.user.id
    }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// MARK ONE as read
router.patch('/:id/read', verifyToken, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    if (notification.recipientId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not your notification' });
    }
    notification.read = true;
    await notification.save();
    res.json({ message: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;