const express = require('express');
const Listing = require('../models/Listing');
const NGO = require('../models/NGO');
const Notification = require('../models/Notification');
const verifyToken = require('../middleware/auth');

const router = express.Router();

const freshHours = { '1hr': 1, '2hrs': 2, '4hrs': 4, '6+ hrs': 6 };

// CREATE a listing (restaurant only)
router.post('/', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'restaurant') {
      return res.status(403).json({ message: 'Only restaurants can post listings' });
    }
    const { foodType, quantity, freshFor } = req.body;
    const peopleFed = Math.round(quantity / 0.25);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + freshHours[freshFor] * 60 * 60 * 1000);

    const listing = new Listing({
      restaurant: req.user.id,
      foodType,
      quantity,
      peopleFed,
      freshFor,
      expiresAt,
      postedAt: now,
      notifiedAt: now
    });
    await listing.save();

    await Notification.create({
      recipientType: 'restaurant',
      recipientId: req.user.id,
      message: `Your ${foodType} listing (${quantity}kg) is now live.`,
      listing: listing._id
    });

    res.status(201).json({ message: 'Listing posted successfully', listing });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET my listings (restaurant only)
router.get('/mine', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'restaurant') {
      return res.status(403).json({ message: 'Only restaurants can view this' });
    }
    const listings = await Listing.find({ restaurant: req.user.id })
      .populate('claimedBy', 'name')
      .sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET available listings (NGO — location matched, still open)
router.get('/available', verifyToken, async (req, res) => {
  try {
    const allListings = await Listing.find({ status: 'Notified' })
      .populate('restaurant', 'name location cuisineType')
      .sort({ createdAt: -1 });

    if (req.user.role !== 'ngo') {
      return res.json(allListings);
    }

    const ngo = await NGO.findById(req.user.id);
    const matched = allListings.filter(
      (listing) => listing.restaurant?.location === ngo.location
    );
    res.json(matched);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET my claimed pickups (NGO only)
router.get('/my-pickups', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'ngo') {
      return res.status(403).json({ message: 'Only NGOs can view this' });
    }
    const listings = await Listing.find({ claimedBy: req.user.id })
      .populate('restaurant', 'name location')
      .sort({ claimedAt: -1 });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// CLAIM a listing (NGO only)
router.post('/:id/claim', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'ngo') {
      return res.status(403).json({ message: 'Only NGOs can claim listings' });
    }
    const listing = await Listing.findById(req.params.id).populate('restaurant', 'name');
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (listing.status !== 'Notified') {
      return res.status(400).json({ message: 'This listing is no longer available' });
    }

    const ngo = await NGO.findById(req.user.id);
    listing.status = 'Claimed';
    listing.claimedBy = req.user.id;
    listing.claimedAt = new Date();
    await listing.save();

    await Notification.create({
      recipientType: 'restaurant',
      recipientId: listing.restaurant._id,
      message: `${ngo.name} claimed your ${listing.foodType} listing.`,
      listing: listing._id
    });
    await Notification.create({
      recipientType: 'ngo',
      recipientId: req.user.id,
      message: `You claimed ${listing.foodType} (${listing.quantity}kg) from ${listing.restaurant.name}.`,
      listing: listing._id
    });

    res.json({ message: 'Listing claimed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// CONFIRM PICKUP (NGO only, must be the one who claimed it)
router.post('/:id/confirm-pickup', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'ngo') {
      return res.status(403).json({ message: 'Only NGOs can confirm pickup' });
    }
    const listing = await Listing.findById(req.params.id).populate('restaurant', 'name');
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (!listing.claimedBy || listing.claimedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You did not claim this listing' });
    }
    if (listing.status !== 'Claimed') {
      return res.status(400).json({ message: 'This listing is not awaiting pickup' });
    }

    listing.status = 'Picked Up';
    listing.pickedUpAt = new Date();
    await listing.save();

    await Notification.create({
      recipientType: 'restaurant',
      recipientId: listing.restaurant._id,
      message: `Your ${listing.foodType} listing was picked up successfully.`,
      listing: listing._id
    });

    res.json({ message: 'Pickup confirmed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE a listing (owner only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (listing.restaurant.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own listings' });
    }
    await Notification.deleteMany({ listing: listing._id });
    await listing.deleteOne();
    res.json({ message: 'Listing deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;