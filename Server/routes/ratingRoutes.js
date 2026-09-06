const express = require('express');
const Rating = require('../models/Rating');
const Listing = require('../models/Listing');
const verifyToken = require('../middleware/auth');

const router = express.Router();

// SUBMIT a rating
router.post('/', verifyToken, async (req, res) => {
  try {
    const { listingId, stars, comment, isComplaint } = req.body;
    const listing = await Listing.findById(listingId);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (listing.status !== 'Picked Up') {
      return res.status(400).json({ message: 'Can only rate after pickup is confirmed' });
    }

    const isRestaurant = req.user.role === 'restaurant' && listing.restaurant.toString() === req.user.id;
    const isNgo = req.user.role === 'ngo' && listing.claimedBy?.toString() === req.user.id;
    if (!isRestaurant && !isNgo) {
      return res.status(403).json({ message: 'You were not part of this exchange' });
    }

    const existing = await Rating.findOne({ listing: listingId, fromType: req.user.role, fromId: req.user.id });
    if (existing) return res.status(400).json({ message: 'You already rated this exchange' });

    const rating = await Rating.create({
      listing: listingId,
      fromType: req.user.role,
      fromId: req.user.id,
      fromModel: isRestaurant ? 'Restaurant' : 'NGO',
      toType: isRestaurant ? 'ngo' : 'restaurant',
      toId: isRestaurant ? listing.claimedBy : listing.restaurant,
      toModel: isRestaurant ? 'NGO' : 'Restaurant',
      stars,
      comment,
      isComplaint: !!isComplaint
    });

    res.status(201).json({ message: 'Rating submitted', rating });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET ratings received by me
router.get('/received', verifyToken, async (req, res) => {
  try {
    const ratings = await Rating.find({ toType: req.user.role, toId: req.user.id })
      .populate('listing', 'foodType quantity')
      .populate('fromId', 'name')
      .sort({ createdAt: -1 });
    const avg = ratings.length
      ? (ratings.reduce((sum, r) => sum + r.stars, 0) / ratings.length).toFixed(1)
      : null;

    await Rating.updateMany({ toType: req.user.role, toId: req.user.id, seenByRecipient: false }, { seenByRecipient: true });

    res.json({ ratings, average: avg });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET ratings I gave
router.get('/given', verifyToken, async (req, res) => {
  try {
    const ratings = await Rating.find({ fromType: req.user.role, fromId: req.user.id })
      .populate('listing', 'foodType quantity')
      .populate('toId', 'name')
      .sort({ createdAt: -1 });
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// EDIT a rating I gave
router.patch('/:id', verifyToken, async (req, res) => {
  try {
    const rating = await Rating.findById(req.params.id);
    if (!rating) return res.status(404).json({ message: 'Rating not found' });
    if (rating.fromType !== req.user.role || rating.fromId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only edit your own rating' });
    }
    const { stars, comment, isComplaint } = req.body;
    if (stars !== undefined) rating.stars = stars;
    if (comment !== undefined) rating.comment = comment;
    if (isComplaint !== undefined) rating.isComplaint = isComplaint;
    await rating.save();
    res.json({ message: 'Rating updated', rating });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE a rating I gave
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const rating = await Rating.findById(req.params.id);
    if (!rating) return res.status(404).json({ message: 'Rating not found' });
    if (rating.fromType !== req.user.role || rating.fromId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own rating' });
    }
    await rating.deleteOne();
    res.json({ message: 'Rating deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET completed exchanges I haven't rated yet
router.get('/pending', verifyToken, async (req, res) => {
  try {
    const filter = req.user.role === 'restaurant'
      ? { restaurant: req.user.id, status: 'Picked Up' }
      : { claimedBy: req.user.id, status: 'Picked Up' };

    const listings = await Listing.find(filter)
      .populate('restaurant', 'name')
      .populate('claimedBy', 'name');

    const myRatings = await Rating.find({ fromType: req.user.role, fromId: req.user.id });
    const ratedListingIds = myRatings.map((r) => r.listing.toString());

    const pending = listings.filter((l) => !ratedListingIds.includes(l._id.toString()));
    res.json(pending);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Combined badge count: reviews you owe + new ratings you've received but haven't seen
router.get('/badge-count', verifyToken, async (req, res) => {
  try {
    const filter = req.user.role === 'restaurant'
      ? { restaurant: req.user.id, status: 'Picked Up' }
      : { claimedBy: req.user.id, status: 'Picked Up' };

    const listings = await Listing.find(filter);
    const myRatings = await Rating.find({ fromType: req.user.role, fromId: req.user.id });
    const ratedListingIds = myRatings.map((r) => r.listing.toString());
    const pendingCount = listings.filter((l) => !ratedListingIds.includes(l._id.toString())).length;

    const unseenCount = await Rating.countDocuments({
      toType: req.user.role, toId: req.user.id, seenByRecipient: false
    });

    res.json({ total: pendingCount + unseenCount });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// CHECK if I already rated a listing
router.get('/check/:listingId', verifyToken, async (req, res) => {
  try {
    const existing = await Rating.findOne({
      listing: req.params.listingId, fromType: req.user.role, fromId: req.user.id
    });
    res.json({ alreadyRated: !!existing, ratingId: existing?._id || null });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;