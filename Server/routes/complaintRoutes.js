const express = require('express');
const Complaint = require('../models/Complaint');
const Listing = require('../models/Listing');
const Notification = require('../models/Notification');
const verifyToken = require('../middleware/auth');

const router = express.Router();

// FILE A COMPLAINT (Restaurant or NGO)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { listingId, category, subject, description, urgency } = req.body;

    if (!listingId || !category || !subject || !description) {
      return res.status(400).json({ message: 'All fields (listing, category, subject, description) are required' });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) return res.status(404).json({ message: 'Associated listing not found' });

    const isRestaurant = req.user.role === 'restaurant' && listing.restaurant.toString() === req.user.id;
    const isNgo = req.user.role === 'ngo' && listing.claimedBy?.toString() === req.user.id;

    if (!isRestaurant && !isNgo) {
      return res.status(403).json({ message: 'You can only file a complaint for exchanges you participated in' });
    }

    const existing = await Complaint.findOne({ listing: listingId, filedBy: req.user.id });
    if (existing) {
      return res.status(400).json({ message: 'You have already submitted a complaint for this pickup' });
    }

    const complaint = await Complaint.create({
      listing: listingId,
      filedBy: req.user.id,
      filedByModel: isRestaurant ? 'Restaurant' : 'NGO',
      againstUser: isRestaurant ? listing.claimedBy : listing.restaurant,
      againstModel: isRestaurant ? 'NGO' : 'Restaurant',
      category,
      subject,
      description,
      urgency: urgency || 'Medium',
      status: 'Pending'
    });

    // Notify the other party
    await Notification.create({
      recipientType: isRestaurant ? 'ngo' : 'restaurant',
      recipientId: isRestaurant ? listing.claimedBy : listing.restaurant,
      message: `An issue report was submitted regarding the ${listing.foodType} pickup. Admin is reviewing it.`,
      listing: listingId
    });

    res.status(201).json({ message: 'Complaint submitted successfully and forwarded to Admin', complaint });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET COMPLAINTS FILED BY OR AGAINST ME (Restaurant or NGO)
router.get('/my', verifyToken, async (req, res) => {
  try {
    const [filedByMe, filedAgainstMe] = await Promise.all([
      Complaint.find({ filedBy: req.user.id })
        .populate('listing', 'foodType quantity location status')
        .populate('againstUser', 'name location email')
        .sort({ createdAt: -1 }),
      Complaint.find({ againstUser: req.user.id })
        .populate('listing', 'foodType quantity location status')
        .populate('filedBy', 'name location email')
        .sort({ createdAt: -1 })
    ]);

    res.json({ filedByMe, filedAgainstMe });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET ALL COMPLAINTS (Admin only)
router.get('/admin', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { status, urgency } = req.query;
    const filter = {};
    if (status && status !== 'all') filter.status = status;
    if (urgency && urgency !== 'all') filter.urgency = urgency;

    const complaints = await Complaint.find(filter)
      .populate('listing', 'foodType quantity location status')
      .populate('filedBy', 'name email location')
      .populate('againstUser', 'name email location')
      .sort({ createdAt: -1 });

    const [total, pending, investigating, resolved] = await Promise.all([
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: 'Pending' }),
      Complaint.countDocuments({ status: 'Under Investigation' }),
      Complaint.countDocuments({ status: 'Resolved' })
    ]);

    res.json({
      complaints,
      counts: { total, pending, investigating, resolved }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// UPDATE COMPLAINT STATUS & RESOLUTION (Admin only)
router.patch('/:id/status', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { status, adminResolution } = req.body;
    if (!['Pending', 'Under Investigation', 'Resolved', 'Dismissed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const complaint = await Complaint.findById(req.id || req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    complaint.status = status;
    if (adminResolution !== undefined) complaint.adminResolution = adminResolution;
    if (status === 'Resolved' || status === 'Dismissed') {
      complaint.resolvedAt = new Date();
    }
    await complaint.save();

    // Notify the complainant
    await Notification.create({
      recipientType: complaint.filedByModel.toLowerCase(),
      recipientId: complaint.filedBy,
      message: `Your complaint regarding "${complaint.subject}" has been marked as ${status}. Resolution: ${adminResolution || 'Reviewed by Admin.'}`,
      listing: complaint.listing
    });

    res.json({ message: 'Complaint status updated', complaint });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
