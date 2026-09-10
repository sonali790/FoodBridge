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
    const pickupPin = Math.floor(1000 + Math.random() * 9000).toString();

    listing.status = 'Claimed';
    listing.claimedBy = req.user.id;
    listing.claimedAt = new Date();
    listing.pickupPin = pickupPin;
    await listing.save();

    await Notification.create({
      recipientType: 'restaurant',
      recipientId: listing.restaurant._id,
      message: `${ngo.name} claimed your ${listing.foodType} listing. Awaiting pickup.`,
      listing: listing._id
    });
    await Notification.create({
      recipientType: 'ngo',
      recipientId: req.user.id,
      message: `You claimed ${listing.foodType} (${listing.quantity}kg) from ${listing.restaurant.name}. Your Pickup PIN is ${pickupPin}.`,
      listing: listing._id
    });

    res.json({ message: 'Listing claimed successfully', pickupPin, listing });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// START PICKUP / MARK EN ROUTE (NGO only)
router.post('/:id/start-pickup', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'ngo') {
      return res.status(403).json({ message: 'Only NGOs can start pickup' });
    }
    const { estimatedArrival, vehicleType } = req.body;
    const listing = await Listing.findById(req.params.id).populate('restaurant', 'name');
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (!listing.claimedBy || listing.claimedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You did not claim this listing' });
    }
    if (listing.status !== 'Claimed') {
      return res.status(400).json({ message: 'Listing must be in Claimed status to start pickup' });
    }

    listing.status = 'Out for Pickup';
    listing.enRouteAt = new Date();
    if (estimatedArrival) listing.estimatedArrival = estimatedArrival;
    if (vehicleType) listing.vehicleType = vehicleType;
    await listing.save();

    const ngo = await NGO.findById(req.user.id);
    await Notification.create({
      recipientType: 'restaurant',
      recipientId: listing.restaurant._id,
      message: `${ngo.name} is now on the way to pick up ${listing.foodType} (ETA: ${estimatedArrival || '15-30 mins'}).`,
      listing: listing._id
    });

    res.json({ message: 'Status updated to Out for Pickup! Drive safely.', listing });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// VERIFY PICKUP WITH 4-DIGIT PIN (Restaurant or NGO)
router.post('/:id/verify-pin', verifyToken, async (req, res) => {
  try {
    const { pin } = req.body;
    if (!pin) return res.status(400).json({ message: '4-digit PIN is required' });

    const listing = await Listing.findById(req.params.id)
      .populate('restaurant', 'name')
      .populate('claimedBy', 'name');

    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    const isRestaurant = req.user.role === 'restaurant' && listing.restaurant._id.toString() === req.user.id;
    const isNgo = req.user.role === 'ngo' && listing.claimedBy?._id.toString() === req.user.id;

    if (!isRestaurant && !isNgo) {
      return res.status(403).json({ message: 'You are not part of this exchange' });
    }

    if (listing.status === 'Picked Up') {
      return res.status(400).json({ message: 'This pickup has already been verified and completed' });
    }

    // Check PIN match
    if (listing.pickupPin && listing.pickupPin !== pin.toString().trim()) {
      return res.status(400).json({ message: 'Invalid 4-digit PIN. Please verify with the NGO driver.' });
    }

    listing.status = 'Picked Up';
    listing.pickedUpAt = new Date();
    await listing.save();

    await Notification.create({
      recipientType: 'ngo',
      recipientId: listing.claimedBy._id,
      message: `Pickup verified! Handover of ${listing.foodType} confirmed by ${listing.restaurant.name}.`,
      listing: listing._id
    });

    await Notification.create({
      recipientType: 'restaurant',
      recipientId: listing.restaurant._id,
      message: `PIN verified successfully! Handover of ${listing.foodType} (${listing.quantity}kg) completed.`,
      listing: listing._id
    });

    res.json({ message: 'Pickup verified and completed successfully! 🎉', listing });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// CONFIRM PICKUP (NGO legacy endpoint updated to support Out for Pickup)
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
    if (!['Claimed', 'Out for Pickup'].includes(listing.status)) {
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

// GET ACTIVE TRACKED PICKUPS (For both Restaurant and NGO Tracker)
router.get('/active-tracked', verifyToken, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'restaurant') {
      query = {
        restaurant: req.user.id,
        status: { $in: ['Notified', 'Claimed', 'Out for Pickup', 'Picked Up'] }
      };
    } else if (req.user.role === 'ngo') {
      query = {
        claimedBy: req.user.id,
        status: { $in: ['Claimed', 'Out for Pickup', 'Picked Up'] }
      };
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }

    const listings = await Listing.find(query)
      .populate('restaurant', 'name location cuisineType email')
      .populate('claimedBy', 'name location email peopleServed')
      .sort({ updatedAt: -1 });

    res.json(listings);
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